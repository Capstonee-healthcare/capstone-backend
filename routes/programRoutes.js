const express = require("express");
const router = express.Router();
const { getProgramById } = require("../controllers/programcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected route - requires JWT token
router.get("/programs/:id", verifyToken, getProgramById);

module.exports = router;
