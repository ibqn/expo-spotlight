import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import type { Upload } from "database/src/drizzle/schema/upload"
import type { ParamIdSchema } from "database/src/validators/param"
import type { UploadSchema } from "@/validators/upload"
import type { ImagePickerAsset } from "expo-image-picker"

declare global {
  interface FormData {
    append(name: string, value: string): void
    append(name: string, value: Blob, fileName?: string): void
    append(name: string, value: { uri: string; name?: string; type?: string }): void
  }
}

interface FileInput {
  file: ImagePickerAsset
  description?: string
  isPublic?: boolean
}

const getFormData = (fileInput: FileInput) => {
  const formData = new FormData()

  formData.append("file", {
    uri: fileInput.file.uri,
    name: fileInput.file.fileName || "file",
    type: fileInput.file.mimeType || "application/octet-stream",
  })

  if (fileInput.description) {
    formData.append("description", fileInput.description)
  }

  if (fileInput.isPublic !== undefined) {
    formData.append("isPublic", String(fileInput.isPublic))
  }

  return formData
}

export const postUpload = async (fileInput: FileInput) => {
  const formData = getFormData(fileInput)

  const response = await axios.post<ApiResponse<Upload>>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const deleteUpload = async ({ id }: ParamIdSchema) => {
  return await axios.delete<ApiResponse<Upload>>(`/upload/${id}`)
}

export const patchUpload = async ({ id, ...formData }: ParamIdSchema & UploadSchema) => {
  const response = await axios.patch<ApiResponse<Upload>>(`/upload/${id}`, formData)
  return response.data
}
