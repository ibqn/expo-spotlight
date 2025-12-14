import { colors } from "@/constants/color"
import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"

interface SocialSignInButtonProps {
  provider: "github" | "google"
  onPress: () => void
  isLoading: boolean
  disabled?: boolean
  style?: ViewStyle
}

const providerConfig = {
  github: {
    icon: "logo-github" as const,
    text: "Continue with GitHub",
    loadingText: "Signing in...",
  },
  google: {
    icon: "logo-google" as const,
    text: "Continue with Google",
    loadingText: "Signing in...",
  },
}

export function SocialSignInButton({ provider, onPress, isLoading, disabled = false, style }: SocialSignInButtonProps) {
  const config = providerConfig[provider]

  return (
    <TouchableOpacity
      style={[styles.socialButton, isLoading && styles.socialButtonLoading, style]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <View style={styles.socialIconContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <Ionicons name={config.icon} size={20} color={colors.surface} />
        )}
      </View>
      <Text style={styles.socialButtonText}>{isLoading ? config.loadingText : config.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  socialButtonLoading: {
    opacity: 0.7,
  },
})
