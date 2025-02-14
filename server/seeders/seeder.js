const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("123", 10);

    // 🔹 Insert Departments
    await queryInterface.bulkInsert("Departments", [
      { name: "IT", createdAt: new Date(), updatedAt: new Date() },
      { name: "HR", createdAt: new Date(), updatedAt: new Date() },
      { name: "Finance", createdAt: new Date(), updatedAt: new Date() },
      { name: "Marketing", createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 🔹 Fetch Department IDs
    const departments = await queryInterface.sequelize.query("SELECT id, name FROM Departments;", {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });

    const departmentMap = {};
    departments.forEach(dept => { departmentMap[dept.name] = dept.id; });

    // 🔹 Insert Roles
    await queryInterface.bulkInsert("Roles", [
      { name: "Employee", createdAt: new Date(), updatedAt: new Date() },
      { name: "Manager", createdAt: new Date(), updatedAt: new Date() },
      { name: "IT Manager", createdAt: new Date(), updatedAt: new Date() },
      { name: "HR", createdAt: new Date(), updatedAt: new Date() },
      { name: "Superadmin", createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 🔹 Fetch Role IDs
    const roles = await queryInterface.sequelize.query("SELECT id, name FROM Roles;", {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });

    const roleMap = {};
    roles.forEach(role => { roleMap[role.name] = role.id; });

    // 🔹 Insert Users
    await queryInterface.bulkInsert("Users", [
      { name: "John", surname: "Doe", username: "johndoe", email: "john@example.com", password: hashedPassword, departmentId: departmentMap["IT"], createdAt: new Date(), updatedAt: new Date() },
      { name: "Alice", surname: "Smith", username: "alicesmith", email: "alice@example.com", password: hashedPassword, departmentId: departmentMap["HR"], createdAt: new Date(), updatedAt: new Date() },
      { name: "Bob", surname: "Johnson", username: "bobjohnson", email: "bob@example.com", password: hashedPassword, departmentId: departmentMap["Finance"], createdAt: new Date(), updatedAt: new Date() },
      { name: "Charlie", surname: "Davis", username: "charliedavis", email: "charlie@example.com", password: hashedPassword, departmentId: departmentMap["Marketing"], createdAt: new Date(), updatedAt: new Date() },
      { name: "Super", surname: "Admin", username: "superadmin", email: "superadmin@example.com", password: hashedPassword, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 🔹 Fetch User IDs
    const users = await queryInterface.sequelize.query("SELECT id, email FROM Users;", {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });

    const userMap = {};
    users.forEach(user => { userMap[user.email] = user.id; });

    // 🔹 Assign Roles to Users
    await queryInterface.bulkInsert("UserRoles", [
      { userId: userMap["john@example.com"], roleId: roleMap["Employee"], createdAt: new Date(), updatedAt: new Date() },
      { userId: userMap["alice@example.com"], roleId: roleMap["Manager"], createdAt: new Date(), updatedAt: new Date() },
      { userId: userMap["bob@example.com"], roleId: roleMap["IT Manager"], createdAt: new Date(), updatedAt: new Date() },
      { userId: userMap["charlie@example.com"], roleId: roleMap["HR"], createdAt: new Date(), updatedAt: new Date() },
      { userId: userMap["superadmin@example.com"], roleId: roleMap["Superadmin"], createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 🔹 Define Role Permissions
    const allTables = ["Users", "Departments", "Roles", "UserRoles", "RolePermissions", "Requests", "Leaves", "Payments", "TimeAttendance"];
    const rolePermissions = [];

    // 🔹 Superadmin: Full access to everything
    allTables.forEach(table => {
      ["read", "create", "update", "delete"].forEach(action => {
        rolePermissions.push({
          roleId: roleMap["Superadmin"],
          resource: table,
          action: action,
          fields: "*", 
          scope: "all", 
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // 🔹 Manager: Can manage users in their department, approve requests, and view time attendance
    rolePermissions.push(
      { roleId: roleMap["Manager"], resource: "Users", action: "read", fields: "id,name,email,departmentId", scope: "department", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["Manager"], resource: "Users", action: "update", fields: "email", scope: "department", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["Manager"], resource: "Requests", action: "approve", fields: "*", scope: "department", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["Manager"], resource: "TimeAttendance", action: "read", fields: "*", scope: "department", createdAt: new Date(), updatedAt: new Date() }
    );

    // 🔹 IT Manager: Can create and manage IT users
    rolePermissions.push(
      { roleId: roleMap["IT Manager"], resource: "Users", action: "create", fields: "id,name,email", scope: "department", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["IT Manager"], resource: "Users", action: "update", fields: "email", scope: "department", createdAt: new Date(), updatedAt: new Date() }
    );

    // 🔹 HR: Can manage leaves, requests, and view employees
    rolePermissions.push(
      { roleId: roleMap["HR"], resource: "Users", action: "read", fields: "id,name,email,departmentId", scope: "department", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["HR"], resource: "Leaves", action: "manage", fields: "*", scope: "department", createdAt: new Date(), updatedAt: new Date() }
    );

    // 🔹 Employee: Can only read their own profile and submit requests
    rolePermissions.push(
      { roleId: roleMap["Employee"], resource: "Users", action: "read", fields: "*", scope: "own", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["Employee"], resource: "Departments", action: "read", fields: "*", scope: "own", createdAt: new Date(), updatedAt: new Date() },
      { roleId: roleMap["Employee"], resource: "Requests", action: "create", fields: "*", scope: "own", createdAt: new Date(), updatedAt: new Date() }
    );

    await queryInterface.bulkInsert("RolePermissions", rolePermissions);

    console.log("✅ Database seeded successfully with correct permissions.");
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("RolePermissions", null, {});
    await queryInterface.bulkDelete("UserRoles", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
    await queryInterface.bulkDelete("Departments", null, {});
  }
};
