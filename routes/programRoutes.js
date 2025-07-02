const express = require("express");
const router = express.Router();
const { getProgramById } = require("../controllers/programcontroller");

router.get("/programs/:id", getProgramById);

module.exports = router;
