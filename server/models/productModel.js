const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String } // URL hoặc đường dẫn ảnh
});

module.exports = mongoose.model("Product", productSchema);
