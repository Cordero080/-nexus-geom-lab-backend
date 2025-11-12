// Load environment variables from .env file
require("dotenv").config(); // Must be first - loads env vars like MONGODB_URI, JWT_SECRET

const express = require("express"); // Web framework for Node.js
const cors = require("cors"); // Allow frontend to make requests from different domain
const helmet = require("helmet"); // Security headers middleware
const morgan = require("morgan"); // HTTP request logger
const rateLimit = require("express-rate-limit"); // Prevent abuse by limiting requests
const connectDB = require("./config/db"); // Database connection function

// Import routes
const authRoutes = require("./routes/auth"); // Signup/login routes
const sceneRoutes = require("./routes/scenes"); // Scene CRUD routes

// Initialize Express app
const app = express(); // Create Express application instance

// Connect to MongoDB database
connectDB(); // Establishes connection to MongoDB using URI from .env

// Middleware
app.use(helmet()); // Add security headers to all responses

// Request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // Log requests (detailed in dev, minimal in production)

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true, // Send rate limit info in RateLimit-* headers
  legacyHeaders: false, // Don't send X-RateLimit-* headers
});
app.use(globalLimiter); // Apply to all routes

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all localhost origins in development
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      // Allow production frontend URL
      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      // Reject other origins
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON request bodies automatically
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (form data)

// Log all incoming requests
app.use((req, res, next) => {
  // Simple middleware that just continues
  next(); // Continue to next middleware
});

// Routes
// Tighter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Only 20 requests per 15 min (stricter than global limit)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter, authRoutes); // Mount auth routes with strict rate limit
app.use("/api/scenes", sceneRoutes); // Mount scene routes with global rate limit

// Health check routes
app.get("/health", (req, res) => {
  // Simple health check endpoint
  res.json({ ok: true, uptime: process.uptime() }); // Shows server is running
});

app.get("/", (req, res) => {
  // Root endpoint
  res.json({
    success: true,
    message: "Nexus Geom API is running",
    version: "1.0.0",
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  }
});
