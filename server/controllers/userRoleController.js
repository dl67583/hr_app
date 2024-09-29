const { UserRole } = require('../models');

exports.getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await UserRole.findAll();
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRoleById = async (req, res) => {
  try {
    const userRole = await UserRole.findByPk(req.params.id);
    if (!userRole) return res.status(404).json({ message: 'User Role not found' });
    res.status(200).json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.create(req.body);
    res.status(201).json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.update(req.body, { where: { id: req.params.id } });
    if (!userRole[0]) return res.status(404).json({ message: 'User Role not found' });
    res.status(200).json({ message: 'User Role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.destroy({ where: { id: req.params.id } });
    if (!userRole) return res.status(404).json({ message: 'User Role not found' });
    res.status(200).json({ message: 'User Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
