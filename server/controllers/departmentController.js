const { Department, RolePermission } = require('../models');

module.exports = {
  async getAllDepartments(req, res) {
    try {
      const departments = await Department.findAll();
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createDepartment(req, res) {
    try {
      const { name } = req.body;
      const department = await Department.create({ name });
      res.status(201).json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateDepartment(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      department.name = name;
      await department.save();
      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteDepartment(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      await department.destroy();
      res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
