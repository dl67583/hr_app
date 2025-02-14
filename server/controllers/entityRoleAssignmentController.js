const { EntityRoleAssignment } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllAssignments = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "EntityRoleAssignment", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const assignments = await EntityRoleAssignment.findAll({ attributes: fields });
    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching entity role assignments", error: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "EntityRoleAssignment", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const assignment = await EntityRoleAssignment.findByPk(req.params.id, { attributes: fields });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignment", error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "EntityRoleAssignment", "create");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const assignment = await EntityRoleAssignment.create(req.body);
    res.status(201).json({ message: "Assignment created successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error creating assignment", error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "EntityRoleAssignment", "update");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const assignment = await EntityRoleAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await assignment.update(updatedData);
    res.json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment", error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "EntityRoleAssignment", "delete");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const assignment = await EntityRoleAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    await assignment.destroy();
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};
