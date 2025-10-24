const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try{
    //Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, access denied'
      });
    }

    // VERIFY token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIND USER
    const user = await User.findById(decoded.userId).select('-password');

    if(!user) {
      return res.status(401).json({
        success: false, 
        message: 'User not found'
      });
    }

    // ATTACH USER TO REQUEST
    req.user = user;
    next();
  } catch(error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;


// What This Does:
// javascript

// User makes request with token in header:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Middleware checks:
// 1. Does token exist? ✓
// 2. Is token valid? ✓
// 3. Does user still exist? ✓

// If all pass → req.user = user data → next()
// If any fail → Send 401 error