const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  restaurantName: { type: String, default: '' },
  restaurantId: { type: String, default: '' },
  restaurantEmail: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dish', dishSchema);
