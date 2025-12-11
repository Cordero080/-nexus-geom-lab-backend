// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const sceneRoutes = require('./routes/scenes');

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://cordero080.github.io',
];

// Add FRONTEND_URL from env if set
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// CORS configuration - MUST come before helmet
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list or starts with localhost
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // Reject other origins (return false instead of error to avoid 500)
    callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS FIRST - before any other middleware
app.use(cors(corsOptions));

// Security headers (after CORS)
app.use(helmet());

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/scenes', sceneRoutes);

// Health check routes
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/healthz', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nexus Geom API is running',
    version: '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
