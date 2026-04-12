const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "devvault-secret";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use." });
  }

  const passwordHash = await bcrypt.hash(password.trim(), 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: passwordHash,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
