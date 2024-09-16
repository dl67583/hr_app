// controllers/departmentController.js
const { Department, User } = require('../models');

// Get all departments
const getAll = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get a specific department
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Create a new department
const create = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update a department
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await department.update(req.body);
    res.status(200).json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await department.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteDepartment,
};
