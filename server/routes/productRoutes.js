const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { auth, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

// Lấy tất cả sản phẩm – cả user và admin đều được xem
router.get("/", auth, productController.getProducts);

// Thêm sản phẩm – chỉ admin mới được phép, có upload ảnh
router.post("/", auth, adminOnly, upload.single("image"), productController.createProduct);

// Sửa sản phẩm – chỉ admin, có thể cập nhật ảnh
router.put("/:id", auth, adminOnly, upload.single("image"), productController.updateProduct);

// Xóa sản phẩm – chỉ admin
router.delete("/:id", auth, adminOnly, productController.deleteProduct);

// Giảm số lượng – cả user và admin đều được phép
router.patch("/:id/decrease", auth, productController.decreaseQuantity);
router.patch("/:id/increase", auth, productController.increaseQuantity);
module.exports = router;
