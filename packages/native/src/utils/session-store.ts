import * as SecureStore from "expo-secure-store"
import { sessionCookieName } from "database/src/cookie"
import * as cookie from "cookie"

const SESSION_STORAGE_KEY = "lucia_session_token"

/**
 * Get the stored session token from secure store
 * @returns The session token or null if not found
 */
export const getSessionToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(SESSION_STORAGE_KEY)
    return token
  } catch (error) {
    console.error("Error reading session token from secure store:", error)
    return null
  }
}

/**
 * Store the session token in secure store
 * @param token - The session token to store
 */
export const setSessionToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, token)
  } catch (error) {
    console.error("Error storing session token to secure store:", error)
  }
}

/**
 * Delete the session token from secure store
 */
export const deleteSessionToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
  } catch (error) {
    console.error("Error deleting session token from secure store:", error)
  }
}

/**
 * Extract session token from Set-Cookie header
 * @param setCookieHeader - The Set-Cookie header value(s)
 * @returns The session token or null if not found
 */
export const extractSessionTokenFromHeader = (setCookieHeaderList: string[] | undefined): string | null => {
  if (!setCookieHeaderList || setCookieHeaderList.length === 0) {
    return null
  }

  for (const setCookieHeader of setCookieHeaderList) {
    const setCookieObject = cookie.parseSetCookie(setCookieHeader)
    if (setCookieObject?.name === sessionCookieName) {
      return setCookieObject.value ?? null
    }
  }
  return null
}

/**
 * Format session token as a Cookie header value
 * @param token - The session token
 * @returns Formatted cookie string
 */
export const formatSessionCookie = (token: string): string => {
  return cookie.stringifyCookie({ [sessionCookieName]: token })
}
