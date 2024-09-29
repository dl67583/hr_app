const { ProjectRoleAssignment } = require('../models');

exports.getAllProjectRoleAssignments = async (req, res) => {
  try {
    const assignments = await ProjectRoleAssignment.findAll();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectRoleAssignmentById = async (req, res) => {
  try {
    const assignment = await ProjectRoleAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProjectRoleAssignment = async (req, res) => {
  try {
    const assignment = await ProjectRoleAssignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProjectRoleAssignment = async (req, res) => {
  try {
    const assignment = await ProjectRoleAssignment.update(req.body, { where: { id: req.params.id } });
    if (!assignment[0]) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProjectRoleAssignment = async (req, res) => {
  try {
    const assignment = await ProjectRoleAssignment.destroy({ where: { id: req.params.id } });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
