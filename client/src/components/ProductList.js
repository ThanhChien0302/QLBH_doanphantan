"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductForm from "./ProductForm";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState(null);
    const [editing, setEditing] = useState(null); // sản phẩm đang sửa

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
            setProducts(products.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-4">
            {products.map((p) => (
                <div
                    key={p._id}
                    className="p-4 border rounded-xl flex justify-between items-center"
                >
                    <div>
                        <p className="font-bold">{p.name}</p>
                        <p>💰 {p.price} VND | 📦 {p.quantity}</p>
                    </div>

                    {role === "admin" && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(p)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(p._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Xóa
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Form sửa sản phẩm */}
            {editing && (
                <div className="p-4 border rounded-xl bg-gray-100">
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
