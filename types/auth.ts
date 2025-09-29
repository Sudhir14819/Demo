export interface User {
  id: string
  uid: string
  email: string
  name: string
  role: "user" | "admin"
  profile?: {
    phone?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TokenPayload {
  uid: string
  email: string
  role: "user" | "admin"
  permissions: string[]
  iat?: number
  exp?: number
}

export interface AuthResponse {
  user: User
  token: string
  permissions: string[]
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  permissions: string[]
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
}
