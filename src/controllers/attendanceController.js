const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId || req.body.employeeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: new Date(),
      checkIn: new Date(),
    });

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId || req.body.employeeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'No check-in found for today',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today',
      });
    }

    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime;
    const workHours = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workHours = Math.round(workHours * 100) / 100;

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance history
// @route   GET /api/attendance
// @access  Private
const getAttendanceHistory = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const filter = {};

    // Employees can only see their own attendance
    if (req.user.role === 'employee') {
      filter.employeeId = req.user.employeeId;
    } else if (employeeId) {
      filter.employeeId = employeeId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(filter)
      .populate('employeeId', 'firstName lastName email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private
const getTodayAttendance = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate('employeeId', 'firstName lastName email');

    res.json({
      success: true,
      data: attendance || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendanceHistory,
  getTodayAttendance,
};

