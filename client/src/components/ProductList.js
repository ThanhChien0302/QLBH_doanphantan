"use client";

import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import ProductForm from "./ProductForm";
import { useCart } from "../context/CartContext";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState(null);
    const [editing, setEditing] = useState(null);
    const [visibleCountAdmin, setVisibleCountAdmin] = useState(5);
    const [visibleCountUser, setVisibleCountUser] = useState(8);

    const { addToCart, setOnQuantityChange } = useCart();

    // Load sản phẩm
    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Callback để CartContext cập nhật ProductList
    const onCartQuantityChange = useCallback((id, delta) => {
        setProducts((prev) =>
            prev.map((p) => (p._id === id ? { ...p, quantity: p.quantity - delta } : p))
        );
    }, []);

    useEffect(() => {
        loadProducts();
        if (typeof window !== "undefined") setRole(localStorage.getItem("role"));
        setOnQuantityChange(onCartQuantityChange);
    }, [setOnQuantityChange, onCartQuantityChange]);

    const handleAddToCart = async (product) => {
        if (product.quantity <= 0) {
            alert("❌ Sản phẩm này đã hết hàng!");
            return;
        }
        try {
            const res = await api.patch(`/products/${product._id}/decrease`);
            addToCart({ ...product, qty: 1 });
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: res.data.quantity } : p
                )
            );
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    // ================= ADMIN LAYOUT =================
    if (role === "admin") {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Hình ảnh</th>
                            <th className="px-4 py-2 border">Tên sản phẩm</th>
                            <th className="px-4 py-2 border">Giá (VND)</th>
                            <th className="px-4 py-2 border">Số lượng</th>
                            <th className="px-4 py-2 border">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.slice(0, visibleCountAdmin).map((p, index) => (
                            <tr key={p._id} className="text-center">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-0 py-0 border h-44 w-44">
                                    {p.image && (
                                        <img
                                            src={`http://localhost:5000/${p.image}`}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </td>
                                <td className="px-4 py-2 border font-bold text-black">{p.name}</td>
                                <td className="px-4 py-2 border font-bold text-black">
                                    {p.price.toLocaleString("vi-VN")}
                                </td>
                                <td
                                    className={`px-4 py-2 border font-bold ${p.quantity === 0 ? "text-red-600" : "text-black"
                                        }`}
                                >
                                    {p.quantity}
                                </td>

                                <td className="px-4 py-2 border">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => setEditing(p)}
                                            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Nút xem thêm / rút gọn */}
                <div className="flex justify-center mt-4">
                    {visibleCountAdmin < products.length ? (
                        <button
                            onClick={() => setVisibleCountAdmin((prev) => prev + 5)}
                            className="bg-blue-500 text-white px-4 py-2 font-bold rounded hover:bg-blue-600"
                        >
                            Xem thêm
                        </button>
                    ) : products.length > 5 ? (
                        <button
                            onClick={() => setVisibleCountAdmin(5)}
                            className="bg-gray-500 text-white px-4 py-2 font-bold rounded hover:bg-gray-600"
                        >
                            Rút gọn
                        </button>
                    ) : null}
                </div>

                {/* Form sửa sản phẩm */}
                {editing && (
                    <div className="p-4 border rounded-xl bg-gray-100 mt-4">
                        <h3 className="font-bold mb-2">✏️ Sửa sản phẩm</h3>
                        <ProductForm
                            initialData={editing}
                            onAdd={() => {
                                loadProducts();
                                setEditing(null);
                            }}
                        />
                        <button
                            onClick={() => setEditing(null)}
                            className="mt-2 text-sm text-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ================= USER LAYOUT =================
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, visibleCountUser).map((p) => (
                    <div
                        key={p._id}
                        className="border rounded-lg shadow p-4 flex flex-col items-center 
                        transform transition duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        {p.image && (
                            <img
                                src={`http://localhost:5000/${p.image}`}
                                alt={p.name}
                                className="w-full h-48 object-cover rounded"
                            />
                        )}
                        <h3 className="font-bold mt-2 text-center">{p.name}</h3>
                        <p className="text-black-800">{p.price.toLocaleString("vi-VN")} VND</p>
                        <p className="text-red-500">Số lượng: {p.quantity}</p>
                        <button
                            onClick={() => handleAddToCart(p)}
                            disabled={p.quantity <= 0}
                            className={`px-4 py-2 rounded mt-2 w-full font-bold transition ${p.quantity > 0
                                ? "bg-green-500 text-black hover:bg-green-600"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                        >
                            {p.quantity > 0 ? "Thêm vào 🛒" : "Hết hàng"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Nút xem thêm / rút gọn */}
            <div className="flex justify-center mt-4">
                {visibleCountUser < products.length ? (
                    <button
                        onClick={() => setVisibleCountUser((prev) => prev + 8)}
                        className="bg-blue-500 text-white px-4 py-2 font-bold rounded hover:bg-blue-600"
                    >
                        Xem thêm
                    </button>
                ) : products.length > 8 ? (
                    <button
                        onClick={() => setVisibleCountUser(8)}
                        className="bg-gray-500 text-white px-4 py-2 font-bold rounded hover:bg-gray-600"
                    >
                        Rút gọn
                    </button>
                ) : null}
            </div>
        </div>
    );
}
