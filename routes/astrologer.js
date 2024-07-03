const express = require("express");
const router = express.Router();
const astrologerController = require("../controller/astrologer_controller");

router.post("/create", astrologerController.create)

module.exports = router;