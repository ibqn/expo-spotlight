import { userQueryOptions } from "@/api/auth"
import { colors } from "@/constants/color"
import { getImageUri } from "@/utils/image-uri"
import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import type { Post } from "database/src/drizzle/schema/post"
import { Image } from "expo-image"
import { Link } from "expo-router"
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ProtectedImage } from "./protected-image"

type PostProps = {
  post: Post
}

export function PostItem({ post }: PostProps) {
  const { data: user } = useQuery(userQueryOptions())

  const handleDelete = () => {}

  const imageUri = getImageUri(post.image?.id ?? "")
  console.log("PostItem - imageUri:", imageUri)

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href={user?.id === post.user?.id ? "/(tabs)/profile" : `/user/${post.user?.id}`} asChild>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.user?.avatarUrl}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.user?.username}</Text>
          </TouchableOpacity>
        </Link>

        {post.user?.id === user?.id ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <ProtectedImage
        source={imageUri}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? colors.primary : colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={colors.white} />
        </TouchableOpacity>
      </View>


      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {post.likes > 0 ? `${post.likes.toLocaleString()} likes` : "Be the first to like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.user?.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        {post.comments > 0 && (
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.commentsText}>View all {post.comments} comments</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timeAgo}>{formatDistanceToNow(post._creationTime, { addSuffix: true })}</Text>
      </View>

      <CommentsModal postId={post.id} visible={showComments} onClose={() => setShowComments(false)} /> */}
    </View>
  )
}

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  post: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  postImage: {
    width: width,
    height: width,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  postInfo: {
    paddingHorizontal: 12,
  },
  likesText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 6,
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  captionUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    marginRight: 6,
  },
  captionText: {
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  commentsText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 8,
  },
  modalContainer: {
    backgroundColor: colors.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: colors.white,
    fontWeight: "500",
    marginBottom: 4,
  },
  commentText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 4,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.surface,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    color: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    fontSize: 14,
  },
  postButton: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
})
