const { Role } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllRoles = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    console.log("🔍 Fetching roles for user ID:", req.user.id);

    const { fields, scopes } = await getFieldPermissions(req.user.id, "Roles", "read");

    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const roles = await Role.findAll({
      attributes: fields.includes("*") ? undefined : fields, // ✅ Fix SQL syntax error
    });

    console.log("✅ Roles fetched:", roles.length);
    res.json({ roles });
  } catch (error) {
    console.error("🔥 Error fetching roles:", error);
    res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Roles", "read");
    if (!fields.length) return res.status(403).json({ message: "Forbidden" });

    const role = await Role.findByPk(req.params.id, { attributes: fields });
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json({ role });
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Roles", "create");
    if (!fields.includes("*")) return res.status(403).json({ message: "Forbidden" });

    const role = await Role.create(req.body);
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Roles", "update");
    if (!fields.length) return res.status(403).json({ message: "Forbidden" });

    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.update(req.body);
    res.json({ message: "Role updated successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Roles", "delete");
    if (!fields.includes("*")) return res.status(403).json({ message: "Forbidden" });

    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.destroy();
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};
