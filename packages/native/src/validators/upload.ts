import { createUploadSchema } from "database/src/validators/upload"
import { z } from "zod"

export const uploadSchema = createUploadSchema

export type UploadSchema = z.infer<typeof uploadSchema>
