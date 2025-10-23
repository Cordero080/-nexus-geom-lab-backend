const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
//BLUEPRINT FOR DOCUMENT
const userSchema = new mongoose.Schema({
  // FIELD (or Property)
  username: {
    //FIELD DEFINITIONS(or SCHEMA OPTIONS)
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {  // FIELD 2
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {  // FIELD 3
    type: String,
    required: true,
    minlength: 6,
  },
  unlockedAnimations: {  //FIELD 4
    type: [Number],
    default: [1], // Everyone starts with animation #1 unlocked...was hesitant to do this, but whatever,
    //let them eat cake!
  },
  createdAt: {   //FIELD 5
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Method to check if animation is unlocked
userSchema.methods.hasUnlockedAnimation = function (animationId) {
  return this.unlockedAnimations.includes(animationId);
};
// Method to unlock animation
userSchema.methods.unlockAnimation = function (animationId) {
  if (!this.hasUnlockedAnimation(animationId)) {
    this.unlockedAnimations.push(animationId); // FIXED: was "unlockAnimations" (typo)
  }
};
module.exports = mongoose.model("User", userSchema);