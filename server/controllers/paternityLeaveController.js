const { PaternityLeave } = require('../models');

exports.getAllPaternityLeaves = async (req, res) => {
  try {
    const leaves = await PaternityLeave.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaternityLeaveById = async (req, res) => {
  try {
    const leave = await PaternityLeave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Paternity Leave not found' });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPaternityLeave = async (req, res) => {
  try {
    const leave = await PaternityLeave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaternityLeave = async (req, res) => {
  try {
    const leave = await PaternityLeave.update(req.body, { where: { id: req.params.id } });
    if (!leave[0]) return res.status(404).json({ message: 'Paternity Leave not found' });
    res.status(200).json({ message: 'Paternity Leave updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePaternityLeave = async (req, res) => {
  try {
    const leave = await PaternityLeave.destroy({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: 'Paternity Leave not found' });
    res.status(200).json({ message: 'Paternity Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
