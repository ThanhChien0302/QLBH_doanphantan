const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        fullName: String,
        phone: String,
        address: String,
        email: String
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number
        }
    ],
    paymentMethod: { type: String, default: "COD" },
    status: { type: String, enum: ["chờ xác nhận", "đã hoàn thành", "Đã hủy"], default: "chờ xác nhận" },
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
