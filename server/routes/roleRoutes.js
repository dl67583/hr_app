const express = require('express');
const { Role, Permission, RolePermission } = require('../models');
const { checkPermissions } = require('../middlewares/auth');
const router = express.Router();

// Create a new role
router.post('/', checkPermissions(['create_role']), async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all roles
router.get('/', checkPermissions(['view_roles']), async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific role
router.get('/:id', checkPermissions(['view_role']), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a role
router.put('/:id', checkPermissions(['edit_role']), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    await role.update(req.body);
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a role
router.delete('/:id', checkPermissions(['delete_role']), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    await role.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign permissions to a role
router.post('/:id/permissions', checkPermissions(['assign_permissions']), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const permissions = await Permission.findAll({
      where: {
        id: req.body.permissionIds
      }
    });

    await role.setPermissions(permissions);
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
