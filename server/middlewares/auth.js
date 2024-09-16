// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { RolePermission,User } = require('../models');
const secret = "secret"

const generateToken = async (user) => {
   const payload = {
     id: user.id,
     username: user.username,
     roleId: user.roleId,  // Add roleId to the token payload
   };
   return jwt.sign(payload, secret, { expiresIn: '1h' });
 };
module.exports = { generateToken };

 
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
 
 const checkPermissions = (requiredPermission, scope, projectId = null, departmentId = null) => {
   return async (req, res, next) => {
     const { roleId } = req.user;
 
     const queryOptions = {
       where: {
         roleId,
         permissionType: requiredPermission,
         scope: scope  // Check scope as well
       }
     };
 
     if (projectId) queryOptions.where.projectId = projectId;
     if (departmentId) queryOptions.where.departmentId = departmentId;
 
     const permission = await RolePermission.findOne(queryOptions);
     if (!permission) {
       return res.status(403).json({ message: 'You do not have the required permissions.' });
     }
     next();
   };
 };
 

module.exports = { authenticateJWT, checkPermissions, generateToken };
