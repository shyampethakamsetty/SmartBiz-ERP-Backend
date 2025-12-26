const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Product routes
router.route('/products')
  .get(getProducts)
  .post(authorize('admin', 'manager'), createProduct);

router.route('/products/:id')
  .get(getProduct)
  .put(authorize('admin', 'manager'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

// Category routes
router.route('/categories')
  .get(getCategories)
  .post(authorize('admin', 'manager'), createCategory);

router.route('/categories/:id')
  .put(authorize('admin', 'manager'), updateCategory)
  .delete(authorize('admin'), deleteCategory);

module.exports = router;

