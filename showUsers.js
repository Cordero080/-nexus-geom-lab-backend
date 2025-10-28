// showUsers.js - Show all users in database
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const showUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const users = await User.find({}).select("-password");
    
    if (users.length === 0) {
      console.log("📭 No users found in database.");
      console.log("Create a new account at http://localhost:5173/signup");
    } else {
      console.log(`👥 Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Unlocked: ${user.unlockedNoetechs.join(", ")}`);
        console.log(`   Created: ${user.createdAt}\n`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

showUsers();
