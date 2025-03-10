const { User, UserRole, Role, RolePermission, sequelize } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");
const { Op, fn, col } = require("sequelize");

const bcrypt = require("bcryptjs"); // ✅ Ensure bcrypt is imported
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // console.log("🔍 Fetching users for user ID:", req.user.id);

    const { fields = [], scopes = [] } = await getFieldPermissions(req.user.id, "Users", "read");
    // console.log(fields, scopes)
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(403).json({ message: "Access Denied" });
    }

    let whereClause = {};
    if (scopes.includes("department")) whereClause.departmentId = req.user.departmentId;
    else if (!scopes.includes("all")) whereClause.id = req.user.id;

    const users = await User.findAll({
      attributes: fields.includes("*") ? undefined : fields,
      include: [
        {
          model: UserRole,
          attributes: ["roleId"],
          include: [{ model: Role, attributes: ["name"], as: "Role" }],
          as: "roles",
        },
      ],
      where: whereClause,
    });

    const usersWithRoles = users.map((user) => ({
      ...user.toJSON(),
      roleId: user.roles?.[0]?.roleId || null,
      roleName: user.roles?.[0]?.Role?.name || "No Role",
    }));

    console.log("✅ Users fetched:", usersWithRoles.length);
    res.json({ users: usersWithRoles });
  } catch (error) {
    console.error("🔥 Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};exports.getUserById = async (req, res) => {
  try {
    console.log("🔍 Received request to fetch user:", req.params.id);
    console.log("🔑 Authenticated user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // ✅ Get field permissions
    const { fields, scopes } = await getFieldPermissions(req.user.id, "Users", "read");
    console.log("🔍 User permissions:", { fields, scopes });

    if (!fields.length) return res.status(403).json({ message: "Forbidden" });

    // ✅ Ensure essential fields are always included
    const requiredFields = ["id", "name", "email", "daysOff", "sickDaysTaken"];
    const finalFields = fields.includes("*") ? undefined : [...new Set([...fields, ...requiredFields])];

    console.log("✅ Final Fields for Query:", finalFields);

    let whereClause = { id: req.params.id };
    if (scopes.includes("department")) {
      whereClause.departmentId = req.user.departmentId;
      console.log("🔍 Applying department scope:", req.user.departmentId);
    } else if (!scopes.includes("all")) {
      whereClause.id = req.user.id;
      console.log("🔍 Restricting to own user ID:", req.user.id);
    }

    console.log("🔍 Final Where Clause:", whereClause);

    // ✅ Fetch user data
    const user = await User.findOne({ 
      where: whereClause, 
      attributes: finalFields 
    });

    if (!user) {
      console.warn("⚠️ User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ USERRRRR:", user.toJSON());
    res.json({ user });
  } catch (error) {
    console.error("🔥 Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};



exports.createUser = async (req, res) => {
  try {
    if (!req.body.password || req.body.password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    }

    // ✅ Hash password before saving
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // ✅ Create the user
    const user = await User.create(req.body);

    // ✅ Assign role if provided
    if (req.body.roleId) {
      const role = await Role.findByPk(req.body.roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role ID" });
      }

      await UserRole.create({ userId: user.id, roleId: req.body.roleId });
    }

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("🔥 Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get field permissions for update
    const { fields } = await getFieldPermissions(
      req.user.id,
      "Users",
      "update"
    );

    if (
      !fields.includes("*") &&
      !fields.some((field) => Object.keys(req.body).includes(field))
    ) {
      return res.status(403).json({ message: "No allowed fields to update" });
    }
    // ✅ Ignore password update if it's empty or set to "none"
    if (
      req.body.password &&
      req.body.password.trim() !== "" &&
      req.body.password !== "none"
    ) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete req.body.password; // ✅ Prevent empty password from updating
    }
    // ✅ Handle role updates separately (UserRoles table)
    if (req.body.roleId) {
      const role = await Role.findByPk(req.body.roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role ID" });
      }

      await UserRole.destroy({ where: { userId: user.id } }); // ✅ Remove old roles
      await UserRole.create({ userId: user.id, roleId: req.body.roleId }); // ✅ Assign new role
    }

    // ✅ Update user details (excluding roleId, which is handled separately)
    delete req.body.roleId;
    await user.update(req.body);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { fields } = await getFieldPermissions(
      req.user.id,
      "Users",
      "delete"
    );

    if (!fields.includes("*"))
      return res.status(403).json({ message: "Forbidden" });

    const user = await User.findOne({ where: { id: req.params.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.getUserPermissions = async (req, res) => {
  try {
    console.log("🔍 Fetching permissions for user ID:", req.user?.id);

    if (!req.user || !req.user.id) {
      console.warn("❌ Unauthorized: No valid user found");
      return res.status(401).json({ message: "Unauthorized: No valid token" });
    }

    // ✅ Fetch user with role information
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role,
          as: "Roles",
          attributes: ["id", "name"],
          through: { attributes: [] }, // Exclude join table fields
        },
      ],
    });

    if (!user || !user.Roles.length) {
      console.warn("🚨 User has no assigned roles!");
      return res.status(403).json({ message: "User has no assigned roles" });
    }

    // ✅ Fetch role IDs
    const roleIds = user.Roles.map((role) => role.id);

    // ✅ Fetch all permissions for the user's roles
    const rolePermissions = await RolePermission.findAll({
      where: { roleId: roleIds },
      attributes: ["resource", "action", "fields", "scope"],
    });

    if (!rolePermissions.length) {
      console.warn("🚨 No permissions found for this user!");
      return res.status(403).json({ message: "No permissions assigned" });
    }

    // 🔹 Structure permissions
    const resourcePermissions = {};

    rolePermissions.forEach(({ resource, action, fields, scope }) => {
      if (!resourcePermissions[resource]) {
        resourcePermissions[resource] = { actions: [], fields: [], scope };
      }
      if (!resourcePermissions[resource].actions.includes(action)) {
        resourcePermissions[resource].actions.push(action);
      }
      if (!resourcePermissions[resource].fields.includes(fields)) {
        resourcePermissions[resource].fields.push(fields);
      }
    });

    // ✅ Final API Response
    const updatedPermissions = {
      resources: resourcePermissions, // 👈 Now actions are inside resources
    };

    console.log("✅ Returning Permissions:", updatedPermissions);
    res.json(updatedPermissions);
  } catch (error) {
    console.error("🔥 Error fetching permissions:", error);
    res.status(500).json({ message: "Error fetching user permissions", error: error.message });
  }
};







