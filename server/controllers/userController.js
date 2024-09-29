const { User, Role, UserRole, RolePermission } = require('../models');  // Ensure Role, UserRole, and RolePermission are imported

// Fetch all users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,  // Direct reference to Role
        as: 'Role',   // Use the direct association
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update similarly for getUserById
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Role,  // Direct reference to Role
        as: 'Role',   // Use the direct association
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.update(req.body, { where: { id: req.params.id } });
    if (!user[0]) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.destroy({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get permissions for a user
exports.getPermissions = async (userId) => {
  // Fetch user with roles using the junction table
  const userWithRoles = await User.findByPk(userId, {
    include: {
      model: Role,
      as: 'Roles', // Include roles
      through: { attributes: [] },  // Fetch from UserRole without additional attributes
    }
  });

  if (!userWithRoles) {
    throw new Error('User not found');
  }

  // Fetch permissions for each role the user has
  const permissions = await RolePermission.findAll({
    where: {
      roleId: userWithRoles.Roles.map(role => role.id), // Extract roleIds
      permissionType: 'read', // Or 'write' depending on the operation
    }
  });

  return permissions;
};
