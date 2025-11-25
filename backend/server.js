const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const personnelRoutes = require('./src/routes/personnelRoutes');
const skillsRoutes = require('./src/routes/skillsRoutes'); 
const projectsRoutes = require('./src/routes/projectsRoutes');
const allocationsRoutes = require('./src/routes/allocationsRoutes');

// Use routes
app.use('/api/personnel', personnelRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/allocations', allocationsRoutes);

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});