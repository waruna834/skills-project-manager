const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/personnel-growth', analyticsController.getPersonnelGrowth);
router.get('/utilization', analyticsController.getUtilization);

module.exports = router;