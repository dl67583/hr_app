const { PaidLeave } = require('../models');

exports.getAllPaidLeaves = async (req, res) => {
  try {
    const leaves = await PaidLeave.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaidLeaveById = async (req, res) => {
  try {
    const leave = await PaidLeave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Paid Leave not found' });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPaidLeave = async (req, res) => {
  try {
    const leave = await PaidLeave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaidLeave = async (req, res) => {
  try {
    const leave = await PaidLeave.update(req.body, { where: { id: req.params.id } });
    if (!leave[0]) return res.status(404).json({ message: 'Paid Leave not found' });
    res.status(200).json({ message: 'Paid Leave updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePaidLeave = async (req, res) => {
  try {
    const leave = await PaidLeave.destroy({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: 'Paid Leave not found' });
    res.status(200).json({ message: 'Paid Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
