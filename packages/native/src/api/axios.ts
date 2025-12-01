import { env } from "@/utils/env"
import axiosNative from "axios"
import {
  getSessionToken,
  setSessionToken,
  deleteSessionToken,
  extractSessionTokenFromHeader,
  formatSessionCookie,
} from "@/utils/session-store"

const defaultOptions = {
  baseURL: `${env.EXPO_PUBLIC_API_URL}/api`,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
}

const axios = axiosNative.create(defaultOptions)

axios.interceptors.request.use(
  async (config) => {
    const sessionToken = await getSessionToken()
    if (sessionToken) {
      const cookieHeader = formatSessionCookie(sessionToken)
      config.headers["Cookie"] = cookieHeader
    }
    return config
  },
  (error) => {
    console.log("[Axios Request Error]", error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  async (response) => {
    const setCookieHeader = response.headers["set-cookie"]
    const sessionToken = extractSessionTokenFromHeader(setCookieHeader)

    if (sessionToken) {
      await setSessionToken(sessionToken)
    }

    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      await deleteSessionToken()
    }
    return Promise.reject(error)
  }
)

export { axios }
