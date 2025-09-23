"use client";

import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/auth/register", { username, password, role });
            setSuccess(res.data.message);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
            <h2>Register</h2>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
    );
}
