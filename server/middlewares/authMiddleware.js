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

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error("❌ User not found:", decoded.id);
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // ✅ Fetch the user's role
    const userRole = await UserRole.findOne({ where: { userId: user.id } });

    if (!userRole) {
      console.error("❌ Role not found for user:", user.id);
      return res.status(403).json({ message: "No role assigned to this user" });
    }

    req.user = { id: user.id, roleId: userRole.roleId, departmentId: user.departmentId }; // ✅ Now roleId is always set
    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("🔥 Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = authenticate;
