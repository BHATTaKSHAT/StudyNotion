import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const initializeProgress = async () => {
  try {
    // Connect to the database
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    // Update all users to ensure they have a progress field
    const result = await User.updateMany(
      { progress: { $exists: false } }, // Only update users without a progress field
      { $set: { progress: [] } } // Initialize progress as an empty array
    );

    console.log(`Progress initialized for ${result.modifiedCount} users.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error initializing progress:", error);
    mongoose.connection.close();
  }
};

initializeProgress();
