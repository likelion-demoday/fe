import { create } from "zustand";

const useAuthStore = create((set) => ({
    email: "",
    password: "",
    nickname: "",

    setAuthData: (data) => set((prev) => ({ ...prev, ...data })),
    clearAuthData: () => set({ email: "", password: "", nickname: "" }),
}));

export default useAuthStore;