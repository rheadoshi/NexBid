require('dotenv').config();  // <== This loads .env first thing
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

// Create Express app
const app = express();

// Connect to DB
const connectDB = require('./config/db');
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const { generalLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimiter');
app.use('/api/', generalLimiter);

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routing
const authRoutes = require('./routers/auth');
app.use('/api/auth', authLimiter, authRoutes);

const adRoutes = require('./routers/ad');
app.use('/api/ads', adRoutes);


// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
