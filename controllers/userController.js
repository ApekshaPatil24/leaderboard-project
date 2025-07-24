// controllers/userController.js

const User = require("../models/User");

// @desc Get all users
// @route GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc Add a new user
// @route POST /api/users
exports.addUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newUser = new User({ name });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ message: "Failed to add user" });
  }
};
