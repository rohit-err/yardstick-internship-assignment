

import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function NoteCard({ note, onDelete, onEdit, onView }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [busy, setBusy] = useState(false);
  const { user } = useAuthStore();
  const userId = user.id;
  const canEditOrDelete = user?.role === "admin" || note.userId === userId;

  const save = async () => {
    setBusy(true);
    try {
      await onEdit(note._id, { title, content });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full">
      {isEditing ? (
        <>
          <input
            className="border rounded-lg px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border rounded-lg px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <div className="flex gap-2 mt-auto">
            <button
              onClick={save}
              disabled={busy}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(note.title);
                setContent(note.content);
              }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="font-semibold text-lg line-clamp-1">{note.title}</h4>
          <p className="text-sm text-gray-600 mt-2 flex-1 whitespace-pre-wrap line-clamp-4">
            {note.content}
          </p>
          <div className="mt-3 text-xs text-gray-400">
            Created: {new Date(note.createdAt).toLocaleString()}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onView}
              className="px-3 py-1.5 border rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm"
            >
              View
            </button>
            {canEditOrDelete && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 text-sm"
              >
                Edit
              </button>
            )}
            {canEditOrDelete && (
              <button
                onClick={() => {
                  if (confirm("Delete note?")) onDelete();
                }}
                className="px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

