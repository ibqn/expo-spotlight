import { z } from "zod"

const maxFileSize = 10 * 1024 * 1024
const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png"]

export const postFormSchema = z.object({
  caption: z.string().max(1000).optional(),
  image: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string(),
      size: z.number().optional(),
    })
    .refine((file) => !!file.uri, "Image is required")
    .refine((file) => !file.size || file.size <= maxFileSize, "Image must be less than 10MB")
    .refine((file) => !file.type || acceptedImageTypes.includes(file.type), "Only .jpg, .jpeg, .png are allowed"),
})

export type PostFormSchema = z.infer<typeof postFormSchema>

export const updatePostSchema = z.object({
  caption: z.string().max(1000),
})

export type UpdatePostSchema = z.infer<typeof updatePostSchema>
