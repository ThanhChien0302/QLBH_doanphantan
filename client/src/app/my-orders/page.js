"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [ratings, setRatings] = useState({}); // lưu rating từng sản phẩm

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const email = localStorage.getItem("email");
        if (!email) return;

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${email}`);
            const data = await res.json();
            setOrders(data);

            // Khởi tạo rating (kể cả = 0)
            const initRatings = {};
            data.forEach(order => {
                order.items.forEach(item => {
                    initRatings[order._id + "_" + item.productId._id] = item.rating || 0;
                });
            });
            setRatings(initRatings);
        } catch (err) {
            console.error(err);
        }
    };

    // ❌ Hủy đơn
    const handleCancel = async (id) => {
        if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

        try {
            await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
                method: "PUT",
            });
            alert("Đơn hàng đã được hủy");
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Không thể hủy đơn hàng");
        }
    };

    // ⭐ Đánh giá sản phẩm
    const handleRating = async (orderId, productId, stars) => {
        setRatings(prev => ({ ...prev, [orderId + "_" + productId]: stars }));

        try {
            await fetch("http://localhost:5000/api/orders/rate", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, productId, rating: stars }),
            });
        } catch (err) {
            console.error("Lỗi đánh giá:", err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "chờ xác nhận":
                return "inline-block min-w-[140px] text-center text-yellow-600 bg-yellow-100 px-3 py-1 rounded";
            case "đã hoàn thành":
                return "inline-block min-w-[140px] text-center text-green-600 bg-green-100 px-3 py-1 rounded";
            case "Đã hủy":
                return "inline-block min-w-[140px] text-center text-red-600 bg-red-100 px-3 py-1 rounded";
            default:
                return "inline-block min-w-[140px] text-center text-gray-600 bg-gray-100 px-3 py-1 rounded";
        }
    };

    const calcTotal = (items) => {
        return items.reduce(
            (sum, item) => sum + ((item.price || item.productId?.price || 0) * item.quantity),
            0
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
                    📑 Đơn hàng của tôi
                </h1>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Bạn chưa có đơn hàng nào.
                    </p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="border p-3 text-left">🆔 Mã đơn</th>
                                    <th className="border p-3 text-left w-40">📅 Ngày đặt</th>
                                    <th className="border p-2 text-left w-28">💳 Thanh toán</th>
                                    <th className="border p-3 text-left w-40">📦 Sản phẩm</th>
                                    <th className="border p-3 text-center w-40">💰 Tổng tiền</th>
                                    <th className="border p-3 text-center w-40">📌 Trạng thái</th>
                                    <th className="border p-3 text-center">⭐ Đánh giá</th>
                                    <th className="border p-3 text-center">⚙️ Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const total = order.totalAmount || calcTotal(order.items);
                                    return (
                                        <tr key={order._id} className="hover:bg-blue-100">
                                            <td className="border p-3 font-bold">{order._id}</td>
                                            <td className="border p-3 font-bold">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="border p-7 font-bold">{order.paymentMethod}</td>
                                            <td className="border p-2 font-bold">
                                                {order.items.map(item => (
                                                    <div key={item.productId._id} className="mb-2">
                                                        {item.productId?.name || "Sản phẩm"} (x{item.quantity})
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="border p-3 text-right font-bold text-blue-600">
                                                {total.toLocaleString("vi-VN")} VND
                                            </td>
                                            <td className="border p-3 text-center">
                                                <span className={getStatusClass(order.status)}>
                                                    {order.status}
                                                </span>
                                            </td>

                                            {/* ⭐ Đánh giá */}
                                            <td className="border p-2 text-center">
                                                {order.status === "đã hoàn thành" ? (
                                                    order.items.map(item => (
                                                        <div key={item.productId._id}>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() =>
                                                                        handleRating(order._id, item.productId._id, star)
                                                                    }
                                                                    className={`text-2xl font-bold focus:outline-none ${ratings[order._id + "_" + item.productId._id] >= star
                                                                            ? "text-yellow-500"
                                                                            : "text-gray-400"
                                                                        }`}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">Chưa thể đánh giá</span>
                                                )}
                                            </td>

                                            {/* ⚙️ Hành động */}
                                            <td className="border p-3 text-center">
                                                {order.status === "chờ xác nhận" && (
                                                    <button
                                                        onClick={() => handleCancel(order._id)}
                                                        className="bg-red-600 text-white font-bold px-2 py-1 rounded hover:bg-red-700"
                                                    >
                                                        ❌ Hủy
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
