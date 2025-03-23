import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const updateUserProgress = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    const result = await User.updateMany(
      { "progress.lastWatched": { $exists: false } },
      {
        $set: {
          "progress.$[].lastWatched": null,
          "progress.$[].lastWatchedIndex": [],
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} users' progress.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating progress:", error);
    mongoose.connection.close();
  }
};

updateUserProgress();
