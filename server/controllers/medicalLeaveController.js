const { MedicalLeave } = require('../models');

exports.getAllMedicalLeaves = async (req, res) => {
  try {
    const leaves = await MedicalLeave.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicalLeaveById = async (req, res) => {
  try {
    const leave = await MedicalLeave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Medical Leave not found' });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMedicalLeave = async (req, res) => {
  try {
    const leave = await MedicalLeave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicalLeave = async (req, res) => {
  try {
    const leave = await MedicalLeave.update(req.body, { where: { id: req.params.id } });
    if (!leave[0]) return res.status(404).json({ message: 'Medical Leave not found' });
    res.status(200).json({ message: 'Medical Leave updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedicalLeave = async (req, res) => {
  try {
    const leave = await MedicalLeave.destroy({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: 'Medical Leave not found' });
    res.status(200).json({ message: 'Medical Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
