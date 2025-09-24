"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const email = localStorage.getItem("email"); // ✅ lấy email từ localStorage
        if (!email) return;

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${email}`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    // ✅ Hàm hủy đơn hàng
    const handleCancel = async (id) => {
        if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

        try {
            await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
                method: "PUT",
            });
            alert("Đơn hàng đã được hủy");
            fetchOrders(); // reload lại danh sách sau khi hủy
        } catch (err) {
            console.error(err);
            alert("Không thể hủy đơn hàng");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "chờ xác nhận":
                return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded";
            case "đã hoàn thành":
                return "text-green-600 bg-green-100 px-2 py-1 rounded";
            case "Đã hủy":
                return "text-red-600 bg-red-100 px-2 py-1 rounded";
            default:
                return "text-gray-600 bg-gray-100 px-2 py-1 rounded";
        }
    };

    // ✅ Hàm tính tổng tiền fallback nếu order.totalAmount chưa có
    const calcTotal = (items) => {
        return items.reduce(
            (sum, item) =>
                sum +
                ((item.price || item.productId?.price || 0) * item.quantity),
            0
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
                    📑 Đơn hàng của tôi
                </h1>

                {orders.length === 0 && (
                    <p className="text-center text-gray-500 text-lg">
                        Bạn chưa có đơn hàng nào.
                    </p>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    🆔 Mã đơn: {order._id}
                                </h2>
                                <span className={getStatusClass(order.status)}>
                                    {order.status}
                                </span>
                            </div>

                            <p className="text-lg text-yellow-600">
                                📅 Ngày đặt:{" "}
                                <span className="font-bold text-green-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </p>

                            <p className="text-lg text-black-500">
                                💳 Thanh toán:{" "}
                                <span className="font-medium text-black-700">
                                    {order.paymentMethod}
                                </span>
                            </p>

                            <div className="mt-4">
                                <h3 className="font-semibold text-black-700 mb-2">
                                    📦 Sản phẩm:
                                </h3>
                                <ul className="space-y-3">
                                    {order.items.map((item) => (
                                        <li
                                            key={item._id}
                                            className="border-b pb-2"
                                        >
                                            <h3 className="font-semibold text-xl">
                                                {item.productId?.name || "Sản phẩm"}
                                            </h3>
                                            <p className="text-lg text-black-600">
                                                Số lượng: {item.quantity}
                                            </p>
                                            <p className="text-lg text-black-600">
                                                Giá:{" "}
                                                {(item.price ||
                                                    item.productId?.price ||
                                                    0).toLocaleString("vi-VN")}{" "}
                                                VND
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                {/* ✅ Tổng tiền */}
                                <p className="text-lg text-blue-600 font-bold mt-3 text-right">
                                    💰 Tổng tiền:{" "}
                                    {(order.totalAmount || calcTotal(order.items)).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    VND
                                </p>
                            </div>

                            {/* ✅ Nút hủy đơn chỉ hiện nếu đơn đang chờ xác nhận */}
                            {order.status === "chờ xác nhận" && (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => handleCancel(order._id)}
                                        className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        ❌ Hủy đơn hàng
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
