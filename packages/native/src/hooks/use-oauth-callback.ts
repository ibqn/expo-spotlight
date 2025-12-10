import { useEffect } from "react"
import * as Linking from "expo-linking"
import { router } from "expo-router"
import { setSessionToken } from "@/utils/session-store"
import { useAuthStore } from "@/stores/auth-store"

export const useOauthCallback = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        const parsed = Linking.parse(url)

        if (parsed.hostname === "auth" && parsed.queryParams?.token) {
          const token = parsed.queryParams.token as string
          await setSessionToken(token)

          await checkAuth()

          router.replace("/(tabs)")
        }
      } catch (error) {
        console.error("Error handling OAuth callback:", error)
      }
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })

    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url)
    })

    return () => subscription?.remove()
  }, [checkAuth])
}
