const { User, UserRole, Role, RolePermission, sequelize } = require("../models");
const { getFieldPermissions } = require("../middlewares/checkPermissions");
const { Op, fn, col } = require("sequelize");



exports.getBirthdaysToday = async (req, res) => {
  try {
    console.log("🔍 Route /api/users/birthdays has been hit!");

    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-based
    const day = today.getDate();

    console.log(`✅ Today's Date: ${month}-${day}`);

    // 🚀 Use a raw SQL query instead of Sequelize's Op.
    const users = await sequelize.query(
      `SELECT id, name, surname, birthday FROM Users WHERE MONTH(birthday) = ? AND DAY(birthday) = ?`,
      {
        replacements: [month, day],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("✅ Raw SQL Executed:", `SELECT id, name, surname, birthday FROM Users WHERE MONTH(birthday) = ${month} AND DAY(birthday) = ${day}`);
    console.log("✅ Users with Birthdays Today:", users);

    if (!users.length) {
      console.warn("⚠️ No birthdays found today.");
    }

    // 🚨 Ensure response is properly formatted as a list of birthdays
    res.json({ birthdays: users });
  } catch (error) {
    console.error("🔥 SQL Error:", error);
    res.status(500).json({ message: "Error fetching birthdays", error: error.message });
  }
};
