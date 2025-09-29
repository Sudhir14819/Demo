"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  permissions: string[]
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user")
    const savedToken = sessionStorage.getItem("token")
    const savedPermissions = sessionStorage.getItem("permissions")

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
      setPermissions(savedPermissions ? JSON.parse(savedPermissions) : [])
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const { user, token, permissions } = await response.json()
        setUser(user)
        setToken(token)
        setPermissions(permissions || [])

        sessionStorage.setItem("user", JSON.stringify(user))
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("permissions", JSON.stringify(permissions || []))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (response.ok) {
        const { user, token, permissions } = await response.json()
        setUser(user)
        setToken(token)
        setPermissions(permissions || [])

        sessionStorage.setItem("user", JSON.stringify(user))
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("permissions", JSON.stringify(permissions || []))
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setPermissions([])
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("permissions")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>, requiredPermissions?: string[]) {
  return function AuthenticatedComponent(props: P) {
    const { user, token, permissions, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user || !token) {
          router.push("/login")
          return
        }

        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission))

          if (!hasPermission) {
            router.push("/unauthorized")
            return
          }
        }
      }
    }, [user, token, permissions, loading, router])

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user || !token) {
      return null
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission))

      if (!hasPermission) {
        return null
      }
    }

    return <WrappedComponent {...props} />
  }
}
