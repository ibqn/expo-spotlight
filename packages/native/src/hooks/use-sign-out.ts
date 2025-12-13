import { getSignOut } from "@/api/auth"
import { useAuthStore } from "@/stores/auth-store"
import { deleteSessionToken } from "@/utils/session-store"
import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { Alert } from "react-native"

export const useSignOut = () => {
  const { clearAuth } = useAuthStore()

  const { mutate: signOut } = useMutation({
    mutationFn: getSignOut,
    onSuccess: async () => {
      await deleteSessionToken()
      clearAuth()
      router.replace("/(auth)/signin")
    },
    onError: (error) => {
      console.error("Sign out mutation error:", error)
      Alert.alert("Error", "Failed to sign out")
    },
  })

  return { signOut }
}
