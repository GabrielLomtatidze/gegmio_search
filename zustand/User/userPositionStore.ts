import { create } from 'zustand';

interface AuthPositionState {
  isAuthenticated: boolean;
  guessMode: boolean;
  setAuthenticated: (value: boolean) => void;
  setGuessMode: (value: boolean) => void;
}

export const useAuthPositionStore = create<AuthPositionState>((set) => ({
  isAuthenticated: false,
  guessMode: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setGuessMode: (value) => set({ guessMode: value }),
}));