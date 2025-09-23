"use client";

import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import ProductForm from "../../components/ProductForm";

export default function ProductsPage() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    const reload = () => window.location.reload();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">📦 Quản lý sản phẩm</h1>

                {role === "admin" && (
                    <div className="mb-8 bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-4">➕ Thêm sản phẩm mới</h2>
                        <ProductForm onAdd={reload} />
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">📋 Danh sách sản phẩm</h2>
                    <ProductList />
                </div>
            </div>
        </div>
    );
}
