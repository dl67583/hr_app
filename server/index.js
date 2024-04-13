const express = require('express');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes')
 const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
var cors = require('cors')

app.use(cors())

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);


db.sequelize.sync().then(() => {
  console.log('Database synced');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
