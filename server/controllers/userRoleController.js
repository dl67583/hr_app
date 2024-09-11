const { UserRole } = require('../models');

const userRoleController = {
  create: async (req, res) => {
    try {
      const userRole = await UserRole.create(req.body);
      res.status(201).json(userRole);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const userRoles = await UserRole.findAll();
      res.status(200).json(userRoles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const userRole = await UserRole.findByPk(req.params.id);
      if (!userRole) {
        return res.status(404).json({ error: 'UserRole not found' });
      }
      res.status(200).json(userRole);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const userRole = await UserRole.findByPk(req.params.id);
      if (!userRole) {
        return res.status(404).json({ error: 'UserRole not found' });
      }
      await userRole.update(req.body);
      res.status(200).json(userRole);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const userRole = await UserRole.findByPk(req.params.id);
      if (!userRole) {
        return res.status(404).json({ error: 'UserRole not found' });
      }
      await userRole.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = userRoleController;
