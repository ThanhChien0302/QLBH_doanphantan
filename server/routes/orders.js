const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersControllers");

router.post("/send-code", ordersController.sendCode);
router.post("/verify", ordersController.verifyCode);
router.get("/:email", ordersController.getOrdersByEmail);

module.exports = router;
