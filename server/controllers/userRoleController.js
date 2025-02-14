const { UserRole } = require("../models");

exports.getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await UserRole.findAll();
    res.json({ userRoles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user roles", error: error.message });
  }
};

exports.createUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.create(req.body);
    res.status(201).json({ message: "User role assigned successfully", userRole });
  } catch (error) {
    res.status(500).json({ message: "Error assigning user role", error: error.message });
  }
};

exports.deleteUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.findByPk(req.params.id);
    if (!userRole) return res.status(404).json({ message: "User role not found" });

    await userRole.destroy();
    res.json({ message: "User role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user role", error: error.message });
  }
};
