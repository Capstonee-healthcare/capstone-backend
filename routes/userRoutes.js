const express = require("express");
const router = express.Router();
const { completeSession } = require("../controllers/userController");

router.post("/complete/:uid", completeSession);

module.exports = router;
