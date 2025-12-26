const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      console.log('Please create a .env file with:');
      console.log('MONGODB_URI=mongodb://localhost:27017/smartbiz_erp');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding...');
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:');
    console.error(error.message);
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n💡 Solution: Whitelist your IP address in MongoDB Atlas');
      console.error('   1. Go to: https://cloud.mongodb.com/v2#/security/network/whitelist');
      console.error('   2. Click "Add IP Address"');
      console.error('   3. Click "Add Current IP Address"');
      console.error('   4. Wait 1-2 minutes and try again\n');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n💡 Solution: Check your MongoDB username and password');
      console.error('   1. Go to: https://cloud.mongodb.com/v2#/security/database/users');
      console.error('   2. Verify your database user credentials');
      console.error('   3. Update MONGODB_URI in .env file with correct username:password');
      console.error('   4. Format: mongodb+srv://username:password@cluster.mongodb.net/dbname\n');
      console.error('   Note: Special characters in password need to be URL-encoded');
      console.error('   Example: @ becomes %40, # becomes %23\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Solution: Check your MongoDB connection string and network connection');
    }
    
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Task.deleteMany({});
    await Attendance.deleteMany({});

    // Create Employees
    console.log('Creating employees...');
    const adminEmployee = await Employee.create({
      firstName: 'John',
      lastName: 'Admin',
      email: 'admin@smartbiz.com',
      phone: '+1234567890',
      department: 'Management',
      position: 'Administrator',
      role: 'admin',
      isActive: true,
    });

    const managerEmployee = await Employee.create({
      firstName: 'Jane',
      lastName: 'Manager',
      email: 'manager@smartbiz.com',
      phone: '+1234567891',
      department: 'Operations',
      position: 'Operations Manager',
      role: 'manager',
      isActive: true,
    });

    const employee1 = await Employee.create({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@smartbiz.com',
      phone: '+1234567892',
      department: 'Sales',
      position: 'Sales Representative',
      role: 'employee',
      isActive: true,
    });

    const employee2 = await Employee.create({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@smartbiz.com',
      phone: '+1234567893',
      department: 'Sales',
      position: 'Sales Representative',
      role: 'employee',
      isActive: true,
    });

    const employee3 = await Employee.create({
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@smartbiz.com',
      phone: '+1234567894',
      department: 'Warehouse',
      position: 'Warehouse Associate',
      role: 'employee',
      isActive: true,
    });

    // Create Users
    console.log('Creating users...');
    await User.create({
      email: 'admin@smartbiz.com',
      password: 'admin123',
      role: 'admin',
      employeeId: adminEmployee._id,
      isActive: true,
    });

    await User.create({
      email: 'manager@smartbiz.com',
      password: 'manager123',
      role: 'manager',
      employeeId: managerEmployee._id,
      isActive: true,
    });

    await User.create({
      email: 'alice@smartbiz.com',
      password: 'employee123',
      role: 'employee',
      employeeId: employee1._id,
      isActive: true,
    });

    await User.create({
      email: 'bob@smartbiz.com',
      password: 'employee123',
      role: 'employee',
      employeeId: employee2._id,
      isActive: true,
    });

    await User.create({
      email: 'charlie@smartbiz.com',
      password: 'employee123',
      role: 'employee',
      employeeId: employee3._id,
      isActive: true,
    });

    // Create Categories
    console.log('Creating categories...');
    const electronicsCategory = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and accessories',
    });

    const clothingCategory = await Category.create({
      name: 'Clothing',
      description: 'Apparel and fashion items',
    });

    const furnitureCategory = await Category.create({
      name: 'Furniture',
      description: 'Home and office furniture',
    });

    const booksCategory = await Category.create({
      name: 'Books',
      description: 'Books and publications',
    });

    // Create Products
    console.log('Creating products...');
    const products = await Product.create([
      {
        name: 'Laptop Pro 15',
        description: 'High-performance laptop for professionals',
        category: electronicsCategory._id,
        sku: 'ELEC-LAP-001',
        price: 1299.99,
        stockQuantity: 25,
        minStockLevel: 5,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        category: electronicsCategory._id,
        sku: 'ELEC-MOU-001',
        price: 29.99,
        stockQuantity: 150,
        minStockLevel: 20,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Smartphone X',
        description: 'Latest generation smartphone',
        category: electronicsCategory._id,
        sku: 'ELEC-PHO-001',
        price: 899.99,
        stockQuantity: 8,
        minStockLevel: 10,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Cotton T-Shirt',
        description: '100% cotton comfortable t-shirt',
        category: clothingCategory._id,
        sku: 'CLO-TSH-001',
        price: 19.99,
        stockQuantity: 200,
        minStockLevel: 50,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Jeans Classic',
        description: 'Classic fit denim jeans',
        category: clothingCategory._id,
        sku: 'CLO-JEA-001',
        price: 49.99,
        stockQuantity: 75,
        minStockLevel: 20,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Office Chair',
        description: 'Ergonomic office chair',
        category: furnitureCategory._id,
        sku: 'FUR-CHA-001',
        price: 299.99,
        stockQuantity: 15,
        minStockLevel: 5,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        category: furnitureCategory._id,
        sku: 'FUR-LAM-001',
        price: 39.99,
        stockQuantity: 3,
        minStockLevel: 5,
        unit: 'piece',
        isActive: true,
      },
      {
        name: 'JavaScript Guide',
        description: 'Complete guide to JavaScript programming',
        category: booksCategory._id,
        sku: 'BOO-JAV-001',
        price: 34.99,
        stockQuantity: 50,
        minStockLevel: 10,
        unit: 'piece',
        isActive: true,
      },
    ]);

    // Create Orders
    console.log('Creating orders...');
    const order1 = await Order.create({
      orderNumber: `ORD-${Date.now()}-001`,
      customerName: 'Tech Solutions Inc.',
      customerEmail: 'contact@techsolutions.com',
      customerPhone: '+1987654321',
      items: [
        {
          product: products[0]._id,
          quantity: 2,
          price: products[0].price,
          subtotal: products[0].price * 2,
        },
        {
          product: products[1]._id,
          quantity: 5,
          price: products[1].price,
          subtotal: products[1].price * 5,
        },
      ],
      totalAmount: products[0].price * 2 + products[1].price * 5,
      status: 'completed',
      createdBy: managerEmployee._id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Update product stock for completed order
    await Product.findByIdAndUpdate(products[0]._id, { $inc: { stockQuantity: -2 } });
    await Product.findByIdAndUpdate(products[1]._id, { $inc: { stockQuantity: -5 } });

    const order2 = await Order.create({
      orderNumber: `ORD-${Date.now()}-002`,
      customerName: 'Fashion Store',
      customerEmail: 'orders@fashionstore.com',
      customerPhone: '+1987654322',
      items: [
        {
          product: products[3]._id,
          quantity: 50,
          price: products[3].price,
          subtotal: products[3].price * 50,
        },
        {
          product: products[4]._id,
          quantity: 30,
          price: products[4].price,
          subtotal: products[4].price * 30,
        },
      ],
      totalAmount: products[3].price * 50 + products[4].price * 30,
      status: 'pending',
      createdBy: employee1._id,
    });

    // Update product stock for pending order
    await Product.findByIdAndUpdate(products[3]._id, { $inc: { stockQuantity: -50 } });
    await Product.findByIdAndUpdate(products[4]._id, { $inc: { stockQuantity: -30 } });

    const order3 = await Order.create({
      orderNumber: `ORD-${Date.now()}-003`,
      customerName: 'Home Office Co.',
      customerEmail: 'buy@homeoffice.com',
      customerPhone: '+1987654323',
      items: [
        {
          product: products[5]._id,
          quantity: 3,
          price: products[5].price,
          subtotal: products[5].price * 3,
        },
      ],
      totalAmount: products[5].price * 3,
      status: 'completed',
      createdBy: employee2._id,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    await Product.findByIdAndUpdate(products[5]._id, { $inc: { stockQuantity: -3 } });

    // Create Tasks
    console.log('Creating tasks...');
    await Task.create([
      {
        title: 'Update inventory system',
        description: 'Review and update the inventory management system with new features',
        assignedTo: employee1._id,
        assignedBy: adminEmployee._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Prepare monthly sales report',
        description: 'Compile and analyze sales data for the current month',
        assignedTo: employee2._id,
        assignedBy: managerEmployee._id,
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Organize warehouse',
        description: 'Reorganize warehouse layout for better efficiency',
        assignedTo: employee3._id,
        assignedBy: managerEmployee._id,
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Customer follow-up calls',
        description: 'Follow up with recent customers for feedback',
        assignedTo: employee1._id,
        assignedBy: managerEmployee._id,
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Create Attendance records
    console.log('Creating attendance records...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Today's attendance
    await Attendance.create({
      employeeId: employee1._id,
      date: today,
      checkIn: new Date(today.setHours(9, 0, 0, 0)),
      checkOut: new Date(today.setHours(17, 0, 0, 0)),
      workHours: 8,
      status: 'present',
    });

    await Attendance.create({
      employeeId: employee2._id,
      date: today,
      checkIn: new Date(today.setHours(8, 30, 0, 0)),
      status: 'present',
    });

    // Yesterday's attendance
    await Attendance.create({
      employeeId: employee1._id,
      date: yesterday,
      checkIn: new Date(yesterday.setHours(9, 0, 0, 0)),
      checkOut: new Date(yesterday.setHours(17, 30, 0, 0)),
      workHours: 8.5,
      status: 'present',
    });

    await Attendance.create({
      employeeId: employee2._id,
      date: yesterday,
      checkIn: new Date(yesterday.setHours(9, 0, 0, 0)),
      checkOut: new Date(yesterday.setHours(17, 0, 0, 0)),
      workHours: 8,
      status: 'present',
    });

    await Attendance.create({
      employeeId: employee3._id,
      date: yesterday,
      checkIn: new Date(yesterday.setHours(8, 0, 0, 0)),
      checkOut: new Date(yesterday.setHours(16, 0, 0, 0)),
      workHours: 8,
      status: 'present',
    });

    // Two days ago
    await Attendance.create({
      employeeId: employee1._id,
      date: twoDaysAgo,
      checkIn: new Date(twoDaysAgo.setHours(9, 0, 0, 0)),
      checkOut: new Date(twoDaysAgo.setHours(13, 0, 0, 0)),
      workHours: 4,
      status: 'half-day',
    });

    console.log('✅ Seed data created successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@smartbiz.com / admin123');
    console.log('Manager: manager@smartbiz.com / manager123');
    console.log('Employee: alice@smartbiz.com / employee123');
    console.log('Employee: bob@smartbiz.com / employee123');
    console.log('Employee: charlie@smartbiz.com / employee123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

