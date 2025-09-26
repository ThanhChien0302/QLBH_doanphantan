const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersControllers");

router.post("/send-code", ordersController.sendCode);
router.post("/verify", ordersController.verifyCode);

//  Route admin phải đặt trước để tránh conflict
router.get("/orders-all", ordersController.getAllOrders);

router.get("/:email", ordersController.getOrdersByEmail);
router.put("/:id/status", ordersController.updateOrderStatus);
router.put("/:id/cancel", ordersController.cancelOrder);


router.put("/rate", ordersController.rateProduct);
module.exports = router;
