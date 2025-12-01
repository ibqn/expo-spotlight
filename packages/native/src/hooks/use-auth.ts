import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, checkAuth, setAuth, clearAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return { user, isLoading, isAuthenticated, checkAuth, setAuth, clearAuth }
}
