import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Backend validations
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const usernameRegex = /^[A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username can only contain letters and special characters, no spaces or numbers.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long and contain both letters and numbers.",
    });
  }

  const userExists = await User.findOne({
    username: { $regex: `^${username}$`, $options: "i" },
  });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "Username is already taken. Please choose another." });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Backend validations
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "No email found" });
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
};

export { registerUser, loginUser };
