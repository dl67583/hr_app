// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { RolePermission } = require('../models');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send('Invalid Token.');
  }
};

// Checking permissions
const checkPermissions = (requiredPermission, projectId = null, departmentId = null) => {
  return async (req, res, next) => {
    const { roleId } = req.user; // Assuming roleId is included in the JWT payload

    try {
      // Query permissions for the user’s role, potentially restricted to project or department
      const queryOptions = {
        where: {
          roleId,
          permission: requiredPermission
        }
      };
      
      // Apply project or department constraints if applicable
      if (projectId) queryOptions.where.projectId = projectId;
      if (departmentId) queryOptions.where.departmentId = departmentId;

      const permissions = await RolePermission.findOne(queryOptions);

      if (!permissions) {
        return res.status(403).send('You do not have the required permissions.');
      }

      next();
    } catch (error) {
      return res.status(500).send('Error checking permissions.');
    }
  };
};

module.exports = { authenticateJWT, checkPermissions };
