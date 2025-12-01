import type { PropsWithChildren } from "react"
import { QueryProvider } from "@/providers/query-provider"
import { SafeAreaProvider } from "react-native-safe-area-context"

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </QueryProvider>
  )
}
