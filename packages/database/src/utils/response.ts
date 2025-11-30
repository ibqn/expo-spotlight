import type { ErrorResponse, SuccessResponse } from "../types"

export const response = <T = void>(message: string, value?: T): SuccessResponse<T> => ({
  success: true,
  message,
  data: value as T,
})

export const error = <E = string>(error: E): ErrorResponse<E> => ({
  success: false,
  error,
})
