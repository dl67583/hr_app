const { Payment } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllPayments = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Payments", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const payments = await Payment.findAll({ attributes: fields });
    res.json({ payments });
  } catch (error) {
    console.error("🔥 Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Payments", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const payment = await Payment.findByPk(req.params.id, { attributes: fields });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json({ payment });
  } catch (error) {
    console.error("🔥 Error fetching payment:", error);
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Payments", "create");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const payment = await Payment.create(req.body);
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error("🔥 Error creating payment:", error);
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Payments", "update");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await payment.update(updatedData);
    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    console.error("🔥 Error updating payment:", error);
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Payments", "delete");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.destroy();
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting payment:", error);
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};
