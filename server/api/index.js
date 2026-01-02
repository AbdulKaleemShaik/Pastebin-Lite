const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
// Ensure these paths match your new folder structure
const { apiRouter, publicRouter } = require('../routes/pastes');

const app = express();

app.use(cors());
app.use(express.json());

// Connection Caching Logic
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected to Atlas");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // In serverless, we don't process.exit(1) as it kills the instance
    throw err; 
  }
};

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api', apiRouter);
app.use('/p', publicRouter);

// Export for Vercel
module.exports = app;

// Keep app.listen ONLY for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}