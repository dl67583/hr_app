const { TimeAttendance } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllTimeAttendanceRecords = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(
      req.user.role.id,
      "TimeAttendance",
      "read"
    );
    if (!fields.length)
      return res.status(403).json({ message: "Access Denied" });

    const records = await TimeAttendance.findAll({ attributes: fields });
    res.json({ records });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching time attendance records",
        error: error.message,
      });
  }
};

exports.getTimeAttendanceRecordById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(
      req.user.role.id,
      "TimeAttendance",
      "read"
    );
    if (!fields.length)
      return res.status(403).json({ message: "Access Denied" });

    const record = await TimeAttendance.findByPk(req.params.id, {
      attributes: fields,
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "Time attendance record not found" });

    res.json({ record });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching time attendance record",
        error: error.message,
      });
  }
};

exports.createTimeAttendanceRecord = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(
      req.user.role.id,
      "TimeAttendance",
      "create"
    );
    if (!hasPermission.length)
      return res.status(403).json({ message: "Access Denied" });

    const record = await TimeAttendance.create(req.body);
    res
      .status(201)
      .json({ message: "Time attendance record created successfully", record });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating time attendance record",
        error: error.message,
      });
  }
};

exports.updateTimeAttendanceRecord = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(
      req.user.role.id,
      "TimeAttendance",
      "update"
    );
    if (!fields.length)
      return res.status(403).json({ message: "Access Denied" });

    const record = await TimeAttendance.findByPk(req.params.id);
    if (!record)
      return res
        .status(404)
        .json({ message: "Time attendance record not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await record.update(updatedData);
    res.json({
      message: "Time attendance record updated successfully",
      record,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating time attendance record",
        error: error.message,
      });
  }
};

exports.deleteTimeAttendanceRecord = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(
      req.user.role.id,
      "TimeAttendance",
      "delete"
    );
    if (!hasPermission.length)
      return res.status(403).json({ message: "Access Denied" });

    const record = await TimeAttendance.findByPk(req.params.id);
    if (!record)
      return res
        .status(404)
        .json({ message: "Time attendance record not found" });

    await record.destroy();
    res.json({ message: "Time attendance record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting time attendance record",
        error: error.message,
      });
  }
};

exports.getAttendanceStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const existingRecord = await TimeAttendance.findOne({
      where: { userId, checkOut: null },
    });

    res.json({ isCheckedIn: !!existingRecord });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching attendance status",
        error: error.message,
      });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingRecord = await TimeAttendance.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "You are already checked in." });
    }

    const record = await TimeAttendance.create({
      userId,
      checkIn: new Date(),
    });

    res.status(201).json({ message: "Check-in successful", record });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking in", error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingRecord = await TimeAttendance.findOne({
      where: { userId, checkOut: null },
    });

    if (!existingRecord) {
      return res.status(400).json({ message: "You have not checked in yet." });
    }

    await existingRecord.update({ checkOut: new Date() });

    res.json({ message: "Check-out successful", record: existingRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking out", error: error.message });
  }
};
