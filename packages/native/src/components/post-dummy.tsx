import { colors } from "@/constants/color"
import { Text, View } from "react-native"

export const PostDummy = ({ item }: { item: any }) => {
  return (
    <View>
      <Text style={{ color: colors.white }}>Post Dummy Component</Text>
    </View>
  )
}
