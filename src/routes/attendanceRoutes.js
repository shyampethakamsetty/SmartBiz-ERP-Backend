const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAttendanceHistory,
  getTodayAttendance,
} = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/today', getTodayAttendance);
router.get('/', getAttendanceHistory);

module.exports = router;

