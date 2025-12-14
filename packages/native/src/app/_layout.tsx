import { InitialLayout } from "@/components/initial-layout"
import { colors } from "@/constants/color"
import { Providers } from "@/providers"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect } from "react"
import { useFonts } from "expo-font"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "JetBrainsMono-Medium": require("@/assets/fonts/jet-brains-mono-medium.ttf"),
  })

  useEffect(() => {
    if (error) {
      throw error
    }

    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <Providers>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <InitialLayout />
      </SafeAreaView>
    </Providers>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
