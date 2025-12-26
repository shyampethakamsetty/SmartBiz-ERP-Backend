const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(authorize('admin', 'manager'), getEmployees)
  .post(authorize('admin'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('admin', 'manager'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;

