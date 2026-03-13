// Script to create demo user for WandurLust
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const User = require("../models/user.js");

const MONGO_URL = "mongodb+srv://rumjotsingh12345:BfzO29fk3ZrrpXEp@wandurlust.srosi.mongodb.net/";

async function createDemoUser() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Check if demo user already exists
    const existingUser = await User.findOne({ username: "demo" });
    
    if (existingUser) {
      console.log("ℹ️  Demo user already exists");
      console.log("   Username: demo");
      console.log("   Password: demo123");
      await mongoose.connection.close();
      return;
    }

    // Create demo user
    const demoUser = new User({
      email: "demo@wandurlust.com",
      username: "demo"
    });

    await User.register(demoUser, "demo123");
    
    console.log("🎉 Demo user created successfully!");
    console.log("   Username: demo");
    console.log("   Password: demo123");
    console.log("   Email: demo@wandurlust.com");
    
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    
  } catch (error) {
    console.error("❌ Error creating demo user:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createDemoUser();
