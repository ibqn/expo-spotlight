// import { PostItem } from "@/components/post-item"
import { postListQueryOptions } from "@/api/post"
import { Loader } from "@/components/loader"
import { PostDummy } from "@/components/post-dummy"
import { PostItem } from "@/components/post-item"
import { PostsNotFound } from "@/components/posts-not-found"
import { StoryList } from "@/components/story-list"
import { colors } from "@/constants/color"
import { fonts } from "@/constants/font"
import { useSignOut } from "@/hooks/use-sign-out"
import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
  const { signOut } = useSignOut()

  const { data, refetch, isRefetching, isLoading } = useQuery(postListQueryOptions())

  const { postItems = [], pagination } = data ?? {}

  if (isLoading) {
    return <Loader />
  }

  if (!isLoading && postItems.length === 0) {
    return <PostsNotFound />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={postItems}
        renderItem={({ item }) => <PostItem post={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoryList />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.jetBrainsMono.medium,
    color: colors.primary,
  },
})
