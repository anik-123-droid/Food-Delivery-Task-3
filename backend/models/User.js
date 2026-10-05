const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'partner'], default: 'customer' },
  address: { type: String, default: '123 Maple St, Tech Park' },
  mobile: { type: String, default: '' },
  restaurantName: { type: String, default: '' },
  fssaiNo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
