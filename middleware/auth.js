const jwt = require("jsonwebtoken"); // Library for verifying JWT tokens
const User = require("../models/User"); // User model to query database

const authMiddleware = async (req, res, next) => {
  // Middleware function runs before route handlers
  // req = REQUEST object (contains headers, body, params, etc.)
  // res = RESPONSE object (used to send data back to client)
  // next = FUNCTION to call next middleware or route handler

  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token from "Authorization: Bearer <token>"
    // Example header: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    // After replace: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

    if (!token) {
      // If no token in header
      return res.status(401).json({
        // Send 401 Unauthorized
        success: false,
        message: "No token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validates token signature and expiration
    // Checks: Is signature valid? Has it expired? Has it been tampered with?
    // decoded = { userId: '507f1f77bcf86cd799439011', iat: 1699..., exp: 1700... }
    // If invalid/expired, throws error and jumps to catch block

    // Find user in database
    const user = await User.findById(decoded.userId).select("-password"); // Query MongoDB for user, exclude password field
    // .select('-password') = Don't include password in result
    // user = Full user document without password field

    if (!user) {
      // If user not found in database
      return res.status(401).json({
        // Send 401 Unauthorized
        success: false,
        message: "User not found",
      });
      // User might have been deleted after token was created
    }

    // Attach user to request object
    req.user = user; // Add user document to request (available in route handlers)
    // Now routes/scenes.js can access req.user._id, req.user.username, etc.

    next(); // Continue to next middleware or route handler
    // Proceeds to the actual route handler in routes/scenes.js
  } catch (error) {
    // If token verification fails
    res.status(401).json({
      // Send 401 Unauthorized
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware; // Export middleware for use in routes
