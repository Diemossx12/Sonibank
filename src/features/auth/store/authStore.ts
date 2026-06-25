import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  agencyName: string;
  phone: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  biometricEnabled: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setBiometric: (enabled: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  biometricEnabled: false,
  login: (user, accessToken) => set({ isAuthenticated: true, user, accessToken }),
  logout: () => set({ isAuthenticated: false, user: null, accessToken: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setBiometric: (biometricEnabled) => set({ biometricEnabled }),
}));
