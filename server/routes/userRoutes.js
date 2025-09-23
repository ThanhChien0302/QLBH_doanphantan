const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, adminOnly } = require("../middleware/authMiddleware");

router.get("/", auth, adminOnly, userController.getUsers);
router.delete("/:id", auth, adminOnly, userController.deleteUser);

module.exports = router;
