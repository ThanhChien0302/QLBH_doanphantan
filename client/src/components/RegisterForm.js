"use client";

import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/auth/register", { username, password, role: "user" });
            setSuccess(res.data.message);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        Register
                    </button>
                </form>

                {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
                {success && <div className="alert alert-success mt-3 text-center">{success}</div>}
            </div>
        </div>
    );
}
