// seedDevUser.js - Creates or finds dev test user
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const seedDevUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get credentials from .env or use defaults
    const email = process.env.DEV_USER_EMAIL || "dev@test.com";
    const password = process.env.DEV_USER_PASSWORD || "dev123";
    const username = process.env.DEV_USER_USERNAME || "devuser";

    // Check if dev user already exists
    let user = await User.findOne({ email });

    if (user) {
      console.log("👤 Dev user already exists:");
      // Reset user to follow new animation unlock progression system
      user.scenesSaved = 0;
      user.unlockedAnimations = [];
      user.unlockedNoetechs = []; // Keep for backward compatibility
      user.password = password; // Update password (will be hashed by pre-save hook)
      await user.save();
      console.log("🔄 Reset user stats and updated password");
    } else {
      // Create new dev user
      user = new User({
        username,
        email,
        password, // Will be hashed by User model pre-save hook
        scenesSaved: 0,
        unlockedAnimations: [], // NEW: No animations unlocked initially
        unlockedNoetechs: [], // Keep for backward compatibility
      });
      await user.save();
      console.log("✨ Dev user created successfully:");
    }

    // Generate JWT token for easy testing
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Scenes Saved: ${user.scenesSaved}`);
    console.log(
      `   Unlocked Animations: ${
        user.unlockedAnimations.length > 0
          ? user.unlockedAnimations
              .map((a) => `${a.noetechKey}:${a.animationId}`)
              .join(", ")
          : "None (save scenes to unlock!)"
      }`
    );
    console.log(`\n🎯 Animation Unlock Progression System:`);
    console.log(`   📝 Save 1st scene → Unlock "Solar Ascension" for Icarus-X`);
    console.log(`   📝 Save 2nd scene → Unlock "Phoenix Dive" for Icarus-X`);
    console.log(
      `   📝 Save 3rd scene → Unlock "Holographic Spellcast" for Vectra`
    );
    console.log(`   📝 Save 5th scene → Unlock "Warrior Flip" for Nexus`);
    console.log(`\n🔑 JWT Token (copy this for API testing):`);
    console.log(`   ${token}`);
    console.log(`\n📋 Quick Login:`);
    console.log(`   1. Go to http://localhost:5173/login`);
    console.log(`   2. Email: ${email}`);
    console.log(`   3. Password: ${password}`);
    console.log(`   4. Save scenes to unlock Noetechs progressively!`);
    console.log(`\n🧪 Dev API Commands:`);
    console.log(`   # Check stats`);
    console.log(`   curl -X GET http://localhost:5000/api/dev/my-stats \\`);
    console.log(`     -H "Authorization: Bearer ${token}"`);
    console.log(`\n   # Reset data`);
    console.log(
      `   curl -X POST http://localhost:5000/api/dev/reset-my-data \\`
    );
    console.log(`     -H "Authorization: Bearer ${token}"`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDevUser();
