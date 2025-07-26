const express = require('express');
const router = express.Router();
const dashboardRoutes = require('./dashboardRoutes');

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Default route
router.get('/api', (req, res) => {
  res.json({
    message: 'JPNews API is running',
    version: '1.0.0',
    endpoints: {
      dashboard: '/dashboard'
    }
  });
});

module.exports = router; 