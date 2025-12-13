import { colors } from "@/constants/color"
import { Text, View } from "react-native"

export const PostsNotFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: colors.primary }}>No posts yet</Text>
  </View>
)
