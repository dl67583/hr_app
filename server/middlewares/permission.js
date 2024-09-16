// middlewares/permission.js

const { User, Role, RolePermission, Department } = require('../models');

// Middleware to check user permissions with department context
const checkPermission = (permissionType, scope, resource = null) => {
  return async (req, res, next) => {
    const userId = req.user.id; // Extract user ID from token or session
    const userDepartmentId = req.user.departmentId; // User's department ID from session or JWT

    try {
      // Fetch user with their roles and permissions
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          as: 'Roles',
          include: {
            model: RolePermission,
            as: 'Permissions',
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if the user is a department head
      const department = await Department.findOne({ where: { departmentHead: userId } });

      // If the user is a department head, grant them department-wide access
      if (department) {
        // Allow department head access to all department data
        if (scope === 'department' || scope === 'team') {
          return next();
        }
      }

      // Otherwise, check permissions based on roles
      const permissions = user.Roles.flatMap((role) =>
        role.Permissions.filter((perm) => 
          perm.permissionType === permissionType && 
          perm.scope === scope &&
          (!resource || perm.resource === resource)
        )
      );

      if (permissions.length === 0) {
        return res.status(403).json({ message: 'Permission denied.' });
      }

      next(); // Permission granted, proceed to the next middleware
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

module.exports = { checkPermission };
