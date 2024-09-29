const { Candidate } = require('../models');

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.update(req.body, { where: { id: req.params.id } });
    if (!candidate[0]) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.destroy({ where: { id: req.params.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
