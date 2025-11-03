// resetDevUser.js - Quick script to reset dev user to empty state
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const Scene = require("./models/Scene"); // Add Scene import

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

    // Delete all scenes belonging to this user
    const deletedScenes = await Scene.deleteMany({ userId: user._id });
    console.log(`🗑️  Deleted ${deletedScenes.deletedCount} existing scenes`);

    // Reset to clean state for animation unlock testing
    user.scenesSaved = 0;
    user.unlockedAnimations = [];
    user.unlockedNoetechs = []; // Keep for backward compatibility
    await user.save();

    console.log("🔄 Dev user reset successfully:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Scenes Saved: ${user.scenesSaved}`);
    console.log(
      `   Unlocked Animations: ${
        user.unlockedAnimations.length === 0
          ? "None"
          : user.unlockedAnimations
              .map((a) => `${a.noetechKey}:${a.animationId}`)
              .join(", ")
      }`
    );
    console.log(`\n🎯 Noetech & Animation Unlock Testing Flow:`);
    console.log(`   Scene 1 → Unlock Icarus-X (Noetech)`);
    console.log(`   Scene 2 → Unlock Vectra (Noetech)`);
    console.log(`   Scene 3 → Unlock Nexus (Noetech)`);
    console.log(
      `   Scene 4 → Unlock "Phoenix Dive" for Icarus-X (animation switcher appears!)`
    );
    console.log(`\n📋 Ready for testing:`);
    console.log(`   1. Login to frontend with ${user.email} / dev123`);
    console.log(`   2. Save scenes to test animation unlock progression`);
    console.log(
      `   3. Check Showcase for unlocked characters + animation switcher`
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetDevUser();
