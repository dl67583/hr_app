const express = require('express');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
const schedulePayments = require('./schedulers/paymentScheduler');
const roleRoutes = require('./routes/roleRoutes')
const projectRoutes = require('./routes/projectRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const requestRoutes = require('./routes/requestRoutes')
const timeAttendanceRoutes = require('./routes/timeAttendanceRoutes')

 const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
var cors = require('cors')

app.use(cors())

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/timeAttendance', timeAttendanceRoutes);


db.sequelize.sync({alter:true}).then(() => {
  console.log('Database synced');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  schedulePayments();

});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});