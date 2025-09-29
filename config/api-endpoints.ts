export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VERIFY: "/api/auth/verify",
  },

  // Products
  PRODUCTS: {
    LIST: "/api/products",
    CREATE: "/api/products",
    GET: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    SEARCH: "/api/products/search",
  },

  // Orders
  ORDERS: {
    LIST: "/api/orders",
    CREATE: "/api/orders",
    GET: (id: string) => `/api/orders/${id}`,
    UPDATE: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
  },

  // Cart
  CART: {
    GET: "/api/cart",
    ADD: "/api/cart/add",
    UPDATE: "/api/cart/update",
    REMOVE: "/api/cart/remove",
    CLEAR: "/api/cart/clear",
  },

  // Admin
  ADMIN: {
    DASHBOARD: "/api/admin/dashboard",
    USERS: "/api/admin/users",
    PRODUCTS: "/api/admin/products",
    ORDERS: "/api/admin/orders",
    ANALYTICS: "/api/admin/analytics",
  },
} as const

export const PERMISSIONS = {
  // User permissions
  USER: {
    VIEW_PRODUCTS: "user:view_products",
    CREATE_ORDER: "user:create_order",
    VIEW_OWN_ORDERS: "user:view_own_orders",
    MANAGE_CART: "user:manage_cart",
  },

  // Admin permissions
  ADMIN: {
    MANAGE_PRODUCTS: "admin:manage_products",
    MANAGE_ORDERS: "admin:manage_orders",
    MANAGE_USERS: "admin:manage_users",
    VIEW_ANALYTICS: "admin:view_analytics",
    MANAGE_INVENTORY: "admin:manage_inventory",
  },
} as const
