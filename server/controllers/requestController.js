const { Request } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllRequests = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Requests", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const requests = await Request.findAll({ attributes: fields });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Requests", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const request = await Request.findByPk(req.params.id, { attributes: fields });
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error: error.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Requests", "create");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const request = await Request.create(req.body);
    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Requests", "update");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await request.update(updatedData);
    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating request", error: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Requests", "delete");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.destroy();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting request", error: error.message });
  }
};
