import React, { useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import NoteDetail from "./pages/NoteDetail";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [selectedNoteId, setSelectedNoteId] = React.useState(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login />;

  if (currentView === 'note-detail' && selectedNoteId) {
    return (
      <NoteDetail 
        noteId={selectedNoteId} 
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard 
      onViewNote={(noteId) => {
        setSelectedNoteId(noteId);
        setCurrentView('note-detail');
      }}
    />
  );
}
