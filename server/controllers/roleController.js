const { Role } = require('../models');

const roleController = {
  create: async (req, res) => {
    try {
      const role = await Role.create(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
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
  },

  delete: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      await role.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports =roleController