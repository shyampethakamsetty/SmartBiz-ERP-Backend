const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0,
  },
  minStockLevel: {
    type: Number,
    default: 10,
    min: 0,
  },
  unit: {
    type: String,
    default: 'piece',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Virtual for low stock alert
productSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.minStockLevel;
});

module.exports = mongoose.model('Product', productSchema);

