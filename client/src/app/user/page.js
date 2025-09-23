"use client";

import ProductList from "../components/ProductList";

export default function UserPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            <ProductList roleProp="user" />
        </div>
    );
}
