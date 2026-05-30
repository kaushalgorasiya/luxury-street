const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
