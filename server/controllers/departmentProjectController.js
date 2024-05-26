const { DepartmentProject } = require('../models');

exports.createDepartmentProject = async (req, res) => {
    try {
        const departmentProject = await DepartmentProject.create(req.body);
        res.status(201).json(departmentProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDepartmentProjects = async (req, res) => {
    try {
        const departmentProjects = await DepartmentProject.findAll();
        res.status(200).json(departmentProjects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDepartmentProjectById = async (req, res) => {
    try {
        const departmentProject = await DepartmentProject.findByPk(req.params.id);
        if (!departmentProject) {
            return res.status(404).json({ error: 'DepartmentProject not found' });
        }
        res.status(200).json(departmentProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateDepartmentProject = async (req, res) => {
    try {
        const departmentProject = await DepartmentProject.findByPk(req.params.id);
        if (!departmentProject) {
            return res.status(404).json({ error: 'DepartmentProject not found' });
        }
        await departmentProject.update(req.body);
        res.status(200).json(departmentProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDepartmentProject = async (req, res) => {
    try {
        const departmentProject = await DepartmentProject.findByPk(req.params.id);
        if (!departmentProject) {
            return res.status(404).json({ error: 'DepartmentProject not found' });
        }
        await departmentProject.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
