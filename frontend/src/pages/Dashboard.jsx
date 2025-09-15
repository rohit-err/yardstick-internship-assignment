
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/noteStore";
import NoteCard from "../components/NoteCard";
import CreateNoteForm from "../components/CreateNoteForm";
import UpgradeBanner from "../components/UpgradeBanner";
import InviteUserModal from "../components/InviteUserModal";

export default function Dashboard({ onViewNote }) {
  const { user, tenant, logout } = useAuthStore();
  const { notes, fetchNotes, deleteNote, editNote } = useNotesStore();
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Notes — {tenant?.name ?? "Tenant"}
            </h1>
            <p className="text-sm text-gray-500">
              Plan:{" "}
              <span className="font-medium capitalize">{tenant?.plan}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-400">
                {user?.role?.toUpperCase()}
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                Invite User
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>


      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInviteSuccess={() => setShowInviteModal(false)}
        />
      )}


      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <CreateNoteForm />

        <UpgradeBanner />

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            All Notes
          </h2>

          {notes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500 text-sm">
              No notes yet. Create your first note!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={() =>
                    deleteNote(note._id).then(() => fetchNotes())
                  }
                  onEdit={async (id, updates) => {
                    await editNote(id, updates);
                    fetchNotes();
                  }}
                  onView={() => onViewNote(note._id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
