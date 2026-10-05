const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, default: 'Kitchen Partner' },
  email: { type: String, default: '' },
  mobile: { type: String, default: '' },
  address: { type: String, default: 'Tech Park Food Court' },
  isOnline: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  fssaiNo: { type: String, default: 'FSSAI-100293847123' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
