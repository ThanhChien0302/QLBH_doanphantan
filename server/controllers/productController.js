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
