const { UnpaidLeave } = require('../models');

exports.getAllUnpaidLeaves = async (req, res) => {
  try {
    const leaves = await UnpaidLeave.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnpaidLeaveById = async (req, res) => {
  try {
    const leave = await UnpaidLeave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Unpaid Leave not found' });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUnpaidLeave = async (req, res) => {
  try {
    const leave = await UnpaidLeave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUnpaidLeave = async (req, res) => {
  try {
    const leave = await UnpaidLeave.update(req.body, { where: { id: req.params.id } });
    if (!leave[0]) return res.status(404).json({ message: 'Unpaid Leave not found' });
    res.status(200).json({ message: 'Unpaid Leave updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUnpaidLeave = async (req, res) => {
  try {
    const leave = await UnpaidLeave.destroy({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: 'Unpaid Leave not found' });
    res.status(200).json({ message: 'Unpaid Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
