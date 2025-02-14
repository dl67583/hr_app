const { RolePermission } = require("../models");

exports.getAllRolePermissions = async (req, res) => {
  try {
    const permissions = await RolePermission.findAll();
    res.json({ permissions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching role permissions", error: error.message });
  }
};

exports.getRolePermissionById = async (req, res) => {
  try {
    const permission = await RolePermission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Role Permission not found" });

    res.json({ permission });
  } catch (error) {
    res.status(500).json({ message: "Error fetching role permission", error: error.message });
  }
};

exports.createRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.create(req.body);
    res.status(201).json({ message: "Role Permission created successfully", permission });
  } catch (error) {
    res.status(500).json({ message: "Error creating role permission", error: error.message });
  }
};

exports.updateRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Role Permission not found" });

    await permission.update(req.body);
    res.json({ message: "Role Permission updated successfully", permission });
  } catch (error) {
    res.status(500).json({ message: "Error updating role permission", error: error.message });
  }
};

exports.deleteRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Role Permission not found" });

    await permission.destroy();
    res.json({ message: "Role Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role permission", error: error.message });
  }
};
