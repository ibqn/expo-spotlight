import { axios } from "./axios"
import type { ApiResponse, PaginatedSuccessResponse } from "database/src/types"
import type { ParamIdSchema } from "database/src/validators/param"
import { Post } from "database/src/drizzle/schema/post"
import { PostFormSchema, UpdatePostSchema } from "@/validators/post"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import { postPaginationSchema, type PostPaginationSchema } from "database/src/validators/post-pagination"

declare global {
  interface FormData {
    append(name: string, value: string): void
    append(name: string, value: Blob, fileName?: string): void
    append(name: string, value: { uri: string; name?: string; type?: string; size?: number }): void
  }
}

const getFormData = (postInput: PostFormSchema) => {
  const formData = new FormData()

  formData.append("file", postInput.image)

  if (postInput.caption) {
    formData.append("caption", postInput.caption)
  }

  return formData
}

export const postPost = async (postInput: PostFormSchema) => {
  const formData = getFormData(postInput)

  const response = await axios.post<ApiResponse<Post>>("/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const deletePost = async ({ id }: ParamIdSchema) => {
  return await axios.delete<ApiResponse<Post>>(`/post/${id}`)
}

export const patchPost = async ({ id, ...formData }: ParamIdSchema & UpdatePostSchema) => {
  const response = await axios.patch<ApiResponse<Post>>(`/post/${id}`, formData)
  return response.data
}

export const getPostItems = async (params?: PostPaginationSchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Post[]>>("/post", { params })
  const { data: postItems, pagination } = response

  return { postItems, pagination }
}

export type GetPostItems = Awaited<ReturnType<typeof getPostItems>>

export const postListQueryOptions = (paramsInput?: PostPaginationSchema) => {
  const params = postPaginationSchema.parse(paramsInput ?? {})

  return queryOptions({
    queryKey: ["post-list", params] as const,
    queryFn: () => getPostItems(params),
    placeholderData: keepPreviousData,
  })
}
