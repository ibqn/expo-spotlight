import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { useReactQueryDevTools } from "@dev-plugins/react-query"

const queryClient = new QueryClient({})

export function QueryProvider({ children }: PropsWithChildren) {
  useReactQueryDevTools(queryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
