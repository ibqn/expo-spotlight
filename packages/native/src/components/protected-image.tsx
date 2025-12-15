import { Image, type ImageProps } from "expo-image"
import { useState, useEffect } from "react"
import { View, ActivityIndicator, Text } from "react-native"
import { getSessionToken, formatSessionCookie } from "@/utils/session-store"
import { colors } from "@/constants/color"

export function ProtectedImage({ source, style, ...props }: ImageProps & { source: string }) {
  const [sessionCookie, setSessionCookie] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessionToken = async () => {
      const token = await getSessionToken()
      if (token) {
        setSessionCookie(formatSessionCookie(token))
      }
      setIsLoading(false)
    }

    loadSessionToken()
  }, [])

  if (isLoading) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }

  if (!sessionCookie) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center", backgroundColor: colors.grey + "20" }, style]}>
        <Text style={{ color: colors.grey, fontSize: 12 }}>Not authenticated</Text>
      </View>
    )
  }

  return (
    <Image
      {...props}
      source={{
        uri: source,
        headers: {
          Cookie: sessionCookie,
        },
      }}
      cachePolicy="memory-disk"
      style={style}
      placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      transition={200}
    />
  )
}
