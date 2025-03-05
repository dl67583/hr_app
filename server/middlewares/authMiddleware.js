const jwt = require("jsonwebtoken");
const { User, UserRole } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.error("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded Token:", decoded);

    // Fetch user and include role and department
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "departmentId"],
      include: [{ model: UserRole, attributes: ["roleId"], as: "roles" }],
    });

    if (!user) {
      console.error("❌ User not found:", decoded.id);
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // Extract role ID (ensure roles exist)
    const userRole = user.roles.length > 0 ? user.roles[0].roleId : null;

    if (!userRole) {
      console.error("❌ Role not found for user:", user.id);
      return res.status(403).json({ message: "No role assigned to this user" });
    }

    req.user = {
      id: user.id,
      roleId: userRole,
      departmentId: user.departmentId || null, // Ensure departmentId is included
    };

    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("🔥 Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = authenticate;
