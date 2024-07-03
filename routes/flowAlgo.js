const express = require("express");
const router = express.Router();
const flowController = require("../controller/flowDistributionalgo_controller");

router.post("/allocate", flowController.allocateUser);
router.post("/adjust", flowController.adjustFlow)

module.exports = router;