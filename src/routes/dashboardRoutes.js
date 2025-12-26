const express = require('express');
const router = express.Router();
const { getDashboard, getReports } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin', 'manager'));

router.get('/', getDashboard);
router.get('/reports', getReports);

module.exports = router;

