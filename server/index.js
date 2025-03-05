const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models"); // Import database connection
require("dotenv").config({ path: "./.env" });
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // ✅ Allow frontend requests
  credentials: true,               // ✅ Allow cookies and authentication headers
}));
// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");
const entityRoleAssignmentRoutes = require("./routes/entityRoleAssignmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const timeAttendanceRoutes = require("./routes/timeAttendanceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")

// Use API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/rolePermissions", rolePermissionRoutes);
app.use("/api/user-roles", userRoleRoutes);
app.use("/api/entity-roles", entityRoleAssignmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/time-attendance", timeAttendanceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve static frontend files if applicable
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

// Database sync with proper logging
db.sequelize.sync({ alter: true, logging: console.log }).then(() => {
  console.log("✅ Database synced successfully");

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ Database sync failed:", err);
});

module.exports = app;
