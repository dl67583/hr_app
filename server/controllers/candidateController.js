const { Candidate } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllCandidates = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Candidates", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const candidates = await Candidate.findAll({ attributes: fields });
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Candidates", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const candidate = await Candidate.findByPk(req.params.id, { attributes: fields });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ candidate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate", error: error.message });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Candidates", "create");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const candidate = await Candidate.create(req.body);
    res.status(201).json({ message: "Candidate created successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: "Error creating candidate", error: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Candidates", "update");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await candidate.update(updatedData);
    res.json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Candidates", "delete");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    await candidate.destroy();
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
};
