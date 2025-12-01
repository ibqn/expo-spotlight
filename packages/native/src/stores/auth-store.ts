import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import * as SecureStore from "expo-secure-store"
import type { User, Session } from "database/src/drizzle/schema/auth"
import { validate } from "@/api/auth"

const STORAGE_KEY = "auth-storage"

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name)
    } catch (error) {
      console.error("Error reading from secure store:", error)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value)
    } catch (error) {
      console.error("Error writing to secure store:", error)
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name)
    } catch (error) {
      console.error("Error removing from secure store:", error)
    }
  },
}

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean | null
}

interface AuthActions {
  checkAuth: () => Promise<void>
  setAuth: (user: User, session: Session) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: null,

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const { user, session } = await validate()

          if (user && session) {
            set({
              user: user,
              session: session,
              isAuthenticated: true,
              isLoading: false,
            })
            return
          }
        } catch (error) {
          console.error("[AuthStore] checkAuth - Error:", error)
        }

        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setAuth: (user: User, session: Session) => {
        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      clearAuth: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: null,
          isLoading: false,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
