require('dotenv').config();  // <== This loads .env first thing
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Connect to DB
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routing
const authRoutes = require('./routers/auth');
app.use('/api/auth', authRoutes);
const adRoutes = require('./routers/ad');
app.use('/api/ads', adRoutes);


// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
