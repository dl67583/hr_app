const jwt = require('jsonwebtoken');
const { RolePermission, User } = require('../models');
const secret = "secret";
const refreshSecret = "refresh_secret"; // Refresh token secret

// Token generation (includes role, department, etc.)
const generateToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    roleId: user.roleId,
    departmentId: user.departmentId, // Include departmentId
  };
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Refresh token generation
const generateRefreshToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
};

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded user payload
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token.', error: error.message });
  }
};

// Refresh token endpoint
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const newToken = generateToken(decoded);
    res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
};

// Permission check middleware
const checkPermissions = (requiredPermission, scope, projectId = null, departmentId = null) => {
  return async (req, res, next) => {
    const { roleId, departmentId: userDepartmentId } = req.user;

    const queryOptions = {
      where: {
        roleId,
        permissionType: requiredPermission,
        scope: scope, // Check scope as well
      },
    };

    if (scope === 'department' && userDepartmentId !== departmentId) {
      return res.status(403).json({ message: 'Access Denied. Not part of the department.' });
    }

    if (projectId) queryOptions.where.projectId = projectId;
    if (departmentId) queryOptions.where.departmentId = departmentId;

    const permission = await RolePermission.findOne(queryOptions);
    if (!permission) {
      return res.status(403).json({ message: 'You do not have the required permissions.' });
    }
    next();
  };
};

module.exports = { authenticateJWT, checkPermissions, generateToken, refreshAccessToken, generateRefreshToken };
