import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  currentUser: any;
  setToken: (token: string) => void; // Token'ı set etmek için fonksiyon
  setAuth: (token: string, refreshToken: string, email: string) => void;
  setCurrentUser: (user: any) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      email: null,
      currentUser: null,
      setToken: (token) => set({ token }), // Token'ı set etmek için fonksiyon
      setAuth: (token, refreshToken, email) => set({ token, refreshToken, email }),
      setCurrentUser: (user) => set({ currentUser: user }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearAuth: () => set({ token: null, refreshToken: null, email: null, currentUser: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
