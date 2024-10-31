// const jwt = require('jsonwebtoken');
// const { Role, User, RolePermission } = require('../models');  // Ensure Role is imported
// const accessSecret = 'access_token_secret';  // Replace with your actual secret
// const refreshSecret = 'refresh_token_secret'; // Replace with your actual secret

// const generateToken = async (userId) => {
//   // Fetch the user with role and department details from the database
//   const userWithRoleAndDepartment = await User.findByPk(userId, {
//     include: [
//       { model: Role, as: 'Role' },  // Fetch user's role
//       { model: Department, as: 'Department' },  // Fetch user's department
//     ]
//   });

//   if (!userWithRoleAndDepartment || !userWithRoleAndDepartment.Role) {
//     throw new Error('User has no role assigned.');
//   }

//   // Extract role and department information
//   const role = { id: userWithRoleAndDepartment.Role.id, name: userWithRoleAndDepartment.Role.name };
//   const department = userWithRoleAndDepartment.Department
//     ? { id: userWithRoleAndDepartment.Department.id, name: userWithRoleAndDepartment.Department.name }
//     : null;

//   // Generate JWT with role and department included
//   const token = jwt.sign(
//     { 
//       id: userWithRoleAndDepartment.id, 
//       username: userWithRoleAndDepartment.username, 
//       role, 
//       department 
//     }, 
//     accessSecret, 
//     { expiresIn: '1h' }
//   );

//   return token;
// };




// // Generate Refresh Token (expires in 7 days)
// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { 
//       id: user.id, 
//       username: user.username, 
//       iat: Math.floor(Date.now() / 1000)  // Include 'iat' to ensure the token is unique
//     }, 
//     refreshSecret, 
//     { expiresIn: '7d' }
//   );
// };

// // Authentication middleware
// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, accessSecret, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Invalid Token.', error: err.message });
//       }

//       console.log('Decoded user:', user);  // Check if roles are included now
//       req.user = user;

//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };



// // Refresh token endpoint
// const refreshAccessToken = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     return res.status(400).json({ message: 'Refresh token required.' });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, refreshSecret);
//     const newToken = await generateToken(decoded);  // Await the new token generation
//     res.status(200).json({ token: newToken });
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid refresh token.' });
//   }
// };

// // const checkPermissions = (requiredPermission, scope, projectId = null, departmentId = null) => {
// //   return async (req, res, next) => {
// //     // Extract token from the authorization header
// //     const authHeader = req.headers.authorization;
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     }

// //     const token = authHeader.split(' ')[1]; // Extract the token
// //     try {
// //       // Decode the token to get user details
// //       const decodedToken = jwt.verify(token, accessSecret);
// //       const { role, department } = decodedToken;

// //       console.log('Decoded token role and department:', role, department);

// //       if (!role) {
// //         return res.status(403).json({ message: 'User has no role assigned.' });
// //       }

// //       // Add your permission checking logic based on `role` and `department`
// //       // e.g., query RolePermission table to validate role permissions
// //       const permission = await RolePermission.findOne({
// //         where: {
// //           permissionType: requiredPermission,
// //           scope: scope,
// //           roleId: role.id, // Use the role from the decoded token
// //           ...(projectId && { projectId }), // Optional project ID filtering
// //           ...(departmentId && { departmentId }), // Optional department ID filtering
// //         }
// //       });

// //       if (!permission) {
// //         return res.status(403).json({ message: 'You do not have the required permissions.' });
// //       }

// //       next(); // Proceed to the next middleware if permissions are valid
// //     } catch (error) {
// //       console.error('Token verification error:', error);
// //       return res.status(403).json({ message: 'Invalid token.' });
// //     }
// //   };
// // };

// // Login route
// const login = async (req, res) => {
//   const { username, password } = req.body;

//   // Replace this with actual logic to find the user and validate credentials
//   const user = await findUserByUsernameAndPassword(username, password); 

//   if (user) {
//     // Fetch role and department, and generate token server-side
//     const accessToken = await generateToken(user.id);  // Generate token with role and department
//     const refreshToken = generateRefreshToken(user);  // Optional: Generate refresh token

//     // Send tokens and user info to the client
//     res.json({ accessToken, refreshToken, user });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };


// module.exports = { authenticateJWT, generateToken, refreshAccessToken, generateRefreshToken, login };
