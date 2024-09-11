const { ProjectRoleAssignment } = require('../models');

const projectRoleAssignmentController = {
  create: async (req, res) => {
    try {
      const projectRoleAssignment = await ProjectRoleAssignment.create(req.body);
      res.status(201).json(projectRoleAssignment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const projectRoleAssignments = await ProjectRoleAssignment.findAll();
      res.status(200).json(projectRoleAssignments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const projectRoleAssignment = await ProjectRoleAssignment.findByPk(req.params.id);
      if (!projectRoleAssignment) {
        return res.status(404).json({ error: 'ProjectRoleAssignment not found' });
      }
      res.status(200).json(projectRoleAssignment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const projectRoleAssignment = await ProjectRoleAssignment.findByPk(req.params.id);
      if (!projectRoleAssignment) {
        return res.status(404).json({ error: 'ProjectRoleAssignment not found' });
      }
      await projectRoleAssignment.update(req.body);
      res.status(200).json(projectRoleAssignment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const projectRoleAssignment = await ProjectRoleAssignment.findByPk(req.params.id);
      if (!projectRoleAssignment) {
        return res.status(404).json({ error: 'ProjectRoleAssignment not found' });
      }
      await projectRoleAssignment.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = projectRoleAssignmentController;
