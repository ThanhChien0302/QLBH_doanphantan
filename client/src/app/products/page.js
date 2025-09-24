"use client";

import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import ProductForm from "../../components/ProductForm";
import { useCart } from "../../context/CartContext"; 
import Link from "next/link";

export default function ProductsPage() {
    const [role, setRole] = useState(null);
    const { cart } = useCart();  // ✅ lấy giỏ hàng từ context

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    const reload = () => window.location.reload();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">📦 Cửa hàng quần áo</h1>
                    {role !== "admin" && (
                        <Link href="/cart">
                            <button className="bg-yellow-500 text-black px-4 py-3 font-bold rounded hover:bg-yellow-600">
                                🛒 Giỏ hàng ({cart.length})
                            </button>
                        </Link>
                    )}


                </div>

                {role === "admin" && (
                    <div className="mb-8 bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-4">➕ Thêm sản phẩm mới</h2>
                        <ProductForm onAdd={reload} />
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">📋 Danh sách sản phẩm</h2>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-blue-500 text-black font-bold px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Xem đơn hàng đã đặt
                        </button>
                    </div>
                    <ProductList />
                </div>

            </div>
        </div>
    );
} 