import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures"); // Save files in this directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Route to upload/update profile picture
router.post(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profilePicture) {
        const previousPath = path.join(process.cwd(), user.profilePicture);
        if (fs.existsSync(previousPath)) {
          fs.unlinkSync(previousPath);
        }
      }

      user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Profile picture updated successfully",
        profilePicture: `http://localhost:5000/uploads/profile-pictures/${req.file.filename}`,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error updating profile picture",
        error: err.message,
      });
    }
  }
);

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ profilePicture: user.profilePicture });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
});

router.post("/delete", protect, async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting account", error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate a reset code
    const resetCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character code
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes
    await user.save();

    // Send the reset code via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: `"StudyNotion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}. This code is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending reset code", error: err.message });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetPasswordCode !== resetCode ||
      user.resetPasswordExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    res.json({ message: "Reset code verified" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying reset code", error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetPasswordCode !== resetCode ||
      user.resetPasswordExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Update the password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
});

export default router;
