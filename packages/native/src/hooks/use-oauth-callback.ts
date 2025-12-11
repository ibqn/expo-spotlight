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
        console.log("Deep link received:", url)
        const parsed = Linking.parse(url)
        console.log("Parsed URL:", {
          scheme: parsed.scheme,
          hostname: parsed.hostname,
          queryParams: parsed.queryParams,
        })

        if (parsed.scheme === "expospotlight" && parsed.hostname === "auth" && parsed.queryParams?.token) {
          const token = parsed.queryParams.token as string
          console.log("OAuth callback - received token:", token)

          await setSessionToken(token)
          console.log("OAuth callback - token saved")

          // Verify token was saved
          const { getSessionToken } = await import("@/utils/session-store")
          const savedToken = await getSessionToken()
          console.log("OAuth callback - verified saved token:", savedToken)

          // Small delay to ensure token is available for axios
          await new Promise((resolve) => setTimeout(resolve, 100))

          console.log("OAuth callback - calling checkAuth")
          await checkAuth()
          console.log("OAuth callback - checkAuth completed, navigating")
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
