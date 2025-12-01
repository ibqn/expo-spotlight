import { InitialLayout } from "@/componets/initial-layout"
import { colors } from "@/constants/color"
import { Providers } from "@/providers"
import { StatusBar } from "expo-status-bar"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function RootLayout() {
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
