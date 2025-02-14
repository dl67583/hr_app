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
const getFieldPermissions = async (userId) => {
  try {
    let roleIds = new Set();
    let permissionsByResource = {};

    // Fetch global roles
    const userRoles = await UserRole.findAll({ where: { userId }, include: [{ model: Role }] });
    userRoles.forEach((ur) => roleIds.add(ur.roleId));

    // Fetch entity-specific roles
    const entityRoles = await EntityRoleAssignment.findAll({ where: { userId }, include: [{ model: Role }] });
    entityRoles.forEach((er) => roleIds.add(er.roleId));

    if (roleIds.size > 0) {
      const rolePermissions = await RolePermission.findAll({ where: { roleId: [...roleIds] } });

      for (const perm of rolePermissions || []) {
        if (!permissionsByResource[perm.resource]) {
          permissionsByResource[perm.resource] = { fields: new Set(["id"]), scopes: new Set(), actions: new Set() };
        }

        if (perm.fields) {
          if (perm.fields === "*") {
            permissionsByResource[perm.resource].fields.add("*"); // ✅ Allow all fields
          } else {
            perm.fields.split(",").forEach((field) => permissionsByResource[perm.resource].fields.add(field));
          }
        }

        permissionsByResource[perm.resource].scopes.add(perm.scope);
        permissionsByResource[perm.resource].actions.add(perm.action);
      }
    }

    // ✅ Ensure Superadmin gets full access
    if (roleIds.has(5)) { // Assuming roleId=5 is Superadmin
      Object.keys(permissionsByResource).forEach((resource) => {
        permissionsByResource[resource].scopes.add("all");
        permissionsByResource[resource].actions.add("read");
        permissionsByResource[resource].actions.add("create");
        permissionsByResource[resource].actions.add("update");
        permissionsByResource[resource].actions.add("delete");
        permissionsByResource[resource].fields.add("*");
      });
    }

    // Convert sets to arrays for final response
    Object.keys(permissionsByResource).forEach((resource) => {
      permissionsByResource[resource].fields = Array.from(permissionsByResource[resource].fields || []);
      permissionsByResource[resource].scopes = Array.from(permissionsByResource[resource].scopes || []);
      permissionsByResource[resource].actions = Array.from(permissionsByResource[resource].actions || []);
    });

    if (Object.keys(permissionsByResource).length === 0) {
      return { fields: [], scopes: [], actions: [] }; // ✅ Ensure empty permissions return an array
    }

    console.log("✅ Processed Permissions:", JSON.stringify(permissionsByResource, null, 2));
    return permissionsByResource;
  } catch (error) {
    console.error("🔥 Error fetching permissions:", error);
    return { fields: [], scopes: [], actions: [] };
  }
};


module.exports = { getFieldPermissions };
