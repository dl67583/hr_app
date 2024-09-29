const express = require('express');
const db = require('./models');
const path = require('path');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectRoutes = require('./routes/projectRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const requestRoutes = require('./routes/requestRoutes');
const timeAttendanceRoutes = require('./routes/timeAttendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes'); // Leave routes (combined maternity, paternity, etc.)

// Create the Express app
const app = express();

// Set the port for the backend
const PORT = process.env.PORT || 3001;

// Enable CORS for requests coming from other origins (e.g., frontend running on port 3000)
app.use(cors());  // Allows requests from any origin. Optionally, restrict to specific origins.

// Enable Express to parse incoming JSON requests
app.use(express.json());

// Use the routes for the various API endpoints
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/time-attendance', timeAttendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);  // Routes for all leave types (maternity, medical, etc.)

// Sync the database and start the server
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Optionally, add any scheduled jobs if necessary
  // schedulePayments();
});

// Serve static files from the React frontend (if applicable)
app.use(express.static(path.join(__dirname, '../client/public')));

// Send all requests to the frontend (React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

module.exports = app;
