import { z } from "zod"
import { paginationSchema } from "./pagination"
import { createInsertSchema } from "drizzle-zod"
import { postTable } from "../drizzle/schema/post"

export const createPostSchema = createInsertSchema(postTable, {
  caption: z.string().max(1000).optional(),
  imageId: z.uuid(),
  userId: z.uuid(),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type CreatePostSchema = z.infer<typeof createPostSchema>

export const updatePostSchema = createInsertSchema(postTable, {
  caption: z.string().nonempty(),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type UpdatePostSchema = z.infer<typeof updatePostSchema>

export const postSearchSchema = paginationSchema
export type PostSearchSchema = z.infer<typeof postSearchSchema>
