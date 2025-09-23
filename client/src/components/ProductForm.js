"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ProductForm({ onAdd, initialData }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [imageFile, setImageFile] = useState(null); // file ảnh
    const [preview, setPreview] = useState(""); // preview ảnh

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setQuantity(initialData.quantity);
            setPreview(initialData.image || "");
        }
    }, [initialData]);

    useEffect(() => {
        // tạo preview khi chọn file mới
        if (!imageFile) return;
        const objectUrl = URL.createObjectURL(imageFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl); // cleanup
    }, [imageFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("quantity", quantity);
            if (imageFile) formData.append("image", imageFile);

            if (initialData) {
                // update
                await api.put(`/products/${initialData._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                // create
                await api.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setName("");
            setPrice("");
            setQuantity("");
            setImageFile(null);
            setPreview("");
            onAdd();
        } catch (err) {
            console.error("❌ Error saving product:", err.response?.data || err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="number"
                placeholder="Giá"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="number"
                placeholder="Số lượng"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border p-2 w-full rounded"
            />

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                />
            )}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {initialData ? "Cập nhật" : "Thêm sản phẩm"}
            </button>
        </form>
    );
}
