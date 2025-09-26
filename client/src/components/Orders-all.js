"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersAll() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/orders/orders-all");
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err);
        }
    };

    if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                📑 Quản lý đơn hàng
            </h1>

            {orders.length === 0 ? (
                <p>Chưa có đơn hàng nào.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300 shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-left">Khách hàng</th>
                            <th className="border p-2 text-left">Email</th>
                            <th className="border p-2 text-left">Địa chỉ</th>
                            <th className="border p-2 text-left">Tổng tiền</th>
                            <th className="border p-2 text-left">Trạng thái</th>
                            <th className="border p-2 text-left">Sản phẩm</th>
                            <th className="border p-2 text-center w-24">⭐ Đánh giá</th>
                            <th className="border p-2 text-center w-36">⚙️ Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const totalAmount = order.items.reduce((sum, item) => {
                                const price = item.price || item.productId?.price || 0;
                                const quantity = item.quantity || 0;
                                return sum + price * quantity;
                            }, 0);

                            return (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="border p-2 font-bold">{order.customer.fullName}</td>
                                    <td className="border p-2 font-bold">{order.customer.email}</td>
                                    <td className="border p-2 font-bold">{order.customer.address}</td>
                                    <td className="border p-2 font-semibold text-red-500">
                                        {totalAmount.toLocaleString()} đ
                                    </td>
                                    <td className="border p-2">
                                        {order.status === "đã hoàn thành" ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                đã hoàn thành
                                            </span>
                                        ) : order.status === "Đã hủy" ? (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Đã hủy
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                chờ xác nhận
                                            </span>
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        <ul className="pl-3">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="font-bold">
                                                    {item.productId?.name} - SL: {item.quantity} -{" "}
                                                    {(item.price || item.productId?.price || 0).toLocaleString()} đ
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Cột đánh giá */}
                                    <td className="border p-2 text-center">
                                        {order.status === "đã hoàn thành" ? (
                                            <div className="flex flex-col gap-1 items-center">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                className={`text-yellow-500 text-lg`}
                                                            >
                                                                {item.rating >= star ? "★" : "☆"}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Chưa đánh giá</span>
                                        )}
                                    </td>

                                    {/* Cột hành động */}
                                    <td className="border p-2 text-center">
                                        {order.status === "chờ xác nhận" ? (
                                            <div className="flex flex-col gap-2 items-center">
                                                <button
                                                    onClick={() => updateStatus(order._id, "đã hoàn thành")}
                                                    className="bg-green-500 text-white px-1 py-1 rounded font-bold w-32 hover:bg-green-600"
                                                >
                                                    ✅ Hoàn thành
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order._id, "Đã hủy")}
                                                    className="bg-red-500 text-white px-1 py-1 rounded font-bold w-full hover:bg-red-600"
                                                >
                                                    ❌ Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <em className="text-gray-500 font-semibold">Đã xử lý</em>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
