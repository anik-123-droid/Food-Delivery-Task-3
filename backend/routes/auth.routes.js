const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Customer / Partner Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, address, mobile, restaurantName, fssaiNo } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }
    user = new User({ name, email, password, role: role || 'customer', address, mobile, restaurantName, fssaiNo });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Customer / Partner Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Email or Password!' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
