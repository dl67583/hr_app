const bcrypt = require('bcrypt'); // Import bcrypt

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Hash passwords
    const hashedPasswordJohn = await bcrypt.hash('passwordForJohn', 10);
    const hashedPasswordJane = await bcrypt.hash('passwordForJane', 10);
    const hashedPasswordSuperAdmin = await bcrypt.hash('12345678', 10); // Superadmin password

    // Step 2: Seed Roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'regular' },
      { name: 'hr' },
      { name: 'superadmin' },
      { name: 'finance' },
      { name: 'departmentHead' },
      { name: 'projectManager' },
    ]);

    // Step 3: Seed Departments
    await queryInterface.bulkInsert('Departments', [
      { name: 'Finance', departmentHead: null },
      { name: 'HR', departmentHead: null },
    ]);

    // Step 4: Seed Users
    await queryInterface.bulkInsert('Users', [
      {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: hashedPasswordJohn,
        birthday: '1990-01-01',
        hourlyPay: 20.5,
        departmentId: 1, // Assign to Finance
      },
      {
        name: 'Jane',
        surname: 'Smith',
        username: 'janesmith',
        email: 'jane.smith@example.com',
        phone: '0987654321',
        password: hashedPasswordJane,
        birthday: '1992-05-15',
        hourlyPay: 22.0,
        departmentId: 2, // Assign to HR
      },
      {
        name: 'Super',
        surname: 'Admin',
        username: 'superadmin',
        email: 'super.admin@example.com',
        phone: '1112223333',
        password: hashedPasswordSuperAdmin, // Superadmin password
        birthday: '1985-01-01',
        hourlyPay: 50.0,
        departmentId: 1, // Assign to Finance (or any department)
      },
    ]);

    // Step 5: Update departmentHead in Departments
    await queryInterface.bulkUpdate('Departments', { departmentHead: 1 }, { name: 'Finance' });
    await queryInterface.bulkUpdate('Departments', { departmentHead: 2 }, { name: 'HR' });

    // Step 6: Seed Projects
    await queryInterface.bulkInsert('Projects', [
      { name: 'Project Alpha', departmentId: 1 },
      { name: 'Project Beta', departmentId: 2 },
    ]);

    // Step 7: Seed User Roles
    await queryInterface.bulkInsert('UserRoles', [
      { userId: 1, roleId: 1 }, // John -> regular role
      { userId: 2, roleId: 2 }, // Jane -> hr role
      { userId: 3, roleId: 3 }, // Superadmin -> superadmin role
    ]);

    // Step 8: Seed Role Permissions
    await queryInterface.bulkInsert('RolePermissions', [
      // Permissions for regular role
      {
        roleId: 1, // regular role
        permissionType: 'read',
        scope: 'individual',
        resource: 'TimeAttendance',
      },
      {
        roleId: 1, // regular role
        permissionType: 'write',
        scope: 'individual',
        resource: 'Requests',
      },
      
      // Permissions for hr role
      {
        roleId: 2, // hr role
        permissionType: 'read',
        scope: 'department',
        resource: 'Users',
      },
      {
        roleId: 2, // hr role
        permissionType: 'write',
        scope: 'department',
        resource: 'Requests',
      },
      {
        roleId: 2, // hr role
        permissionType: 'read',
        scope: 'all',
        resource: 'TimeAttendance',
      },

      // Permissions for superadmin role
      {
        roleId: 3, // superadmin role
        permissionType: 'read',
        scope: 'all',
        resource: 'AllResources',
      },
      {
        roleId: 3, // superadmin role
        permissionType: 'write',
        scope: 'all',
        resource: 'AllResources',
      },

      // Permissions for finance role
      {
        roleId: 4, // finance role
        permissionType: 'read',
        scope: 'all',
        resource: 'Payment',
      },
      {
        roleId: 4, // finance role
        permissionType: 'write',
        scope: 'all',
        resource: 'Payment',
      },

      // Permissions for department_head role
      {
        roleId: 5, // department_head role
        permissionType: 'read',
        scope: 'team',
        resource: 'Users',
      },
      {
        roleId: 5, // department_head role
        permissionType: 'read',
        scope: 'team',
        resource: 'TimeAttendance',
      },
      {
        roleId: 5, // department_head role
        permissionType: 'write',
        scope: 'team',
        resource: 'Requests',
      },

      // Permissions for project_manager role
      {
        roleId: 6, // project_manager role
        permissionType: 'read',
        scope: 'project',
        resource: 'Users',
      },
      {
        roleId: 6, // project_manager role
        permissionType: 'read',
        scope: 'project',
        resource: 'TimeAttendance',
      },
      {
        roleId: 6, // project_manager role
        permissionType: 'write',
        scope: 'project',
        resource: 'Projects',
      },
    ]);

    // Step 9: Seed Time Attendance
    await queryInterface.bulkInsert('TimeAttendances', [
      {
        userId: 1,
        timeOfEntering: '08:00:00',
        timeOfLeaving: '16:00:00',
      },
      {
        userId: 2,
        timeOfEntering: '09:00:00',
        timeOfLeaving: '17:00:00',
      },
    ]);

    await queryInterface.bulkInsert('ProjectRoleAssignments', [
      { userId: 1, projectId: 1, roleId: 6 }, // John is Project Manager for Project Alpha
      { userId: 2, projectId: 1, roleId: 1 }, // Jane is Regular User for Project Alpha
      { userId: 1, projectId: 2, roleId: 1 }, // John is Regular User for Project Beta
      { userId: 2, projectId: 2, roleId: 6 }, // Jane is Project Manager for Project Beta
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert all seeded data
    await queryInterface.bulkDelete('TimeAttendances', null, {});
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Projects', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
