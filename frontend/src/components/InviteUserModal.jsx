
import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function InviteUserModal({ onClose, onInviteSuccess }) {
    const { user, tenant } = useAuthStore();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleInvite = async () => {
        if (!user || user.role !== "admin") {
            setMessage("Only admins can invite users.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(
                `http://localhost:5001/api/tenants/${tenant.slug}/invite`,
                { email, role }
            );
            setMessage(res.data.message);
            setEmail("");
            setRole("member");
            if (onInviteSuccess) onInviteSuccess();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Invite failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
               
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Invite User
                </h2>

                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter user email"
                    />
                </div>

                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

               
                {message && (
                    <div
                        className={`text-sm mb-4 ${message.toLowerCase().includes("failed") ||
                                message.toLowerCase().includes("only admins")
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                    >
                        {message}
                    </div>
                )}

                
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInvite}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
                    >
                        {loading ? "Inviting..." : "Invite"}
                    </button>
                </div>
            </div>
        </div>
    );
}
