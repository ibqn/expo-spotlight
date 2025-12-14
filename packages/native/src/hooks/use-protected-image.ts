import { useQuery } from "@tanstack/react-query"
import { axios } from "@/api/axios"

const fetchProtectedImage = async (source: string): Promise<string> => {
  const response = await axios.get(source, { responseType: "arraybuffer" })

  // Convert ArrayBuffer to base64 in chunks to avoid stack overflow
  const bytes = new Uint8Array(response.data)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)

  const contentType = response.headers["content-type"] || "image/jpeg"

  return `data:${contentType};base64,${base64}`
}

export function useProtectedImage(source: string) {
  const {
    data: uri,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["protected-image", source],
    queryFn: () => fetchProtectedImage(source),
    enabled: !!source,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    uri: uri || null,
    isLoading,
    error: error?.message || null,
  }
}
