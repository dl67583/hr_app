const { Leave } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const hasPermission = await getFieldPermissions(req.user.role.id, "Leaves", "read");
    if (!hasPermission) return res.status(403).json({ message: "Access Denied" });

    const leaves = await Leave.findAll();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error });
  }
};

exports.getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const hasPermission = await getFieldPermissions(req.user.role.id, "Leaves", "read");
    if (!hasPermission) return res.status(403).json({ message: "Access Denied" });

    const leave = await Leave.findByPk(id);
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave", error });
  }
};

exports.createLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const hasPermission = await getFieldPermissions(req.user.role.id, "Leaves", "create");
    if (!hasPermission) return res.status(403).json({ message: "Access Denied" });

    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error creating leave", error });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const hasPermission = await getFieldPermissions(req.user.role.id, "Leaves", "update");
    if (!hasPermission) return res.status(403).json({ message: "Access Denied" });

    await Leave.update(req.body, { where: { id } });
    res.json({ message: "Leave updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave", error });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const hasPermission = await getFieldPermissions(req.user.role.id, "Leaves", "delete");
    if (!hasPermission) return res.status(403).json({ message: "Access Denied" });

    await Leave.destroy({ where: { id } });
    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave", error });
  }
};
