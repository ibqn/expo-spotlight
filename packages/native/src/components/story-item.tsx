import { Story } from "@/mocks/story-data"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { colors } from "@/constants/color"

type StoryItemProps = {
  story: Story
}

export function StoryItem({ story }: StoryItemProps) {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 4,
  },
  noStory: {
    borderColor: colors.grey,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.background,
  },
  storyUsername: {
    fontSize: 11,
    color: colors.white,
    textAlign: "center",
  },
})
