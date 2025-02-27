const { Request, User } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

/**
 * Get all requests
 */
exports.getAllRequests = async (req, res) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // ✅ Fetch allowed fields for reading requests
    const { fields, scopes, actions } = await getFieldPermissions(
      req.user.id,
      "Requests",
      "read"
    );

    if (!actions.includes("read")) {
      return res
        .status(403)
        .json({ message: "Access Denied: No read permission" });
    }

    // ✅ Apply department filtering if necessary
    let whereClause = {};
    if (scopes.includes("department")) {
      whereClause.userId = req.user.id; // Only see own department requests
    } else if (!scopes.includes("all")) {
      whereClause.userId = req.user.id; // Default: Users only see their own requests
    }

    // ✅ Fetch requests with only allowed fields
    const requests = await Request.findAll({
      attributes: fields.includes("*") ? undefined : fields,
      where: whereClause,
      include: [
        { model: User, attributes: ["name", "surname", "email"], as: "user" },
      ],
    });

    console.log("✅ Requests fetched:", requests.length);
    res.json({ requests });
  } catch (error) {
    console.error("🔥 Error fetching requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

/**
 * Get request by ID
 */
exports.getRequestById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { fields, scopes, actions } = await getFieldPermissions(
      req.user.id,
      "Requests",
      "read"
    );
    if (!actions.includes("read"))
      return res.status(403).json({ message: "Access Denied" });

    let whereClause = { id: req.params.id };
    if (scopes.includes("department")) whereClause.userId = req.user.id;
    else if (!scopes.includes("all")) whereClause.userId = req.user.id;

    const request = await Request.findOne({
      where: whereClause,
      attributes: fields,
    });
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching request", error: error.message });
  }
};

/**
 * Create a new request
 */
exports.createRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { actions } = await getFieldPermissions(
      req.user.id,
      "Requests",
      "create"
    );
    if (!actions.includes("create"))
      return res.status(403).json({ message: "Access Denied" });

    const { typeOfRequest, description } = req.body;
    if (!typeOfRequest)
      return res.status(400).json({ message: "Request type is required" });

    const request = await Request.create({
      userId: req.user.id,
      typeOfRequest,
      description,
      status: "pending",
    });

    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
  }
};

/**
 * Update a request
 */
exports.updateRequest = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // Check permissions for updating the request
    const { fields, actions } = await getFieldPermissions(req.user.id, "Requests", "update");
    if (!actions.includes("update")) {
      return res.status(403).json({ message: "Access Denied: No permission to update" });
    }

    // Fetch the request by ID to ensure it exists
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Ensure the user is allowed to update this request
    if (request.userId !== req.user.id) {
      return res.status(403).json({ message: "Access Denied: You can only update your own requests" });
    }

    // Prepare the data to update, only allow fields that the user has permission to modify
    const updatedData = {};
    const { typeOfRequest, description, status } = req.body;

    if (fields.includes("typeOfRequest") && typeOfRequest) {
      updatedData.typeOfRequest = typeOfRequest;
    }
    if (fields.includes("description") && description) {
      updatedData.description = description;
    }
    if (fields.includes("status") && status) {
      updatedData.status = status;
    }

    // If there are no allowed fields to update, return a 400 error
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update the request
    await request.update(updatedData);

    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("🔥 Error updating request:", error);
    res.status(500).json({ message: "Error updating request", error: error.message });
  }
};


/**
 * Delete a request
 */
exports.deleteRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { actions } = await getFieldPermissions(
      req.user.id,
      "Requests",
      "delete"
    );
    if (!actions.includes("delete"))
      return res.status(403).json({ message: "Access Denied" });

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.destroy();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting request", error: error.message });
  }
};
