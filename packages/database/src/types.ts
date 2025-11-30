export type SuccessResponse<T = void> = {
  success: true
  message: string
  data: T
}

export type ErrorResponse<E = string> = {
  success: false
  error: E
}

export type ApiResponse<T = void, E = string> = SuccessResponse<T> | ErrorResponse<E>

export type PaginatedSuccessResponse<T> = SuccessResponse<T> & {
  pagination: {
    page: number
    totalPages: number
    totalItems: number
  }
}

export const Provider = {
  github: "github",
  google: "google",
} as const

export type Provider = (typeof Provider)[keyof typeof Provider]
