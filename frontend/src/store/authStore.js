import { create } from "zustand";
import axios from "axios";

const AUTH_URL = `https://yardstick-internship-assignment-bac.vercel.app/api/auth`;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    tenant: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const res = await axios.get(`${AUTH_URL}/checkAuth`);
            set({
                user: res.data.user,
                tenant: res.data.user.tenant,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch (error) {
            console.log(error);
            set({
                error: null,
                isCheckingAuth: false,
                isAuthenticated: false,
                user: null,
                tenant: null
            });
        }
    },

    login: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${AUTH_URL}/login`, userData);
            set({
                user: res.data.user,
                tenant: res.data.user.tenant,
                isLoading: false,
                isAuthenticated: true
            });
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error logging in";
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                tenant: null
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${AUTH_URL}/logout`);
        } catch (error) {
            set({ error: null });
            console.error("Logout error:", error);
        } finally {
            set({
                user: null,
                tenant: null,
                isLoading: false,
                isAuthenticated: false
            });
        }
    },
    updateTenant: (updatedTenant) =>
        set((state) => ({
            tenant: { ...state.tenant, ...updatedTenant },
        })),

}));