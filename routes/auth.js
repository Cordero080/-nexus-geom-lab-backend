const express = require("express"); // Web framework
const router = express.Router(); // Create router instance
const jwt = require("jsonwebtoken"); // For creating JWT tokens
const { body, validationResult } = require("express-validator"); // Input validation
const User = require("../models/User"); // User database model
const authMiddleware = require("../middleware/auth"); // JWT verification middleware

/**
 * SIGNUP ROUTE
 * POST /api/auth/signup
 * Creates new user account
 * Public (no auth required)
 */
router.post(
  "/signup", // POST /api/auth/signup endpoint
  [
    // Validation rules - check input before processing
    body("username").trim().isLength({ min: 3, max: 30 }), // Username: 3-30 chars
    body("email").trim().isEmail().normalizeEmail(), // Valid email format
    body("password").isLength({ min: 6 }), // Password: min 6 chars
  ],
  async (req, res) => {
    // Route handler function
    try {
      // Check if validation passed
      const errors = validationResult(req); // Get validation results
      if (!errors.isEmpty()) {
        // If any validation failed
        return res.status(400).json({
          // Send 400 Bad Request
          success: false,
          errors: errors.array(), // Array of validation errors
          message: "Validation failed",
        });
      }

      // Extract data from request body
      const { username, email, password } = req.body; // Destructure fields

      // Check if email or username already exists in database
      const existingUser = await User.findOne({
        // Query MongoDB
        $or: [{ email }, { username }], // Match either email OR username
      });

      if (existingUser) {
        // If user already exists
        return res.status(400).json({
          // Send 400 Bad Request
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Username already taken", // Specific error message
        });
      }

      // Create new user object
      const user = new User({
        // Create new user instance
        username,
        email,
        password, // Will be hashed automatically by User model's pre-save hook
        unlockedNoetechs: [], // Start with nothing unlocked - users must earn them
      });

      // Save to database
      await user.save(); // Write to MongoDB (password gets hashed here)

      // Create JWT token
      const token = jwt.sign(
        // Create signed token
        { userId: user._id }, // Payload (what's inside token)
        process.env.JWT_SECRET, // Secret key from .env
        { expiresIn: "7d" } // Token valid for 7 days
      );

      // Send success response with token and user data
      res.status(201).json({
        // Send 201 Created
        success: true,
        message: "Account created successfully",
        token, // Frontend stores this in localStorage
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          unlockedNoetechs: user.unlockedNoetechs, // Empty array initially
        },
      });
    } catch (error) {
      // If anything goes wrong
      res.status(500).json({
        // Send 500 Server Error
        success: false,
        message: "Error creating account",
        error: error.message,
      });
    }
  }
);

/**
 * LOGIN ROUTE
 * POST /api/auth/login
 * Authenticates existing user
 * Public (no auth required)
 */
router.post(
  "/login", // POST /api/auth/login endpoint
  [
    // Validation rules
    body("email").trim().isEmail().normalizeEmail(), // Valid email, normalized (lowercase, no dots in Gmail)
    body("password").notEmpty(), // Password required
  ],
  async (req, res) => {
    // Route handler function
    try {
      // Check validation
      const errors = validationResult(req); // Get validation results
      if (!errors.isEmpty()) {
        // If validation failed
        return res.status(400).json({
          // Send 400 Bad Request
          success: false,
          errors: errors.array(), // Validation error details
        });
      }

      const { email, password } = req.body; // Extract login credentials

      // Find user by email
      const user = await User.findOne({ email }); // Query MongoDB (email already normalized by validator)

      // If no user found, return generic error
      if (!user) {
        // User doesn't exist
        return res.status(401).json({
          // Send 401 Unauthorized
          success: false,
          message: "Invalid email or password", // Don't reveal if email exists (security)
        });
      }

      // Compare provided password with hashed password in database
      const isPasswordValid = await user.comparePassword(password); // Uses bcrypt.compare() from User model method

      // If password wrong, return generic error
      if (!isPasswordValid) {
        // Password doesn't match
        return res.status(401).json({
          // Send 401 Unauthorized
          success: false,
          message: "Invalid email or password", // Same message as above (security)
        });
      }

      // Password correct! Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        // Create signed token
        expiresIn: "7d", // Valid for 7 days
      });

      // Send token and user data back
      res.json({
        // Send 200 OK
        success: true,
        message: "Login successful",
        token, // Frontend stores this in localStorage
        user: {
          id: user._id,
          username: user.username,
          unlockedNoetechs: user.unlockedNoetechs, // Shows what they've unlocked
        },
      });
    } catch (error) {
      // If anything goes wrong
      res.status(500).json({
        // Send 500 Server Error
        success: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  }
);

/**
 * GET PROFILE ROUTE
 * GET /api/auth/me
 * Gets current logged-in user's profile
 * Private (requires valid JWT token in header)
 */
router.get("/me", authMiddleware, async (req, res) => {
  // GET /api/auth/me with auth middleware
  try {
    // authMiddleware already verified token and attached user to req.user
    res.json({
      // Send user profile data
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        unlockedNoetechs: req.user.unlockedNoetechs, // What they've unlocked
        createdAt: req.user.createdAt, // Account creation date
      },
    });
  } catch (error) {
    // If anything goes wrong
    res.status(500).json({
      // Send 500 Server Error
      success: false,
      message: "Error fetching profile",
    });
  }
});

// Export router so index.js can mount it
module.exports = router; // Makes router available to index.js
