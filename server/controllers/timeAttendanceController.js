const { TimeAttendance } = require('../models');

// Controller for creating a new time attendance record
exports.createTimeAttendance = async (req, res) => {
  try {
    const timeAttendance = await TimeAttendance.create(req.body);
    res.status(201).json(timeAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for getting all time attendance records
exports.getAllTimeAttendance = async (req, res) => {
  try {
    const timeAttendance = await TimeAttendance.findAll();
    res.status(200).json(timeAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a single time attendance record by ID
exports.getTimeAttendanceById = async (req, res) => {
  try {
    const timeAttendance = await TimeAttendance.findByPk(req.params.id);
    if (!timeAttendance) {
      return res.status(404).json({ message: 'Time attendance record not found' });
    }
    res.status(200).json(timeAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a time attendance record by ID
exports.updateTimeAttendanceById = async (req, res) => {
  try {
    const timeAttendance = await TimeAttendance.findByPk(req.params.id);
    if (!timeAttendance) {
      return res.status(404).json({ message: 'Time attendance record not found' });
    }
    await timeAttendance.update(req.body);
    res.status(200).json(timeAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a time attendance record by ID
exports.deleteTimeAttendanceById = async (req, res) => {
  try {
    const timeAttendance = await TimeAttendance.findByPk(req.params.id);
    if (!timeAttendance) {
      return res.status(404).json({ message: 'Time attendance record not found' });
    }
    await timeAttendance.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
