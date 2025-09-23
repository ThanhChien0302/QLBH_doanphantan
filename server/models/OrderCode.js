const mongoose = require("mongoose");

const orderCodeSchema = new mongoose.Schema({
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
    code: String,
    createdAt: { type: Date, default: Date.now, expires: 600 } // tự hết hạn sau 10 phút
});

module.exports = mongoose.model("OrderCode", orderCodeSchema);
