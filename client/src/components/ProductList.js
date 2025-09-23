"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);

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
    }, []);

    return (
        <ul>
            {products.map(p => (
                <li key={p._id}>{p.name} - {p.price} - {p.quantity}</li>
            ))}
        </ul>
    );
}
