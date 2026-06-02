const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Top products by stock (or just some products for now)
    const topProducts = await Product.find().populate('brand').populate('category').limit(5);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;
