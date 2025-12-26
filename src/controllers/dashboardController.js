const Employee = require('../models/Employee');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private (Admin, Manager)
const getDashboard = async (req, res, next) => {
  try {
    // Total employees
    const totalEmployees = await Employee.countDocuments({ isActive: true });

    // Total sales (completed orders)
    const completedOrders = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = completedOrders.length > 0 ? completedOrders[0].total : 0;

    // Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] },
      isActive: true,
    }).populate('category', 'name');

    // Recent orders
    const recentOrders = await Order.find()
      .populate('items.product', 'name')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // Pending tasks
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    // Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        metrics: {
          totalEmployees,
          totalSales,
          todayAttendance,
          pendingTasks,
          lowStockCount: lowStockProducts.length,
        },
        lowStockProducts,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports
// @route   GET /api/dashboard/reports
// @access  Private (Admin, Manager)
const getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Sales report
    const salesReport = await Order.aggregate([
      { $match: { ...filter, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    // Product sales
    const productSales = await Order.aggregate([
      { $match: { ...filter, status: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        salesReport: salesReport.length > 0 ? salesReport[0] : null,
        topProducts: productSales,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getReports,
};

