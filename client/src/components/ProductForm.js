"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ProductForm({ onAdd, initialData }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setQuantity(initialData.quantity);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // update
        await api.put(`/products/${initialData._id}`, {
          name,
          price: Number(price),
          quantity: Number(quantity),
        });
      } else {
        // create
        await api.post("/products", {
          name,
          price: Number(price),
          quantity: Number(quantity),
        });
      }

      setName("");
      setPrice("");
      setQuantity("");
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialData ? "Cập nhật" : "Thêm sản phẩm"}
      </button>
    </form>
  );
}
