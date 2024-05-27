const { User, UserRole } = require('../models'); // Ensure UserRole is imported
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { generateToken, removeToken } = require('../middlewares/auth');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, surname, username, email, phone, password, birthday, hourlyPay, departmentId, roleId } = req.body;
    const token = null;
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      username,
      email,
      phone,
      password: hashedPassword,
      birthday,
      hourlyPay,
      token,
      departmentId,
    });

    // Create entry in the UserRole table
    if (roleId) {
      await UserRole.create({
        userId: newUser.id,
        roleId
      });
    }

    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      res.status(400).json({ error: `${field} must be unique` });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Retrieve all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, username, email, phone, birthday, hourlyPay, departmentId } = req.body;

    const user = await User.findByPk(id);
    const token = user.token;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await user.update({
      name,
      surname,
      username,
      email,
      phone,
      birthday,
      hourlyPay,
      departmentId,
      token
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      res.status(400).json({ error: `${field} must be unique` });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await removeToken(user.id);
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
