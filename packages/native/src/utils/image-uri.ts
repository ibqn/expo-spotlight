import { env } from "@/utils/env"

export const getImageUri = (imageId: string) => {
  return `${env.EXPO_PUBLIC_API_URL}/upload/${imageId}`
}
