const Product = require("../models/productModel");

// Lấy tất cả sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm sản phẩm (Admin) – có ảnh
exports.createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const image = req.file ? req.file.path : undefined; // Lấy đường dẫn ảnh nếu có

        const product = new Product({ name, price, quantity, image });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Sửa sản phẩm (Admin) – có thể cập nhật ảnh
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const updateData = { name, price, quantity };

        // Nếu có file ảnh upload mới, cập nhật trường image
        if (req.file) {
            updateData.image = req.file.path; // hoặc req.file.filename nếu bạn dùng multer destination + filename
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa sản phẩm (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// Giảm số lượng sản phẩm 1 khi thêm vào giỏ
exports.decreaseQuantity = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        if (product.quantity <= 0)
            return res.status(400).json({ message: "Sản phẩm đã hết hàng" });

        product.quantity -= 1;
        await product.save();

        res.json({ message: "Đã giảm 1 sản phẩm", quantity: product.quantity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tăng số lượng 1 (khi xóa khỏi giỏ)
exports.increaseQuantity = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        const { qty } = req.body; // số lượng muốn tăng
        product.quantity += qty;  // tăng theo số lượng thực tế
        await product.save();

        res.json({ message: `Đã tăng ${qty} sản phẩm`, quantity: product.quantity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};