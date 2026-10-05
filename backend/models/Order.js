const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  customerAddress: { type: String, default: '123 Maple St, Tech Park' },
  restaurantId: { type: String, default: '' },
  restaurantName: { type: String, default: '' },
  restaurantEmail: { type: String, default: '' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['New', 'Preparing', 'Ready', 'Delivered'], default: 'New' },
  paymentMethod: { type: String, default: 'UPI' },
  tableOrDelivery: { type: String, default: 'Delivery' },
  cookingInstruction: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
