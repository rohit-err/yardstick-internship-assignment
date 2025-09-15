
import React, { useState } from "react";
import { useNotesStore } from "../store/noteStore";
import { useAuthStore } from "../store/authStore";

export default function CreateNoteForm() {
  const { createNote, fetchNotes, notes, error } = useNotesStore();
  const { tenant, updateTenant } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [createError, setCreateError] = useState("");

  const isFree = tenant?.plan === "free";
  const atLimit = isFree && tenant.freeNotesUsed >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (atLimit) {
      setCreateError(
        "Free plan limit reached (3 notes maximum). Upgrade to Pro for unlimited notes."
      );
      return;
    }

    try {
      setBusy(true);
      await createNote(title, content);
      if (isFree) {
        updateTenant({ freeNotesUsed: tenant.freeNotesUsed + 1 });
      }
      setTitle("");
      setContent("");
      await fetchNotes();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create note";
      setCreateError(errorMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">

      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Create Note
      </h2>


      {(error || createError) && (
        <div className="text-red-600 text-sm mb-3">
          {error || createError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={atLimit}
        />


        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          disabled={atLimit}
        />


        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
            disabled={busy || !title.trim() || !content.trim() || atLimit}
          >
            {busy ? "Creating..." : atLimit ? "Upgrade Required" : "Create"}
          </button>

          {isFree && (
            <p className="text-xs text-gray-500">
              Free plan: {tenant.freeNotesUsed}/3 notes used.{" "}
              {atLimit && "Upgrade to Pro for unlimited notes."}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
