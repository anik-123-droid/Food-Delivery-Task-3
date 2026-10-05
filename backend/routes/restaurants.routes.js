const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET All Restaurants or filter by email / id
router.get('/', async (req, res) => {
  try {
    const { email, id } = req.query;
    let query = {};
    if (email) query.email = email.toLowerCase();
    if (id) query.id = id;

    const restaurants = await Restaurant.find(query);
    if (restaurants.length > 0) {
      return res.json({ success: true, restaurants, restaurant: restaurants[0] });
    }

    // Default Fallback Initial Demo Kitchen
    let defaultRest = await Restaurant.findOne({ name: 'Tasty Kitchen' });
    if (!defaultRest) {
      defaultRest = new Restaurant({
        id: 'RESTO-1',
        name: 'Tasty Kitchen',
        ownerName: 'Rahul Sharma',
        mobile: '9876543210',
        address: 'Tech Park Food Court, Sector 5',
        isOnline: false,
        rating: 4.8
      });
      await defaultRest.save();
    }
    res.json({ success: true, restaurants: [defaultRest], restaurant: defaultRest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Specific Restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT / POST Update or Upsert Restaurant Info
router.put('/', async (req, res) => {
  try {
    const targetId = req.body.id || req.body._id;
    const targetEmail = req.body.email ? req.body.email.toLowerCase() : null;

    let restaurant = null;
    if (targetId) {
      restaurant = await Restaurant.findOne({ id: targetId });
    }
    if (!restaurant && targetEmail) {
      restaurant = await Restaurant.findOne({ email: targetEmail });
    }

    if (!restaurant) {
      restaurant = new Restaurant(req.body);
    } else {
      Object.assign(restaurant, req.body);
    }

    await restaurant.save();
    res.json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
