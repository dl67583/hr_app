// const { User, Role, RolePermission, Department } = require('../models');

// const checkPermission = (permissionType, scope, resource = null) => {
//   return async (req, res, next) => {
//     const userId = req.user.id; 
//     const userDepartmentId = req.user.departmentId; 

//     try {
//       // Fetch user roles and permissions
//       const user = await User.findByPk(userId, {
//         include: {
//           model: Role,
//           as: 'Roles',
//           include: {
//             model: RolePermission,
//             as: 'Permissions',
//           },
//         },
//       });

//       if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }

//       // Check if user is a department head and allow department-wide access
//       const department = await Department.findOne({ where: { departmentHead: userId } });
//       if (department) {
//         if (scope === 'department' || scope === 'team') {
//           return next(); 
//         }
//       }

//       // Check role-based permissions
//       const permissions = user.Roles.flatMap((role) =>
//         role.Permissions.filter((perm) =>
//           perm.permissionType === permissionType &&
//           perm.scope === scope &&
//           (!resource || perm.resource === resource)
//         )
//       );

//       if (permissions.length === 0) {
//         return res.status(403).json({ message: 'Permission denied.' });
//       }

//       next(); // Permission granted
//     } catch (error) {
//       console.error('Permission check failed:', error);
//       res.status(500).json({ message: 'Internal server error.' });
//     }
//   };
// };

// module.exports = { checkPermission };
