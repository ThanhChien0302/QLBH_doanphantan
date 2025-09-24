"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductForm from "./ProductForm";
import { useCart } from "../context/CartContext";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState(null);
    const [editing, setEditing] = useState(null);
    const [visibleCount, setVisibleCount] = useState(8); // số sản phẩm hiển thị cho user
    const { addToCart } = useCart();

    // load sản phẩm từ API
    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProducts();
        // lấy role client side
        if (typeof window !== "undefined") {
            setRole(localStorage.getItem("role"));
        }
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

    // user xem thêm
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    // layout admin
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
                                        <button
                                            onClick={() => setEditing(p)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
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

    // layout user
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, visibleCount).map((p) => (
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
                            onClick={() => addToCart(p)}
                            className="bg-green-500 text-black px-4 py-2 rounded mt-2 w-full hover:bg-green-600"
                        >
                            Thêm vào 🛒
                        </button>
                    </div>
                ))}
            </div>

            {visibleCount < products.length && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleLoadMore}
                        className="bg-blue-500 text-white px-4 py-2 font-bold rounded hover:bg-blue-600"
                    >
                        Xem thêm
                    </button>
                </div>
            )}
        </div>
    );
}
