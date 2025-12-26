const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(getOrders)
  .post(authorize('admin', 'manager'), createOrder);

router.route('/:id')
  .get(getOrder)
  .put(authorize('admin', 'manager'), updateOrder)
  .delete(authorize('admin'), deleteOrder);

module.exports = router;

