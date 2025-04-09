import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const addProfilePictureField = async () => {
  try {
    // Connect to the database
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    // Update all users to add the profilePicture field if it doesn't exist
    const result = await User.updateMany(
      { profilePicture: { $exists: false } }, // Only update users without the field
      { $set: { profilePicture: null } } // Set the default value to null
    );

    console.log(
      `Updated ${result.modifiedCount} users to include profilePicture field.`
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating users:", error);
    mongoose.connection.close();
  }
};

addProfilePictureField();
