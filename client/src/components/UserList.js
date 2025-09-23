"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function UserList() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        await api.delete(`/users/${id}`);
        loadUsers();
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <ul>
            {users.map(u => (
                <li key={u._id}>
                    {u.username} - {u.role}
                    <button onClick={() => handleDelete(u._id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
