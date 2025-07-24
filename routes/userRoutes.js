const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users — Add new user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user' });
  }
});

// GET /api/users — Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
