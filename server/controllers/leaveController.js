const { Leave } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllLeaves = async (req, res) => {
  try {
    console.log("🔍 Fetching user-specific leave requests...");

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { fields = [], actions = [] } = await getFieldPermissions(req.user.id, "Leaves", "read");

    console.log("✅ Permissions for Leaves:", { fields, actions });

    if (!actions.includes("read")) {
      return res.status(403).json({ message: "Access Denied: Missing read permission" });
    }

    const attributes = fields.includes("*") ? undefined : fields;
    const leaves = await Leave.findAll({ 
      where: { userId: req.user.id },  // ✅ Filter by logged-in user
      attributes 
    });

    console.log(`✅ Fetched ${leaves.length} leave requests for user ${req.user.id}.`);
    res.json({ leaves });
  } catch (error) {
    console.error("🔥 Error fetching leaves:", error);
    res.status(500).json({ message: "Error fetching leaves", error: error.message });
  }
};

exports.getLeaveById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.id, "Leaves", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const leave = await Leave.findByPk(req.params.id, { attributes: fields });
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    res.json({ leave });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave request", error: error.message });
  }
};

exports.createLeave = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { type, description, departmentId } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Leave type is required" });
    }

    const leave = await Leave.create({
      userId: req.user.id, // ✅ Every authenticated user can create a leave request
      type,
      description,
      departmentId
    });

    res.status(201).json({ message: "Leave request created successfully", leave });
  } catch (error) {
    console.error("🔥 Error creating leave request:", error);
    res.status(500).json({ message: "Error creating leave request", error: error.message });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { fields, actions } = await getFieldPermissions(req.user.id, "Leaves", "update");

    if (!actions.includes("update")) {
      return res.status(403).json({ message: "Access Denied: Missing update permission" });
    }

    const leave = await Leave.findByPk(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
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

    await leave.update(updatedData);
    res.json({ message: "Leave request updated successfully", leave });
  } catch (error) {
    console.error("🔥 Error updating leave request:", error);
    res.status(500).json({ message: "Error updating leave request", error: error.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { actions } = await getFieldPermissions(req.user.id, "Leaves", "delete");
    if (!actions.includes("delete")) return res.status(403).json({ message: "Access Denied" });

    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    await leave.destroy();
    res.json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave request", error: error.message });
  }
};
