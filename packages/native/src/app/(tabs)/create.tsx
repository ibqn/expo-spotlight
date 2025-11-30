import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native"
import { colors } from "@/constants/color"
import { useState } from "react"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { images } from "@/constants/images"

export default function CreateScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [caption, setCaption] = useState("")

  const isSharing = false

  const handleShare = () => {
    console.log("Sharing post with caption:", caption, "and image URI:", selectedImage)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const [image] = result.assets
      console.log("Selected image URI:", image)
      setSelectedImage(image.uri)
    }
  }

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
          <Ionicons name="image-outline" size={48} color={colors.grey} />
          <Text style={styles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null)
              setCaption("")
            }}
            disabled={isSharing}
          >
            <Ionicons name="close-outline" size={28} color={isSharing ? colors.grey : colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            <View style={styles.imageSection}>
              <Image source={selectedImage} style={styles.previewImage} contentFit="cover" transition={200} />
              <TouchableOpacity style={styles.changeImageButton} onPress={pickImage} disabled={isSharing}>
                <Ionicons name="image-outline" size={20} color={colors.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image source={images.avatar} style={styles.userAvatar} contentFit="cover" transition={200} />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={colors.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  contentDisabled: {
    opacity: 0.7,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  shareTextDisabled: {
    color: colors.grey,
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyImageText: {
    color: colors.grey,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageSection: {
    width: width,
    height: width,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  changeImageText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    padding: 16,
    flex: 1,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
  },
})
