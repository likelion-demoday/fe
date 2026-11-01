import { create } from "zustand";

const useAuthStore = create((set) => ({
    email: "",
    password: "",
    nickname: "",
    // 소셜 신규 회원 가입용 토큰. 있으면 이메일 대신 소셜 가입으로 처리
    registerToken: "",
    // 가입 완료 후 동의 화면으로 돌아와도 재가입 요청을 보내지 않도록 유지 (clearAuthData로 지우지 않음)
    signupComplete: false,
    agreements: {},

    setAuthData: (data) => set((prev) => ({ ...prev, ...data })),
    setSignupComplete: (agreements) => set({ signupComplete: true, agreements }),
    clearAuthData: () => set({ email: "", password: "", nickname: "", registerToken: "" }),
}));

export default useAuthStore;