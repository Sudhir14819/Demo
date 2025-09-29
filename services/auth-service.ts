import jwt from "jsonwebtoken"
import { PERMISSIONS } from "@/config/api-endpoints"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "24h"

export interface TokenPayload {
  uid: string
  email: string
  role: "user" | "admin"
  permissions: string[]
}

export class AuthService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (error) {
      return null
    }
  }

  static getUserPermissions(role: "user" | "admin"): string[] {
    if (role === "admin") {
      return [...Object.values(PERMISSIONS.USER), ...Object.values(PERMISSIONS.ADMIN)]
    }
    return Object.values(PERMISSIONS.USER)
  }

  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission)
  }
}
