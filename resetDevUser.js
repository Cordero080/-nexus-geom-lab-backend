// resetDevUser.js - Quick script to reset dev user to empty state
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const resetDevUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const email = process.env.DEV_USER_EMAIL || "dev@test.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ Dev user not found. Run 'node seedDevUser.js' first.");
      process.exit(1);
    }

    // Reset to clean state
    user.scenesSaved = 0;
    user.unlockedNoetechs = [];
    await user.save();

    console.log("🔄 Dev user reset successfully:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Scenes Saved: ${user.scenesSaved}`);
    console.log(
      `   Unlocked Noetechs: ${
        user.unlockedNoetechs.length === 0
          ? "None"
          : user.unlockedNoetechs.join(", ")
      }`
    );
    console.log(`\n📋 Ready for unlock testing:`);
    console.log(`   1. Login to frontend with dev@test.com / dev123`);
    console.log(`   2. Save scenes to test progressive unlocks`);
    console.log(`   3. Check Showcase to see unlocked Noetechs`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetDevUser();
