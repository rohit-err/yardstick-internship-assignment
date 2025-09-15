
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/noteStore";

export default function NoteDetail({ noteId, onBack }) {
  const { user } = useAuthStore();
  const { getSingleNote } = useNotesStore();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const noteData = await getSingleNote(noteId);
        setNote(noteData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, getSingleNote]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
          >
            ← Back to Notes
          </button>
        </div>


        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 break-words">
            {note?.title}
          </h1>

          <div className="text-sm text-gray-500 mb-6">
            Created:{" "}
            {note && new Date(note.createdAt).toLocaleString()}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {note?.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
