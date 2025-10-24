const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
  email: {
    // FIELD 2
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    // FIELD 3
    type: String,
    required: true,
    minlength: 6,
  },
  unlockedAnimations: {
    //FIELD 4
    type: [String],
    default: ["rotate"], // Everyone starts with "rotate" animation unlocked
  },
  createdAt: {
    //FIELD 5
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
userSchema.methods.hasUnlockedAnimation = function (animationName) {
  return this.unlockedAnimations.includes(animationName);
};
// Method to unlock animation
userSchema.methods.unlockAnimation = function (animationName) {
  if (!this.hasUnlockedAnimation(animationName)) {
    this.unlockedAnimations.push(animationName);
  }
};
module.exports = mongoose.model("User", userSchema);
