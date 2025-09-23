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
            quantity: Number
        }
    ],
    paymentMethod: { type: String, default: "COD" },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
