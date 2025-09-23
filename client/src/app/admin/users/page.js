"use client";

import ProductList from "../components/ProductList";

export default function AdminPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm (Admin)</h1>
            <ProductList roleProp="admin" />
        </div>
    );
}
