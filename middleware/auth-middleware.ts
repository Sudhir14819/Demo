import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/services/auth-service"

export function withAuth(handler: (request: NextRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any) => {
    try {
      const authHeader = request.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const payload = AuthService.verifyToken(token)

      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Add user info to request context
      const requestWithAuth = request as NextRequest & { user: typeof payload }
      requestWithAuth.user = payload

      return handler(requestWithAuth, context)
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function requirePermission(permission: string) {
  return (handler: (request: NextRequest, context: any) => Promise<NextResponse>) => {
    return withAuth(async (request: NextRequest & { user: any }, context: any) => {
      if (!AuthService.hasPermission(request.user.permissions, permission)) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      return handler(request, context)
    })
  }
}
