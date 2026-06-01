const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // As we don't have Order model yet, let's mock order data
    const totalOrders = 0;
    const totalRevenue = 0;
    const recentOrders = [];
    
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
