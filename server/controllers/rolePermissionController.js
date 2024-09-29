const { RolePermission } = require('../models');

exports.getAllRolePermissions = async (req, res) => {
  try {
    const permissions = await RolePermission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRolePermissionById = async (req, res) => {
  try {
    const permission = await RolePermission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.update(req.body, { where: { id: req.params.id } });
    if (!permission[0]) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json({ message: 'Permission updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRolePermission = async (req, res) => {
  try {
    const permission = await RolePermission.destroy({ where: { id: req.params.id } });
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
