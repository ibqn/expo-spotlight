import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { useSignOut } from "@/hooks/use-sign-out"
import { useAuthStore } from "@/stores/auth-store"
import { colors } from "@/constants/color"

export default function Profile() {
  const { user } = useAuthStore()
  const { signOut } = useSignOut()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => {
          signOut()
        }}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 40,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.grey,
  },
  signOutButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
    alignSelf: "flex-start",
  },
  signOutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "500",
  },
})
