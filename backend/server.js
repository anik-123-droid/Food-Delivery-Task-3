const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const dishesRoutes = require('./routes/dishes.routes');
const restaurantRoutes = require('./routes/restaurants.routes');
const orderRoutes = require('./routes/orders.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'InnoDine MongoDB Atlas API Server is running smoothly!',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Start Express Server Immediately
app.listen(PORT, () => {
  console.log(`🚀 InnoDine Backend API running at http://localhost:${PORT}`);
  
  // Connect to MongoDB Atlas asynchronously
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => {
        console.log('⚡ Connected successfully to MongoDB Atlas Database!');
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB Atlas Connection Notice:', err.message);
        console.log('💡 Tip: Update MONGODB_URI in backend/.env with your Mongo Atlas connection string.');
      });
  }
});
