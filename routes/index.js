const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/astrologer", require("./astrologer"));
router.use("/flow", require("./flowAlgo"))

module.exports = router;