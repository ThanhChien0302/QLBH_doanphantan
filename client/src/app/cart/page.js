"use client";

import CartList from "../../components/CartList";

export default function CartPage() {
    return (
        <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
            <div className="max-w-5xl w-full">
                <CartList />
            </div>
        </div>
    );
}
