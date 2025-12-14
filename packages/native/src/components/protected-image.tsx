import { Image, type ImageProps } from "expo-image"
import { View, ActivityIndicator, Text } from "react-native"
import { useProtectedImage } from "@/hooks/use-protected-image"
import { colors } from "@/constants/color"

export function ProtectedImage({ source, style, ...props }: ImageProps & { source: string }) {
  const { uri, isLoading, error } = useProtectedImage(source)

  if (isLoading) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }

  if (error || !uri) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center", backgroundColor: colors.grey + "20" }, style]}>
        <Text style={{ color: colors.grey, fontSize: 12 }}>{error || "Failed to load image"}</Text>
      </View>
    )
  }

  return <Image {...props} source={{ uri }} style={style} />
}
