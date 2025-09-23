"use client";

import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            router.push("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
