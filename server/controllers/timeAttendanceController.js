const { TimeAttendance } = require('../models');

exports.getAllTimeAttendances = async (req, res) => {
  try {
    const attendances = await TimeAttendance.findAll();
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTimeAttendanceById = async (req, res) => {
  try {
    const attendance = await TimeAttendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTimeAttendance = async (req, res) => {
  try {
    const attendance = await TimeAttendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimeAttendance = async (req, res) => {
  try {
    const attendance = await TimeAttendance.update(req.body, { where: { userId: req.params.userId } });
    if (!attendance[0]) return res.status(404).json({ message: 'Attendance not found' });
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTimeAttendance = async (req, res) => {
  try {
    const attendance = await TimeAttendance.destroy({ where: { userId: req.params.userId } });
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
