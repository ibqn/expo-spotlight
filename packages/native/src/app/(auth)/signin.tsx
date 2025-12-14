import { colors } from "@/constants/color"
import { images } from "@/constants/images"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { Dimensions, StyleSheet, Text, View, Alert } from "react-native"
import * as WebBrowser from "expo-web-browser"
import { env } from "@/utils/env"
import { useState } from "react"
import { setSessionToken } from "@/utils/session-store"
import { useAuthStore } from "@/stores/auth-store"
import { SocialSignInButton } from "@/components/social-sign-in-button"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { checkAuth } = useAuthStore()

  const handleSocialAuth = async (provider: "github" | "google") => {
    if (isLoading) {
      return
    }

    setIsLoading(provider)
    try {
      const authUrl = `${env.EXPO_PUBLIC_API_URL}/auth/sign-in/${provider}?mobile=true`
      const redirectUrl = "expospotlight://auth"

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl)

      if (result.type === "success" && result.url) {
        const url = new URL(result.url)
        const sessionToken = url.searchParams.get("token")

        console.log(`${provider} session token:`, sessionToken)

        if (sessionToken) {
          // console.log("Signin - setting session token")
          await setSessionToken(sessionToken)
          // console.log("Signin - token set, waiting brief moment")
          // await new Promise((resolve) => setTimeout(resolve, 200))
        }

        // console.log("Signin - calling checkAuth to update global state")
        await checkAuth()
        // console.log("Signin - checkAuth completed, auth store should be updated")
      } else if (result.type === "cancel") {
        console.log(`User cancelled ${provider} authentication`)
      }
    } catch (error) {
      console.error(`${provider} authentication error:`, error)
      Alert.alert("Error", "An error occurred during authentication")
    } finally {
      setIsLoading(null)
    }
  }

  const handleGitHubSignIn = () => handleSocialAuth("github")
  const handleGoogleSignIn = () => handleSocialAuth("google")

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={colors.primary} />
        </View>
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>{"don't miss anything"}</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image source={images.authBackground} style={styles.illustration} contentFit="cover" />
      </View>

      <View style={styles.loginSection}>
        <SocialSignInButton
          provider="github"
          onPress={handleGitHubSignIn}
          isLoading={isLoading === "github"}
          disabled={!!isLoading}
        />

        <SocialSignInButton
          provider="google"
          onPress={handleGoogleSignIn}
          isLoading={isLoading === "google"}
          disabled={!!isLoading}
          style={styles.googleButton}
        />

        <Text style={styles.termsText}>By continuing, you agree to our Terms and Privacy Policy</Text>
      </View>
    </View>
  )
}

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.grey,
    letterSpacing: 1,
    textTransform: "lowercase",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  illustration: {
    width: width * 0.75,
    height: width * 0.75,
    maxHeight: 280,
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  googleButton: {
    marginBottom: 12,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.grey,
    maxWidth: 280,
  },
})
