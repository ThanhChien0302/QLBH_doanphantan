const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersControllers");

router.post("/send-code", ordersController.sendCode);
router.post("/verify", ordersController.verifyCode);
router.get("/:email", ordersController.getOrdersByEmail);
router.put("/:id/cancel", ordersController.cancelOrder);


module.exports = router;
