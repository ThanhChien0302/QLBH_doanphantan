"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CartList() {
    const { cart, removeFromCart, clearCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const totalPrice = cart
        .filter((item) => selectedItems.includes(item._id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mt-8">
            <h1 className="text-2xl font-bold mb-6">🛒 Giỏ hàng của tôi</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-20">Không có sản phẩm nào trong giỏ hàng.</p>
            ) : (
                <>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Chọn</th>
                                <th className="p-2 text-left">Sản phẩm</th>
                                <th className="p-2 text-left">Giá</th>
                                <th className="p-2 text-left">Số lượng</th>
                                <th className="p-2 text-left">Tổng</th>
                                <th className="p-2 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item._id)}
                                            onChange={() => handleCheckboxChange(item._id)}
                                        />
                                    </td>
                                    <td className="p-2 flex items-center gap-2">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:5000/${item.image}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                        {item.name}
                                    </td>
                                    <td className="p-2">{item.price.toLocaleString("vi-VN")} VND</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">{(item.price * item.quantity).toLocaleString("vi-VN")} VND</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                        <p className="text-xl font-semibold">
                            Tổng cộng: {totalPrice.toLocaleString("vi-VN")} VND
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={clearCart}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Xóa tất cả
                            </button>

                            <Link href={`/checkout?items=${selectedItems.join(",")}`}>
                                <button
                                    disabled={selectedItems.length === 0}
                                    className={`px-4 py-2 rounded text-white ${selectedItems.length === 0
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600"
                                        }`}
                                >
                                    Thanh toán
                                </button>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
