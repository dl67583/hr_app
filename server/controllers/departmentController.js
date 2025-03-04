const { Department } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllDepartments = async (req, res) => {
  try {
    const { fields, actions } = await getFieldPermissions(req.user.id, "Departments", "read");
    if (!actions.includes("read")) return res.status(403).json({ message: "Access Denied" });

    const attributes = fields.includes("*") ? undefined : fields; // ✅ Allow all fields if "*"

    const departments = await Department.findAll({ attributes });    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const { fields, actions } = await getFieldPermissions(req.user.id, "Departments", "read");
    if (!actions.includes("read")) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id, { attributes: fields });
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ department });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department", error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { actions } = await getFieldPermissions(req.user.id, "Departments", "create");
    if (!actions.includes("create")) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.create(req.body);
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { fields, actions } = await getFieldPermissions(req.user.id, "Departments", "update");
    if (!actions.includes("update")) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes("*") || fields.includes(key)) updatedData[key] = req.body[key];
    });

    await department.update(updatedData);
    res.json({ message: "Department updated successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { actions } = await getFieldPermissions(req.user.id, "Departments", "delete");
    if (!actions.includes("delete")) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.destroy();
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};
