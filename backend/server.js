const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize } = require('./models/index');

// Import routes
const studentRoutes = require('./routes/students');
const mentorRoutes = require('./routes/mentors');
const scholarshipRoutes = require('./routes/scholarships');
const meetingRoutes = require('./routes/meetings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/meetings', meetingRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Student Dashboard API is running!' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully!');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });