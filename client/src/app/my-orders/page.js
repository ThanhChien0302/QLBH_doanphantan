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
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            {order.status === "chờ xác nhận" && (
                                <span className="text-yellow-600">Chờ xác nhận</span>
                            )}
                            {order.status === "đã hoàn thành" && (
                                <span className="text-green-600">Đã hoàn thành</span>
                            )}
                            {order.status === "Đã hủy" && (
                                <span className="text-red-600">Đã hủy</span>
                            )}
                        </p>

                        <ul className="mt-2 list-disc ml-6">
                            {order.items.map(item => (
                                <li key={item._id}>
                                    {item.productId?.name || "Sản phẩm"} - SL: {item.quantity}
                                </li>
                            ))}
                        </ul>

                        {/* ✅ Nút hủy đơn chỉ hiện nếu đơn đang chờ xác nhận */}
                        {order.status === "chờ xác nhận" && (
                            <button
                                onClick={() => handleCancel(order._id)}
                                className="mt-3 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                            >
                                Hủy đơn hàng
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}