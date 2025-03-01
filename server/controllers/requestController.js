const { Request } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllRequests = async (req, res) => {
  try {
    console.log("🔍 Fetching user-specific requests...");

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { fields = [], actions = [] } = await getFieldPermissions(req.user.id, "Requests", "read");

    console.log("✅ Permissions for Requests:", { fields, actions });

    if (!actions.includes("read")) {
      return res.status(403).json({ message: "Access Denied: Missing read permission" });
    }

    const attributes = fields.includes("*") ? undefined : fields;
    const requests = await Request.findAll({ 
      where: { userId: req.user.id },  // ✅ Filter by logged-in user
      attributes 
    });

    console.log(`✅ Fetched ${requests.length} requests for user ${req.user.id}.`);
    res.json({ requests });
  } catch (error) {
    console.error("🔥 Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};


exports.getRequestById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Requests", "read");
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { typeOfRequest, description } = req.body;
    if (!typeOfRequest) {
      return res.status(400).json({ message: "Request type is required" });
    }

    const request = await Request.create({
      userId: req.user.id, // ✅ Every authenticated user can create a request
      typeOfRequest,
      description,
      status: "pending",
    });

    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    console.error("🔥 Error creating request:", error);
    res.status(500).json({ message: "Error creating request", error: error.message });
  }
};


exports.updateRequest = async (req, res) => {
  try {
    const { fields, actions } = await getFieldPermissions(req.user.id, "Requests", "update");

    if (!actions.includes("update")) {
      return res.status(403).json({ message: "Access Denied: Missing update permission" });
    }

    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const allowedFields = fields.includes("*") ? Object.keys(req.body) : fields;
    const updatedData = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updatedData[key] = req.body[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await request.update(updatedData);
    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("🔥 Error updating request:", error);
    res.status(500).json({ message: "Error updating request", error: error.message });
  }
};


exports.deleteRequest = async (req, res) => {
  try {
    const { actions } = await getFieldPermissions(req.user.id, "Requests", "delete");
    if (!actions.includes("delete")) return res.status(403).json({ message: "Access Denied" });

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.destroy();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting request", error: error.message });
  }
};
