import type { TokenPayload } from "@/types/auth"

export class TokenUtils {
  private static readonly TOKEN_KEY = "token"
  private static readonly USER_KEY = "user"
  private static readonly PERMISSIONS_KEY = "permissions"

  /**
   * Store authentication data in session storage
   */
  static storeAuthData(token: string, user: any, permissions: string[]) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.TOKEN_KEY, token)
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user))
      sessionStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions))
    }
  }

  /**
   * Retrieve authentication data from session storage
   */
  static getAuthData() {
    if (typeof window === "undefined") {
      return { token: null, user: null, permissions: [] }
    }

    const token = sessionStorage.getItem(this.TOKEN_KEY)
    const userStr = sessionStorage.getItem(this.USER_KEY)
    const permissionsStr = sessionStorage.getItem(this.PERMISSIONS_KEY)

    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
      permissions: permissionsStr ? JSON.parse(permissionsStr) : [],
    }
  }

  /**
   * Clear all authentication data from session storage
   */
  static clearAuthData() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.TOKEN_KEY)
      sessionStorage.removeItem(this.USER_KEY)
      sessionStorage.removeItem(this.PERMISSIONS_KEY)
    }
  }

  /**
   * Check if token is expired (client-side check)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp ? payload.exp < currentTime : false
    } catch (error) {
      return true
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload
      return payload.exp ? new Date(payload.exp * 1000) : null
    } catch (error) {
      return null
    }
  }

  /**
   * Get time until token expires (in minutes)
   */
  static getTimeUntilExpiration(token: string): number | null {
    const expiration = this.getTokenExpiration(token)
    if (!expiration) return null

    const now = new Date()
    const diffMs = expiration.getTime() - now.getTime()
    return Math.floor(diffMs / (1000 * 60)) // Convert to minutes
  }

  /**
   * Format token for display (truncated)
   */
  static formatTokenForDisplay(token: string, length = 20): string {
    if (token.length <= length * 2) return token
    return `${token.substring(0, length)}...${token.substring(token.length - length)}`
  }

  /**
   * Validate token format (basic JWT structure check)
   */
  static isValidTokenFormat(token: string): boolean {
    const parts = token.split(".")
    return parts.length === 3 && parts.every((part) => part.length > 0)
  }
}
