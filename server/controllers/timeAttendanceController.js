const { TimeAttendance } = require('../models');

exports.createTimeAttendance = async (req, res) => {
    try {
        const timeAttendance = await TimeAttendance.create(req.body);
        res.status(201).json(timeAttendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTimeAttendances = async (req, res) => {
    try {
        const timeAttendances = await TimeAttendance.findAll();
        res.status(200).json(timeAttendances);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTimeAttendanceById = async (req, res) => {
    try {
        const timeAttendance = await TimeAttendance.findByPk(req.params.id);
        if (!timeAttendance) {
            return res.status(404).json({ error: 'TimeAttendance not found' });
        }
        res.status(200).json(timeAttendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTimeAttendance = async (req, res) => {
    try {
        const timeAttendance = await TimeAttendance.findByPk(req.params.id);
        if (!timeAttendance) {
            return res.status(404).json({ error: 'TimeAttendance not found' });
        }
        await timeAttendance.update(req.body);
        res.status(200).json(timeAttendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTimeAttendance = async (req, res) => {
    try {
        const timeAttendance = await TimeAttendance.findByPk(req.params.id);
        if (!timeAttendance) {
            return res.status(404).json({ error: 'TimeAttendance not found' });
        }
        await timeAttendance.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
