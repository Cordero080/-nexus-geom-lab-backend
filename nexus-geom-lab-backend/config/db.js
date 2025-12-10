// Imports MongoDB connection library
const mongoose = require("mongoose"); // Mongoose = MongoDB ODM (Object Data Modeling) library

// Creates a function that connects to database
const connectDB = async () => {
  // Async function - returns Promise
  try {
    // Tries to connect using the URI from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI); // Wait for connection to complete

    // If successful, prints success message only in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`MongoDb Connected: ${conn.connection.host}`); // Shows database hostname
    }

    // If it fails, prints error
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`); // Log error message

    // Exits the program (can't run without database)
    process.exit(1); // Exit code 1 = error (0 would mean success)
  }
};

// Exports this function so index.js can use it
module.exports = connectDB; // Makes function available to other files
