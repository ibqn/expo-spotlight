import { z } from "zod"
import { File } from "buffer"

export const postSchema = z.object({
  file: z.instanceof(File),
  caption: z.string().optional(),
})

export type PostSchema = z.infer<typeof postSchema>
