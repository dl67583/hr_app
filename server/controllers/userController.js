// controllers/userController.js
const { User, Department } = require('../models');

// Get all users in a department (accessible by department heads)
const getByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const users = await User.findAll({
      where: { departmentId },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for this department.' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by department:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get a specific user (individual access)
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Create a new user
const create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update an existing user
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getByDepartment,
  getById,
  create,
  update,
  deleteUser,
};
