
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
    } catch (err) {

    }
  };

  const fillTest = (email) => setForm({ email, password: "password" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Notes <span className="text-indigo-600">SaaS</span>
        </h1>


        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>


        <div className="mt-6 text-sm text-gray-600">
          <p className="font-medium mb-2 text-center">
            Quick test accounts (click to autofill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillTest("admin@acme.test")}
              className="py-2 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm transition"
            >
              admin@acme
            </button>
            <button
              onClick={() => fillTest("user@acme.test")}
              className="py-2 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm transition"
            >
              user@acme
            </button>
            <button
              onClick={() => fillTest("admin@globex.test")}
              className="py-2 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm transition"
            >
              admin@globex
            </button>
            <button
              onClick={() => fillTest("user@globex.test")}
              className="py-2 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm transition"
            >
              user@globex
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            Password for all demo accounts:{" "}
            <span className="font-medium text-gray-700">password</span>
          </p>
        </div>
      </div>
    </div>
  );
}
