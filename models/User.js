const mongoose = require("mongoose"); // MongoDB ODM library
const bcrypt = require("bcryptjs"); // Password hashing library

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
userSchema.pre("save", async function (next) {
  // Middleware that runs before save()
  if (!this.isModified("password")) {
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

// Instance method - check if specific animation is unlocked
userSchema.methods.hasUnlockedAnimation = function (noetechKey, animationId) {
  // Check if user has specific animation
  return this.unlockedAnimations.some(
    // Check if any item in array matches
    (ua) => ua.noetechKey === noetechKey && ua.animationId === animationId
  );
};

// Instance method - get all unlocked animations for a character
userSchema.methods.getUnlockedAnimationsForNoetech = function (noetechKey) {
  // Get animations for specific character
  return this.unlockedAnimations.filter((ua) => ua.noetechKey === noetechKey); // Filter by character key
};

// Instance method - check if any animation is unlocked for a character
userSchema.methods.hasUnlockedNoetech = function (noetechKey) {
  // Check if character has any unlocked animations
  return this.unlockedAnimations.some((ua) => ua.noetechKey === noetechKey); // Returns true if any animation exists
};

// Instance method - increment scenes saved and check for unlocks
userSchema.methods.incrementScenesSaved = function () {
  // Called when user saves a scene
  this.scenesSaved += 1; // Increment counter
  const newlyUnlocked = []; // Track what unlocks during this save

  // Scene 1 → Unlock icarus-x (first character)
  if (this.scenesSaved === 1 && !this.unlockedNoetechs.includes("icarus-x")) {
    // First save
    this.unlockedNoetechs.push("icarus-x"); // Add Icarus-X to unlocked characters
    newlyUnlocked.push("icarus-x"); // Track for response
  }

  // Scene 2 → Unlock vectra (second character)
  if (this.scenesSaved === 2 && !this.unlockedNoetechs.includes("vectra")) {
    // Second save
    this.unlockedNoetechs.push("vectra"); // Add Vectra to unlocked characters
    newlyUnlocked.push("vectra"); // Track for response
  }

  // Scene 3 → Unlock nexus (third character)
  if (this.scenesSaved === 3 && !this.unlockedNoetechs.includes("nexus")) {
    // Third save
    this.unlockedNoetechs.push("nexus"); // Add Nexus to unlocked characters
    newlyUnlocked.push("nexus"); // Track for response
  }

  // Scene 4 → Unlock icarus-x second animation (Phoenix Dive)
  if (
    this.scenesSaved === 4 && // Fourth save
    !this.hasUnlockedAnimation("icarus-x", "phoenix-dive") // Don't already have Phoenix Dive
  ) {
    this.unlockedAnimations.push({
      // Add animation unlock entry
      noetechKey: "icarus-x", // For Icarus-X character
      animationId: "phoenix-dive", // Phoenix Dive animation
      unlockedAt: new Date(), // Current timestamp
    });
    newlyUnlocked.push({ noetechKey: "icarus-x", animationId: "phoenix-dive" }); // Track for response
  }

  return newlyUnlocked; // Return array of what was unlocked
};

module.exports = mongoose.model("User", userSchema); // Export User model for use in routes
