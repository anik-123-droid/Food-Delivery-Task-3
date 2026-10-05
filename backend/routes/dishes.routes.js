const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Ensure Dish router is ready


// GET All Dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json({ success: true, dishes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Add New Dish
router.post('/', async (req, res) => {
  try {
    const { name, category, price, description, image, inStock, restaurantName, restaurantId, restaurantEmail } = req.body;
    const dish = new Dish({
      name,
      category,
      price,
      description,
      image,
      inStock: inStock !== false,
      restaurantName,
      restaurantId,
      restaurantEmail,
    });
    await dish.save();
    res.json({ success: true, dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT Toggle Dish Stock or Edit Dish
router.put('/:id', async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Dish
router.delete('/:id', async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dish deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
