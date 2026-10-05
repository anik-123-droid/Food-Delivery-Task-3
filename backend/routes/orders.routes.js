const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET All Orders with optional filtering by restaurantId or customerEmail
router.get('/', async (req, res) => {
  try {
    const { restaurantId, customerEmail } = req.query;
    const filter = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (customerEmail) filter.customerEmail = customerEmail.toLowerCase();

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Create New Order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      restaurantId,
      restaurantName,
      restaurantEmail,
      items,
      subtotal,
      deliveryFee,
      taxes,
      total,
      paymentMethod,
      tableOrDelivery,
      cookingInstruction
    } = req.body;

    const order = new Order({
      customerName,
      customerEmail: customerEmail ? customerEmail.toLowerCase() : '',
      customerPhone,
      customerAddress,
      restaurantId,
      restaurantName,
      restaurantEmail: restaurantEmail ? restaurantEmail.toLowerCase() : '',
      items,
      subtotal,
      deliveryFee,
      taxes,
      total,
      paymentMethod,
      tableOrDelivery,
      cookingInstruction,
      status: 'New'
    });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT Update Order Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
