"use client";

import { createContext, useContext, useState, useRef } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Ref để lưu callback cập nhật ProductList
    const quantityChangeCallback = useRef(null);

    const setOnQuantityChange = (callback) => {
        quantityChangeCallback.current = callback;
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const item = prev.find((p) => p._id === product._id);
            if (item) {
                // Tăng qty nếu đã có trong giỏ
                const newCart = prev.map((p) =>
                    p._id === product._id ? { ...p, qty: p.qty + product.qty } : p
                );
                quantityChangeCallback.current?.(product._id, product.qty); // giảm quantity trên ProductList
                return newCart;
            }
            quantityChangeCallback.current?.(product._id, product.qty); // giảm quantity trên ProductList
            return [...prev, product];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const item = prev.find((p) => p._id === productId);
            if (!item) return prev;
            quantityChangeCallback.current?.(productId, -item.qty); // tăng lại quantity trên ProductList
            return prev.filter((p) => p._id !== productId);
        });
    };

    const clearCart = () => {
        // Tăng lại quantity tất cả sản phẩm trước khi clear
        cart.forEach((item) => quantityChangeCallback.current?.(item._id, -item.qty));
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, setOnQuantityChange }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
