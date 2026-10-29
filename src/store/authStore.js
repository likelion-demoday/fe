import { create } from "zustand";

const useAuthStore = create((set) => ({
    email: "",
    password: "",
    nickname: "",
    // 소셜 신규 회원 가입용 토큰. 있으면 이메일 대신 소셜 가입으로 처리
    registerToken: "",

    setAuthData: (data) => set((prev) => ({ ...prev, ...data })),
    clearAuthData: () => set({ email: "", password: "", nickname: "", registerToken: "" }),
}));

export default useAuthStore;