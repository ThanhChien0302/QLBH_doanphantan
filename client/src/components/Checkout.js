"use client";

import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../lib/api";

export default function CheckoutPage() {
    const { cart, removeFromCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const itemsParam = searchParams.get("items"); // "id1,id2"
    const selectedIds = itemsParam ? itemsParam.split(",") : [];
    const selectedCartItems = cart.filter(item => selectedIds.includes(item._id));

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        email: ""
    });
    const [code, setCode] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (selectedCartItems.length === 0) {
            router.push("/products"); // không có sản phẩm được chọn
        }
    }, [selectedCartItems, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSendCode = async () => {
        const { fullName, phone, address, email } = form;
        if (!fullName || !phone || !address || !email) {
            return alert("Vui lòng điền đầy đủ thông tin.");
        }

        setSending(true);
        try {
            await api.post("/orders/send-code", {
                customer: { fullName, phone, address, email },
                items: selectedCartItems.map(item => ({ productId: item._id, quantity: item.quantity }))
            });
            alert("Mã xác nhận đã gửi vào email!");
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi gửi mã, vui lòng thử lại.");
        } finally {
            setSending(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) return alert("Vui lòng nhập mã xác nhận.");

        setSending(true);
        try {
            await api.post("/orders/verify", { email: form.email, code });
            // chỉ xóa các sản phẩm đã mua
            selectedCartItems.forEach(item => removeFromCart(item._id));
            alert("Đơn hàng đã xác nhận!");
            router.push("/products");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Mã xác nhận không hợp lệ.");
        } finally {
            setSending(false);
        }
    };

    if (selectedCartItems.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow mt-8">
            <h1 className="text-2xl font-bold mb-4">🛒 Thanh toán đơn hàng</h1>

            {step === 1 && (
                <>
                    <div className="mb-4">
                        <label className="block mb-1">Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Số điện thoại:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Địa chỉ:</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Email nhận xác nhận:</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <p className="mb-4">
                        Phương thức thanh toán: <strong>COD (Thanh toán khi nhận hàng)</strong>
                    </p>
                    <button
                        onClick={handleSendCode}
                        disabled={sending}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {sending ? "Đang gửi mã..." : "Gửi mã xác nhận"}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <p className="mb-4">Nhập mã xác nhận:</p>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                        placeholder="Nhập mã xác nhận"
                    />
                    <button
                        onClick={handleVerifyCode}
                        disabled={sending}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {sending ? "Đang xác nhận..." : "Xác nhận đơn hàng"}
                    </button>
                </>
            )}
        </div>
    );
}
