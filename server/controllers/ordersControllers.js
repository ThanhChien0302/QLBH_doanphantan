const OrderCode = require("../models/OrderCode");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD_USER
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
            from: process.env.ADMIN_EMAIL,
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
            status: "chờ xác nhận"
        });
        await order.save();
        await OrderCode.findByIdAndDelete(orderCode._id);

        res.json({ message: "Đơn hàng đã được xác nhận" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi xác nhận mã" });
    }
};

// Lấy tất cả đơn hàng theo email
exports.getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ "customer.email": email })
            .populate("items.productId") // lấy thêm thông tin sản phẩm
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi lấy đơn hàng" });
    }
};
// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: "Đã hủy" }, // ✅ đổi trạng thái theo model
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({ message: "Đơn hàng đã được hủy", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi hủy đơn hàng" });
    }
};
// Lấy tất cả đơn hàng (chỉ admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi lấy tất cả đơn hàng" });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "chờ xác nhận", "đã hoàn thành", "Đã hủy"

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("items.productId");

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({ message: "Cập nhật trạng thái thành công", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
    }
};
