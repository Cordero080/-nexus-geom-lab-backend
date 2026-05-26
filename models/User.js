const mongoose = require('mongoose'); // MongoDB ODM library
const bcrypt = require('bcryptjs'); // Password hashing library

// User schema - blueprint for user documents
const userSchema = new mongoose.Schema({
  username: {
    // Username field
    type: String, // Data type
    required: true, // Cannot be empty
    unique: true, // No duplicate usernames
    trim: true, // Remove whitespace
    minlength: 3, // Minimum 3 characters
    maxlength: 30, // Maximum 30 characters
  },
  email: {
    // Email field
    type: String, // Data type
    required: true, // Cannot be empty
    unique: true, // No duplicate emails
    lowercase: true, // Convert to lowercase
    trim: true, // Remove whitespace
  },
  password: {
    // Password field
    type: String, // Data type
    required: true, // Cannot be empty
    minlength: 6, // Minimum 6 characters
  },
  scenesSaved: {
    // Scene count field
    type: Number, // Data type
    default: 0, // Start at 0
  },
  unlockedAnimations: [
    // Array of unlocked animations
    {
      noetechKey: { type: String, required: true }, // Which character
      animationId: { type: String, required: true }, // Which animation
      unlockedAt: { type: Date, default: Date.now }, // When unlocked
    },
  ],
  unlockedNoetechs: {
    // Array of unlocked characters
    type: [String], // Array of strings
    default: [], // Start with empty array
  },
  createdAt: {
    // Account creation timestamp
    type: Date, // Data type
    default: Date.now, // Set to current time when created
  },
});

// Pre-save hook - runs before saving to database
userSchema.pre('save', async function (next) {
  // Middleware that runs before save()
  if (!this.isModified('password')) {
    // If password hasn't changed
    return next(); // Skip hashing, continue to save
  }

  const salt = await bcrypt.genSalt(10); // Generate salt for hashing (10 rounds)
  this.password = await bcrypt.hash(this.password, salt); // Hash password with salt
  next(); // Continue to save
});

// Instance method - compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Method available on user instances
  return await bcrypt.compare(candidatePassword, this.password); // Returns true if password matches
};

module.exports = mongoose.model('User', userSchema); // Export User model for use in routes
