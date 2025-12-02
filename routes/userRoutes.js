const express = require("express");
const router = express.Router();
const { completeSession } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected route - requires JWT token
router.post("/complete/:uid", verifyToken, completeSession);

module.exports = router;
