export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,

  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
    REFRESH: "/auth/refresh",
  },

  // User management endpoints
  USER: {
    PROFILE: "/user/profile",
    ADDRESSES: "/user/addresses",
    ORDERS: "/user/orders",
    WISHLIST: "/user/wishlist",
  },

  // Product endpoints
  PRODUCTS: {
    LIST: "/products",
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    DETAILS: (id: string) => `/products/${id}`,
  },

  // Order endpoints
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAILS: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACKING: (id: string) => `/orders/${id}/tracking`,
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STATS: "/admin/stats",
    PRODUCTS: {
      BULK_UPLOAD: "/admin/products/bulk-upload",
      MANAGE: "/admin/products",
    },
    ORDERS: "/admin/orders",
    USERS: "/admin/users",
    EMAIL_TEMPLATES: "/admin/email-templates",
  },

  // File upload endpoints
  UPLOAD: {
    IMAGES: "/upload/images",
    DOCUMENTS: "/upload/documents",
  },
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const API_MESSAGES = {
  SUCCESS: "Operation completed successfully",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation failed",
  SERVER_ERROR: "Internal server error",
} as const
