// clearDatabase.js - Script to delete all test data
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Scene = require("./models/Scene");

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`🗑️  Deleted ${userResult.deletedCount} users`);

    // Delete all scenes
    const sceneResult = await Scene.deleteMany({});
    console.log(`🗑️  Deleted ${sceneResult.deletedCount} scenes`);

    console.log("\n✨ Database cleared successfully!");
    
    // Close connection
    await mongoose.connection.close();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
