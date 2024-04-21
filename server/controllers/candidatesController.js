// controllers/candidateController.js

const { Candidate } = require('../models'); // Import the Candidate model

// Controller for creating a new candidate
exports.createCandidate = async (req, res) => {
  const { email} = req.body
  
  try {
    if (!email ) {
      return res.status(400).json({ message: ' email are required' });
    }  
      if (await User.findOne({ where:  {email:email}  })) {
        return res.status(400).json({ message: 'Email address already exists' });
      }
      
    
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for getting all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a single candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a candidate by ID
exports.updateCandidateById = async (req, res) => {
  const { email} = req.body

  try {
  
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    if (!email ) {
      return res.status(400).json({ message: ' email are required' });
    }  
      if (await User.findOne({ where:  email  })) {
        return res.status(400).json({ message: 'Email address already exists' });
      }
    await candidate.update(req.body);
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a candidate by ID
exports.deleteCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    await candidate.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
