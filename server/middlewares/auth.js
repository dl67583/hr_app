const jwt = require('jsonwebtoken');
const { Role, User, RolePermission } = require('../models');  // Ensure Role is imported
const accessSecret = 'access_token_secret';  // Replace with your actual secret
const refreshSecret = 'refresh_token_secret'; // Replace with your actual secret

// Fetch roles and generate the token
// Generate Token with Roles
const generateToken = async (user) => {
  console.log(user)
  const userWithRole = await User.getUserById(user.id);

  if (!userWithRole || !userWithRole.Role) {
    throw new Error('No role assigned to the user');
  }

  const role = { id: userWithRole.Role.id, name: userWithRole.Role.name };

  // Generate the JWT with the user's role
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role,  // Include role in the token payload
      iat: Math.floor(Date.now() / 1000),  // Include 'iat' (issued at time)
    }, 
    accessSecret, 
    { expiresIn: '1h' }  // Token valid for 1 hour
  );
};



// Generate Refresh Token (expires in 7 days)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      iat: Math.floor(Date.now() / 1000)  // Include 'iat' to ensure the token is unique
    }, 
    refreshSecret, 
    { expiresIn: '7d' }
  );
};

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid Token.', error: err.message });
      }

      console.log('Decoded user:', user);  // Check if roles are included now
      req.user = user;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};



// Refresh token endpoint
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const newToken = await generateToken(decoded);  // Await the new token generation
    res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
};

// Permission check middleware
const checkPermissions = (requiredPermission, scope, projectId = null, departmentId = null) => {
  return async (req, res, next) => {
    const { roles, departmentId: userDepartmentId } = req.user;

    // Ensure roles exist before calling .map()
    if (!roles || roles.length === 0) {
      return res.status(403).json({ message: 'User has no roles assigned.' });
    }

    const queryOptions = {
      where: {
        permissionType: requiredPermission,
        scope: scope,
      },
    };

    if (scope === 'department' && userDepartmentId !== departmentId) {
      return res.status(403).json({ message: 'Access Denied. Not part of the department.' });
    }

    if (projectId) queryOptions.where.projectId = projectId;
    if (departmentId) queryOptions.where.departmentId = departmentId;

    // Check if the user has any role that meets the permission criteria
    const permission = await RolePermission.findOne({
      ...queryOptions,
      where: {
        ...queryOptions.where,
        roleId: roles.map(role => role.id),  // Check roles from the token
      }
    });

    if (!permission) {
      return res.status(403).json({ message: 'You do not have the required permissions.' });
    }

    next();
  };
};



// Login route
const login = async (req, res) => {
  const { username, password } = req.body;

  // Assume you validate the user's credentials here
  const user = await findUserByUsernameAndPassword(username, password);  // Replace with actual user validation logic

  if (user) {
    // Generate new access and refresh tokens with roles
    const accessToken = await generateToken(user);  // Ensure roles are included
    const refreshToken = generateRefreshToken(user);

    // Return tokens and user information to the frontend
    res.json({ accessToken, refreshToken, user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { authenticateJWT, checkPermissions, generateToken, refreshAccessToken, generateRefreshToken, login };
