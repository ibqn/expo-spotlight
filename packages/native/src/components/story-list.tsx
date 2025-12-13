import { storyData } from "@/mocks/story-data"
import { ScrollView, StyleSheet } from "react-native"
import { StoryItem } from "@/components/story-item"
import { colors } from "@/constants/color"

export const StoryList = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
      {storyData.map((story) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
})
