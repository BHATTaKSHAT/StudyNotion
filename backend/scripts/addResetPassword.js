import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const addResetPasswordFields = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    const result = await User.updateMany(
      { resetPasswordCode: { $exists: false } },
      { $set: { resetPasswordCode: null, resetPasswordExpire: null } }
    );

    console.log(`Updated ${result.modifiedCount} users.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating users:", error);
    mongoose.connection.close();
  }
};

addResetPasswordFields();
