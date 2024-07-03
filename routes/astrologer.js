const express = require("express");
const router = express.Router();
const astrologerController = require("../controller/astrologer_controller");

router.post("/create", astrologerController.create);
router.get("/view-astro", astrologerController.viewData)

module.exports = router;