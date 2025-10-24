// Imports MongoDB connection library
const mongoose = require("mongoose");

// Creates a function that connects to database

const connectDB = async () => {
  try {
    // Tries to connect using the URI from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If successful, prints success message
    console.log(`MongoDb Connected: ${conn.connection.host}`);

    // If it fails, prints error
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exits the program (can't run without database)
    process.exit(1);
  }
};

// Exports this function so server.js can use it
module.exports = connectDB;
