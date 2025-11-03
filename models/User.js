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
  scenesSaved: {
    //FIELD 4
    type: Number,
    default: 0,
  },
  unlockedAnimations: [
    {
      noetechKey: { type: String, required: true },
      animationId: { type: String, required: true },
      unlockedAt: { type: Date, default: Date.now },
    },
  ],
  unlockedNoetechs: {
    //FIELD 5
    type: [String],
    default: [], // No Noetechs unlocked initially
  },
  createdAt: {
    //FIELD 6
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
// NEW ANIMATION-BASED UNLOCK METHODS

// Method to check if specific animation is unlocked
userSchema.methods.hasUnlockedAnimation = function (noetechKey, animationId) {
  return this.unlockedAnimations.some(
    (ua) => ua.noetechKey === noetechKey && ua.animationId === animationId
  );
};

// Method to get all unlocked animations for a Noetech
userSchema.methods.getUnlockedAnimationsForNoetech = function (noetechKey) {
  return this.unlockedAnimations.filter((ua) => ua.noetechKey === noetechKey);
};

// Method to check if any animation is unlocked for a Noetech (backwards compatibility)
userSchema.methods.hasUnlockedNoetech = function (noetechKey) {
  return this.unlockedAnimations.some((ua) => ua.noetechKey === noetechKey);
};

// PROGRESSIVE UNLOCK SYSTEM
// Method to increment scenes saved and check for Noetech unlocks
userSchema.methods.incrementScenesSaved = function () {
  this.scenesSaved += 1;
  const newlyUnlocked = [];

  // Scene 1 → Unlock icarus-x (first Noetech)
  if (this.scenesSaved === 1 && !this.unlockedNoetechs.includes("icarus-x")) {
    this.unlockedNoetechs.push("icarus-x");
    newlyUnlocked.push("icarus-x");
  }

  // Scene 2 → Unlock vectra (second Noetech)
  if (this.scenesSaved === 2 && !this.unlockedNoetechs.includes("vectra")) {
    this.unlockedNoetechs.push("vectra");
    newlyUnlocked.push("vectra");
  }

  // Scene 3 → Unlock nexus (third Noetech)
  if (this.scenesSaved === 3 && !this.unlockedNoetechs.includes("nexus")) {
    this.unlockedNoetechs.push("nexus");
    newlyUnlocked.push("nexus");
  }

  // Scene 4 → Unlock icarus-x second animation (Phoenix Dive)
  if (
    this.scenesSaved === 4 &&
    !this.hasUnlockedAnimation("icarus-x", "phoenix-dive")
  ) {
    this.unlockedAnimations.push({
      noetechKey: "icarus-x",
      animationId: "phoenix-dive",
      unlockedAt: new Date(),
    });
    newlyUnlocked.push({ noetechKey: "icarus-x", animationId: "phoenix-dive" });
  }

  return newlyUnlocked;
};

module.exports = mongoose.model("User", userSchema);
