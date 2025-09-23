"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductForm from "./ProductForm";
import { useCart } from "../context/CartContext";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState(null);
    const [editing, setEditing] = useState(null);
    const { addToCart } = useCart();

    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setRole(localStorage.getItem("role"));
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

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
                    {products.map((p, index) => (
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
                            <td className="px-4 py-2 border">{p.name}</td>
                            <td className="px-4 py-2 border">{p.price.toLocaleString("vi-VN")}</td>
                            <td className="px-4 py-2 border">{p.quantity}</td>
                            <td className="px-4 py-2 border">
                                <div className="flex justify-center gap-2">
                                    {role === "admin" ? (
                                        <>
                                            <button
                                                onClick={() => setEditing(p)}
                                                className="bg-yellow-500 text-white px-4 py-2 text-base rounded hover:bg-yellow-600"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="bg-red-500 text-white px-4 py-2 text-base rounded hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(p)}
                                            className="bg-green-500 text-white px-4 py-2 text-base rounded hover:bg-green-600"
                                        >
                                            🛒 Mua
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
