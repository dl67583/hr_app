const { UserRole, EntityRoleAssignment, RolePermission, Role, sequelize } = require("../models");

// ✅ Function to check if a table exists in the database
const checkTableExists = async (tableName) => {
  try {
    const [results] = await sequelize.query(`SHOW TABLES LIKE '${tableName}';`);
    return results.length > 0; // ✅ Returns true if table exists, false otherwise
  } catch (error) {
    console.error(`⚠️ Error checking table '${tableName}':`, error);
    return false;
  }
};

const getFieldPermissions = async (userId, resource) => {
  try {
    if (!userId || !resource) {
      throw new Error(`Missing required parameters: userId=${userId}, resource=${resource}`);
    }

    let roleIds = new Set();
    let fields = new Set();
    let scopes = new Set();
    let actions = new Set();

    // Fetch roles assigned to user
    const userRoles = await UserRole.findAll({ where: { userId } });

    userRoles.forEach((ur) => roleIds.add(ur.roleId));

    console.log("🛠️ User Role IDs:", [...roleIds]);

    if (roleIds.size > 0) {
      const rolePermissions = await RolePermission.findAll({
        where: { roleId: [...roleIds], resource },
      });

      console.log("🔍 Role Permissions for resource:", resource, rolePermissions);

      for (const perm of rolePermissions || []) {
        if (perm.fields) {
          if (perm.fields === "*") {
            fields.add("*");
          } else {
            perm.fields.split(",").forEach((field) => fields.add(field));
          }
        }
        scopes.add(perm.scope);
        actions.add(perm.action);
      }
    }

    console.log("✅ Final Permissions:", {
      fields: Array.from(fields),
      scopes: Array.from(scopes),
      actions: Array.from(actions),
    });

    return {
      fields: Array.from(fields),
      scopes: Array.from(scopes),
      actions: Array.from(actions),
    };
  } catch (error) {
    console.error("🔥 Error fetching permissions:", error);
    return { fields: [], scopes: [], actions: [] };
  }
};




module.exports = { getFieldPermissions };
  