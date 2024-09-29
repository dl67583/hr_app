const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Hash passwords
    const hashedPassword = await bcrypt.hash('12345678', 10);

    // Step 2: Seed Roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'superadmin' },
      { name: 'hr' },
      { name: 'manager' },
      { name: 'team_lead' },
      { name: 'employee' },
    ]);

    // Step 3: Seed Users
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Super',
        surname: 'Admin',
        username: 'superadmin',
        email: 'super.admin@example.com',
        phone: '1112223333',
        password: hashedPassword,
        birthday: '1985-01-01',
        hourlyPay: 50.0,
      },
      {
        name: 'HR',
        surname: 'Manager',
        username: 'hrmanager',
        email: 'hr.manager@example.com',
        phone: '2223334444',
        password: hashedPassword,
        birthday: '1990-05-15',
        hourlyPay: 40.0,
      },
      {
        name: 'Project',
        surname: 'Manager',
        username: 'projectmanager',
        email: 'project.manager@example.com',
        phone: '3334445555',
        password: hashedPassword,
        birthday: '1988-07-10',
        hourlyPay: 45.0,
      },
      {
        name: 'Team',
        surname: 'Lead',
        username: 'teamlead',
        email: 'team.lead@example.com',
        phone: '4445556666',
        password: hashedPassword,
        birthday: '1992-11-05',
        hourlyPay: 35.0,
      },
      {
        name: 'Employee',
        surname: 'One',
        username: 'employeeone',
        email: 'employee.one@example.com',
        phone: '5556667777',
        password: hashedPassword,
        birthday: '1995-03-25',
        hourlyPay: 30.0,
      },
    ]);

    // Step 4: Seed User Roles
    await queryInterface.bulkInsert('UserRoles', [
      { userId: 1, roleId: 1 }, // Superadmin role
      { userId: 2, roleId: 2 }, // HR role
      { userId: 3, roleId: 3 }, // Manager role
      { userId: 4, roleId: 4 }, // Team Lead role
      { userId: 5, roleId: 5 }, // Employee role
    ]);

    // Step 5: Seed Role Permissions
    await queryInterface.bulkInsert('RolePermissions', [
      // Superadmin has full control
      { roleId: 1, permissionType: 'read', scope: 'all', resource: 'AllResources' },
      { roleId: 1, permissionType: 'write', scope: 'all', resource: 'AllResources' },

      // HR can manage users, attendance, employee details
      { roleId: 2, permissionType: 'read', scope: 'department', resource: 'Users' },
      { roleId: 2, permissionType: 'write', scope: 'department', resource: 'Users' },
      { roleId: 2, permissionType: 'read', scope: 'department', resource: 'TimeAttendance' },
      { roleId: 2, permissionType: 'write', scope: 'department', resource: 'TimeAttendance' },

      // Manager can manage projects and department resources
      { roleId: 3, permissionType: 'read', scope: 'department', resource: 'Projects' },
      { roleId: 3, permissionType: 'write', scope: 'department', resource: 'Projects' },
      { roleId: 3, permissionType: 'read', scope: 'department', resource: 'Resources' },

      // Team Lead can manage team tasks within a project
      { roleId: 4, permissionType: 'read', scope: 'project', resource: 'Tasks' },
      { roleId: 4, permissionType: 'write', scope: 'project', resource: 'Tasks' },

      // Employee can access self-service features
      { roleId: 5, permissionType: 'read', scope: 'individual', resource: 'SelfService' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert all seeded data
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
