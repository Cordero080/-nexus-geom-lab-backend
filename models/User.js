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
// Method to check if Noetech is unlocked
userSchema.methods.hasUnlockedNoetech = function (noetechName) {
  return this.unlockedNoetechs.includes(noetechName);
};
// Method to unlock Noetech
userSchema.methods.unlockNoetech = function (noetechName) {
  if (!this.hasUnlockedNoetech(noetechName)) {
    this.unlockedNoetechs.push(noetechName);
  }
};

// Progressive unlock system based on scenes saved
userSchema.methods.checkAndUnlockNoetechs = function () {
  const noetechOrder = ['icarus-x', 'vectra', 'nexus'];
  const newUnlocks = [];
  
  // Unlock based on scenes saved count
  for (let i = 0; i < Math.min(this.scenesSaved, noetechOrder.length); i++) {
    const noetech = noetechOrder[i];
    if (!this.hasUnlockedNoetech(noetech)) {
      this.unlockedNoetechs.push(noetech);
      newUnlocks.push(noetech);
    }
  }
  
  return newUnlocks; // Return newly unlocked Noetechs
};

// Method to increment scenes saved and check for unlocks
userSchema.methods.incrementScenesSaved = function () {
  this.scenesSaved += 1;
  return this.checkAndUnlockNoetechs();
};

module.exports = mongoose.model("User", userSchema);
