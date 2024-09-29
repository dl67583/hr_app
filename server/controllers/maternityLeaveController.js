const { MaternityLeave } = require('../models');

exports.getAllMaternityLeaves = async (req, res) => {
  try {
    const leaves = await MaternityLeave.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaternityLeaveById = async (req, res) => {
  try {
    const leave = await MaternityLeave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Maternity Leave not found' });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMaternityLeave = async (req, res) => {
  try {
    const leave = await MaternityLeave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMaternityLeave = async (req, res) => {
  try {
    const leave = await MaternityLeave.update(req.body, { where: { id: req.params.id } });
    if (!leave[0]) return res.status(404).json({ message: 'Maternity Leave not found' });
    res.status(200).json({ message: 'Maternity Leave updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaternityLeave = async (req, res) => {
  try {
    const leave = await MaternityLeave.destroy({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: 'Maternity Leave not found' });
    res.status(200).json({ message: 'Maternity Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
