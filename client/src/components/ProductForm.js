"use client";

import { useState } from "react";
import api from "../lib/api";

export default function ProductForm({ onAdd }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/products", { name, price, quantity });
            setName(""); setPrice(0); setQuantity(0);
            onAdd();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
            <button type="submit">Add Product</button>
        </form>
    );
}
