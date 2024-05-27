const { Request } = require('../models');

exports.createRequest = async (req, res) => {
    try {
        const request = await Request.create(req.body);
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.findAll();
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        await request.update(req.body);
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        await request.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
