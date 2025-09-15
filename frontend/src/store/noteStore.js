import { create } from "zustand";
import axios from "axios";

const NOTE_URL = "http://localhost:5001/api/notes";
axios.defaults.withCredentials = true;

export const useNotesStore = create((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,


  fetchNotes: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(NOTE_URL);
      set({ notes: res.data, isLoading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch notes";
      set({
        error: errorMessage,
        isLoading: false
      });
      console.error("Fetch notes error:", err);
    }
  },


  getSingleNote: async (noteId) => {
    try {
      const res = await axios.get(`${NOTE_URL}/${noteId}`);
      return res.data;
    } catch (err) {
      console.error("Get single note error:", err);
      throw err;
    }
  },


  createNote: async (title, content) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(NOTE_URL, { title, content });
      const newNote = res.data;


      set({
        notes: [newNote, ...get().notes],
        isLoading: false
      });

      return newNote;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create note";
      set({
        error: errorMessage,
        isLoading: false
      });
      console.error("Create note error:", err);
      throw err;
    }
  },


  editNote: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(`${NOTE_URL}/${id}`, updates);
      const updatedNote = res.data;


      set({
        notes: get().notes.map((note) =>
          note._id === id ? updatedNote : note
        ),
        isLoading: false,
      });

      return updatedNote;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update note";
      set({
        error: errorMessage,
        isLoading: false
      });
      console.error("Edit note error:", err);
      throw err;
    }
  },


  deleteNote: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${NOTE_URL}/${id}`);


      set({
        notes: get().notes.filter((note) => note._id !== id),
        isLoading: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete note";
      set({
        error: errorMessage,
        isLoading: false
      });
      console.error("Delete note error:", err);
      throw err;
    }
  },
}));