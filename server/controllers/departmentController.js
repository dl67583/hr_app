const { Department } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");

exports.getAllDepartments = async (req, res) => {
  try {
    console.log("🔍 Fetching departments...");

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { fields = [], scopes = [], actions = [] } = await getFieldPermissions(req.user.id, "Departments", "read");

    console.log("✅ Permissions for Departments:", { fields, scopes, actions });

    if (!actions.includes("read")) {
      return res.status(403).json({ message: "Access Denied: Missing read permission" });
    }

    const attributes = fields.includes("*") ? undefined : fields; // ✅ Allow all fields if "*"

    const departments = await Department.findAll({ attributes });

    console.log(`✅ Fetched ${departments.length} departments.`);
    res.json({ departments });
  } catch (error) {
    console.error("🔥 Error fetching departments:", error);
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};




exports.getDepartmentById = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Departments", "read");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id, { attributes: fields });
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ department });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department", error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Departments", "create");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.create(req.body);
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(req.user.role.id, "Departments", "update");
    if (!fields.length) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) updatedData[key] = req.body[key];
    });

    await department.update(updatedData);
    res.json({ message: "Department updated successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const hasPermission = await getFieldPermissions(req.user.role.id, "Departments", "delete");
    if (!hasPermission.length) return res.status(403).json({ message: "Access Denied" });

    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.destroy();
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};
