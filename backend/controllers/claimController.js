// controllers/claimController.js

const User = require("../models/User");
const ClaimHistory = require("../models/ClaimHistory");

// @desc Claim random points for a user
// @route POST /api/claim/:userId
exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user from DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate random points (1–10)
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    // Update user’s total points
    user.totalPoints += randomPoints;
    await user.save();

    // Create claim history record
    const history = new ClaimHistory({
      userId,
      points: randomPoints,
      createdAt: new Date()
    });
    await history.save();

    res.json({
      message: "Points claimed successfully",
      points: randomPoints,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to claim points" });
  }
};

// @desc Get real-time leaderboard sorted by totalPoints
// @route GET /api/claim/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });

    const rankedUsers = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      totalPoints: user.totalPoints || 0,
      rank: index + 1
    }));

    res.json(rankedUsers);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

// @desc Get full claim point history
// @route GET /api/claim/history
exports.getHistory = async (req, res) => {
  try {
    const history = await ClaimHistory
      .find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
