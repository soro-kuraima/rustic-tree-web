import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

// This store will primarily handle authentication state
// Actual user data will be fetched directly from Convex when needed
interface AuthState {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string, convex: ConvexReactClient) => Promise<void>;
  signup: (name: string, email: string, password: string, convex: ConvexReactClient) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password, convex) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would validate credentials and then fetch the user
          // For demo purposes, we'll just look up the user by email
          const user = await convex.query(api.users.getByEmail, { email });
          
          if (!user) {
            throw new Error("Invalid credentials");
          }
          
          set({
            userId: user._id,
            email: user.email,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to login',
            isLoading: false,
          });
        }
      },
      
      signup: async (name, email, password, convex) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, you would hash password and handle proper auth
          // For demo purposes we just create the user in Convex
          const userId = await convex.mutation(api.users.create, {
            name,
            email,
          });
          
          set({
            userId,
            email,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to sign up',
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          userId: null,
          email: null,
          isAuthenticated: false,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'hill-station-auth',
    }
  )
);