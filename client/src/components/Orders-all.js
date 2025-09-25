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
            <h1 className="text-2xl font-bold mb-4">📑 Quản lý đơn hàng</h1>
            {orders.length === 0 ? (
                <p>Chưa có đơn hàng nào.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="border p-4 rounded-lg shadow mb-4 bg-white">
                        <p><strong>Khách hàng:</strong> {order.customer.fullName} - {order.customer.email}</p>
                        <p><strong>Địa chỉ:</strong> {order.customer.address}</p>
                        <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString()} đ</p>
                        <p><strong>Trạng thái:</strong> {order.status}</p>

                        <h3 className="mt-2 font-semibold">Sản phẩm:</h3>
                        <ul>
                            {order.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.productId?.name} - SL: {item.quantity} - Giá: {item.price?.toLocaleString()} đ
                                </li>
                            ))}
                        </ul>

                        {order.status === "chờ xác nhận" && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => updateStatus(order._id, "đã hoàn thành")}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    ✅ Hoàn thành
                                </button>
                                <button
                                    onClick={() => updateStatus(order._id, "Đã hủy")}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    ❌ Hủy
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
