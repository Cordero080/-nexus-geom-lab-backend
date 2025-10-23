const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

/**
 * SIGNUP ROUTE
 * POST /api/auth/signup
 * Creates new user account
 * Public (no auth required)
 */
router.post(
  "/signup",
  [
    // Validation rules - check input before processing
    body("username").trim().isLength({ min: 3, max: 30 }),
    body("email").trim().isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Check if validation passed
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      // Extract data from request body
      // Same as:
      // const username = req.body.username;
      // const email = req.body.email;
      const { username, email, password } = req.body;

      // Check if email or username already exists in database
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        // Send specific error message
        return res.status(400).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Username already taken",
        });
      }

      // Create new user object
      // Password will be hashed automatically by User model's pre-save hook
      const user = new User({
        username,
        email,
        password,
        unlockedAnimations: [1], // Welcome gift: first animation unlocked!
      });

      // Save to database
      await user.save();

      // Create JWT token (like a special key for this user)
      // Token contains userId and expires in 7 days
      const token = jwt.sign(
        { userId: user._id }, // Payload (what's inside token)
        process.env.JWT_SECRET, // Secret key (from .env)
        { expiresIn: "7d" } // Token valid for 7 days
      );

      // Send success response with token and user data
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        token, // Frontend stores this!
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          unlockedAnimations: user.unlockedAnimations,
        },
      });
    } catch (error) {
      // If anything goes wrong, send error response
      res.status(500).json({
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
  "/login",
  [
    // Validation rules
    body("email").trim().isEmail(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    try {
      // Check validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user by email (converted to lowercase)
      const user = await User.findOne({ email: email.toLowerCase() });

      // If no user found, return generic error (don't reveal if email exists)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Compare provided password with hashed password in database
      // Uses bcrypt.compare() from User model method
      const isPasswordValid = await user.comparePassword(password);

      // If password wrong, return generic error
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Password correct! Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token and user data back
      res.json({
        success: true,
        message: "Login successful",
        token, // Frontend stores this!
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          unlockedAnimations: user.unlockedAnimations, // Shows what they've unlocked!
        },
      });
    } catch (error) {
      res.status(500).json({
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
  try {
    // authMiddleware already verified token and attached user to req.user
    // So we just return that user's data
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        unlockedAnimations: req.user.unlockedAnimations,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

// Export router so server.js can use it
module.exports = router;

// Signup/Login → Server creates token → Send to frontend
// → Frontend stores token in localStorage
// → Every future request includes token in header
// → Server verifies token → Knows who you are!
