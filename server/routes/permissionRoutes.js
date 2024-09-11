const express = require('express');
const { Permission } = require('../models');
const { checkPermissions } = require('../middlewares/auth');
const router = express.Router();

// Create a new permission
router.post('/', checkPermissions(['create_permission']), async (req, res) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all permissions
router.get('/', checkPermissions(['view_permissions']), async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific permission
router.get('/:id', checkPermissions(['view_permission']), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.status(200).json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a permission
router.put('/:id', checkPermissions(['edit_permission']), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    await permission.update(req.body);
    res.status(200).json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a permission
router.delete('/:id', checkPermissions(['delete_permission']), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    await permission.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
