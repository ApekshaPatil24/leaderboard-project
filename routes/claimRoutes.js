// routes/claimRoutes.js

const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");

router.post("/:userId", claimController.claimPoints);
router.get("/leaderboard", claimController.getLeaderboard);
router.get("/history", claimController.getHistory);

module.exports = router;
