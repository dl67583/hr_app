const { RolePermission } = require('../models');

const rolePermissionController = {
  create: async (req, res) => {
    try {
      const rolePermission = await RolePermission.create(req.body);
      res.status(201).json(rolePermission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const rolePermissions = await RolePermission.findAll();
      res.status(200).json(rolePermissions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const rolePermission = await RolePermission.findByPk(req.params.id);
      if (!rolePermission) {
        return res.status(404).json({ error: 'RolePermission not found' });
      }
      res.status(200).json(rolePermission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const rolePermission = await RolePermission.findByPk(req.params.id);
      if (!rolePermission) {
        return res.status(404).json({ error: 'RolePermission not found' });
      }
      await rolePermission.update(req.body);
      res.status(200).json(rolePermission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const rolePermission = await RolePermission.findByPk(req.params.id);
      if (!rolePermission) {
        return res.status(404).json({ error: 'RolePermission not found' });
      }
      await rolePermission.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = rolePermissionController;
