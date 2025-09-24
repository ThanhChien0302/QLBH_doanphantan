"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const email = localStorage.getItem("email"); // ✅ lấy email từ login
        if (!email) return;

        fetch(`http://localhost:5000/api/orders/${email}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">📑 Đơn hàng của tôi</h1>

                {orders.length === 0 && (
                    <p>Bạn chưa có đơn hàng nào.</p>
                )}

                {orders.map(order => (
                    <div key={order._id} className="bg-white p-4 rounded-xl shadow mb-4">
                        <p><strong>Mã đơn:</strong> {order._id}</p>
                        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                        <p><strong>Trạng thái:</strong> {order.status}</p>
                        <ul className="mt-2 list-disc ml-6">
                            {order.items.map(item => (
                                <li key={item._id}>
                                    {item.productId?.name || "Sản phẩm"} - SL: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
