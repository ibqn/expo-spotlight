import { z } from "zod"

export const postSortedByValues = ["caption", "recent"] as const
export const postSortedBySchema = z.enum(postSortedByValues)
export type PostSortedBySchema = z.infer<typeof postSortedBySchema>

export const orderSchema = z.enum(["asc", "desc"])
export type OrderSchema = z.infer<typeof orderSchema>

export const postPaginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sortedBy: postSortedBySchema.default("recent"),
  order: orderSchema.default("desc"),
})

export type PostPaginationSchema = z.infer<typeof postPaginationSchema>
