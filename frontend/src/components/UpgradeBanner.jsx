

import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function UpgradeBanner() {
  const { user, tenant, updateTenant } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isFree = tenant?.plan === "free";
  const freeNotesUsed = tenant?.freeNotesUsed || 0;
  const atLimit = isFree && freeNotesUsed >= 3;

  const handleUpgrade = async () => {
    if (!user || user.role !== "admin") {
      setMessage("Only admins can upgrade the tenant.");
      return;
    }
    setMessage(null);
    setLoading(true);
    try {
      const base = "http://localhost:5001/api";
      await axios.post(`${base}/tenants/${tenant.slug}/upgrade`);
      setMessage("Upgraded to Pro successfully.");
      updateTenant({ plan: "pro", freeNotesUsed: 0 });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upgrade failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isFree) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="font-semibold text-yellow-800">
            {atLimit ? "Free plan limit reached" : "Upgrade available"}
          </div>
          <div className="text-sm text-gray-700 mt-1">
            {atLimit
              ? `Free tenants are limited to 3 notes (${freeNotesUsed}/3 used). Upgrade to Pro to continue creating notes.`
              : `Upgrade to Pro anytime for unlimited notes. (${freeNotesUsed}/3 notes used)`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === "admin" ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-60 text-sm"
            >
              {loading ? "Upgrading..." : "Upgrade to Pro"}
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              Ask an admin to upgrade
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`mt-3 text-sm px-3 py-2 rounded-lg ${message.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
            }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
