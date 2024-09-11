const { Department } = require('../models');

const departmentController = {
  create: async (req, res) => {
    try {
      const department = await Department.create(req.body);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const departments = await Department.findAll();
      res.status(200).json(departments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const department = await Department.findByPk(req.params.id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.status(200).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const department = await Department.findByPk(req.params.id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      await department.update(req.body);
      res.status(200).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const department = await Department.findByPk(req.params.id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      await department.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = departmentController;
