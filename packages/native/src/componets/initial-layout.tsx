import { colors } from "@/constants/color"
import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect, useMemo } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

export const InitialLayout = () => {
  const { isLoading, isAuthenticated } = { isLoading: false, isAuthenticated: true }

  const [segment] = useSegments()
  const router = useRouter()

  const inAuthScreen = useMemo(() => segment === "(auth)", [segment])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated && !inAuthScreen) {
      router.replace("/(auth)/signin")
    } else if (isAuthenticated && inAuthScreen) {
      router.replace("/(tabs)")
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
