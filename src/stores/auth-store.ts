import { create } from 'zustand';
import { User } from '../types';
import { Id } from '../../convex/_generated/dataModel';

interface AuthState {
  user: User | null;
  userId: Id<"users"> | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setUserId: (userId: Id<"users"> | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userId: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setUserId: (userId) => set({ userId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearUser: () => set({ user: null, userId: null, error: null }),
}));