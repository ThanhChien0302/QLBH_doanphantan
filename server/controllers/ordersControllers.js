const OrderCode = require("../models/OrderCode");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Gửi mã xác nhận
exports.sendCode = async (req, res) => {
    try {
        const { customer, items } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const orderCode = new OrderCode({ customer, items, code });
        await orderCode.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: "Mã xác nhận đơn hàng",
            html: `<p>Mã xác nhận của bạn là: <strong>${code}</strong></p>`
        });

        res.status(200).json({ message: "Mã xác nhận đã gửi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi gửi mã" });
    }
};

// Xác nhận mã và tạo đơn hàng chính thức
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const orderCode = await OrderCode.findOne({ "customer.email": email, code });
        if (!orderCode) return res.status(400).json({ message: "Mã xác nhận không hợp lệ" });

        const order = new Order({
            customer: orderCode.customer,
            items: orderCode.items,
            paymentMethod: "COD",
            status: "confirmed"
        });
        await order.save();
        await OrderCode.findByIdAndDelete(orderCode._id);

        res.json({ message: "Đơn hàng đã được xác nhận" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi xác nhận mã" });
    }
};
