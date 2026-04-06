import { create } from "zustand";

type AuthState = {
  email: string;
  password: string;
  setUserEmail: (email: string) => void;
  setUserPassword: (password: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  password: "",
  setUserEmail: (email) => set({ email }),
  setUserPassword: (password) => set({ password }),
  clear: () => set({ email: "", password: "" }),
}));