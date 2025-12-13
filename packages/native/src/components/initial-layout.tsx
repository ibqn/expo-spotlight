import { colors } from "@/constants/color"
import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect, useMemo } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import { useAuthStore } from "@/stores/auth-store"

export const InitialLayout = () => {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const [segment] = useSegments()
  const router = useRouter()

  const inAuthScreen = useMemo(() => segment === "(auth)", [segment])

  useEffect(() => {
    console.log("[InitialLayout] Navigation effect triggered:", {
      isLoading,
      isAuthenticated,
      inAuthScreen,
      segment,
    })

    if (isLoading) {
      console.log("[InitialLayout] Still loading, skipping navigation")
      return
    }

    if (!isAuthenticated && !inAuthScreen) {
      console.log("[InitialLayout] Not authenticated, redirecting to signin")
      router.replace("/(auth)/signin")
    } else if (isAuthenticated && inAuthScreen) {
      console.log("[InitialLayout] Authenticated in auth screen, redirecting to tabs")
      router.replace("/(tabs)")
    } else {
      console.log("[InitialLayout] No navigation needed")
    }
  }, [isAuthenticated, isLoading, inAuthScreen, segment, router])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
})
