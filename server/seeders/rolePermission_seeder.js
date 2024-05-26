module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        // Ensure roles and permissions exist
        const roles = await queryInterface.sequelize.query(
          `SELECT id FROM Roles;`
        );
        const permissions = await queryInterface.sequelize.query(
          `SELECT id FROM Permissions;`
        );
  
        if (roles[0].length === 0 || permissions[0].length === 0) {
          throw new Error('Roles or Permissions not found. Seed them first.');
        }
  
        await queryInterface.bulkInsert('RolePermissions', [
          {
            roleId: roles[0][0].id, // Assuming the first role is superadmin
            permissionId: permissions[0][0].id, // Assuming the first permission is READ
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            roleId: roles[0][0].id, // Assuming the first role is superadmin
            permissionId: permissions[0][1].id, // Assuming the second permission is WRITE
            createdAt: new Date(),
            updatedAt: new Date()
          }
          // Add more role-permission mappings as needed
        ]);
      } catch (error) {
        console.error('Error in RolePermission Seeder:', error);
      }
    },
  
    down: async (queryInterface, Sequelize) => {
      try {
        await queryInterface.bulkDelete('RolePermissions', null, {});
      } catch (error) {
        console.error('Error in RolePermission Seeder:', error);
      }
    }
  };
  