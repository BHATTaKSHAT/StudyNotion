import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

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

export default router;
