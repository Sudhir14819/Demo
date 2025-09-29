// API Client for Cross-Platform Usage
// This file provides a unified API client that can be used across different platforms

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  category: string
  categoryId: string
  stock: number
  rating: number
  reviewCount: number
  features: string[]
  specifications: Record<string, any>
  gst: number
  hsn: string
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: number
  gst: number
  discount: number
  shippingCharges: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: Address
  estimatedDelivery: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Address {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "customer" | "admin"
  createdAt: string
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "https://your-domain.com/api") {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: "HTTP_ERROR",
            message: `HTTP ${response.status}`,
          },
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error",
        },
      }
    }
  }

  // Authentication
  async register(userData: {
    name: string
    email: string
    password: string
    phone?: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  // Products
  async getProducts(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    sort?: string
  }): Promise<ApiResponse<{ products: Product[]; pagination: any }>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : ""
    return this.request(`/products${queryString ? `?${queryString}` : ""}`)
  }

  async getProduct(productId: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request(`/products/${productId}`)
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResponse<{ product: Product }>> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  // Orders
  async createOrder(orderData: {
    items: { productId: string; quantity: number; price: number }[]
    shippingAddress: Address
    paymentMethod: string
    couponCode?: string
  }): Promise<ApiResponse<{ order: Order; razorpayOrderId: string }>> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(): Promise<ApiResponse<{ orders: Order[] }>> {
    return this.request("/orders")
  }

  async getOrder(orderId: string): Promise<ApiResponse<{ order: Order }>> {
    return this.request(`/orders/${orderId}`)
  }

  // Cart
  async getCart(): Promise<ApiResponse<{ cart: any }>> {
    return this.request("/cart")
  }

  async addToCart(item: {
    productId: string
    quantity: number
  }): Promise<ApiResponse<{ cart: any }>> {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify(item),
    })
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<{ cart: any }>> {
    return this.request(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<{ cart: any }>> {
    return this.request(`/cart/${itemId}`, {
      method: "DELETE",
    })
  }

  // Payments
  async createRazorpayOrder(orderData: {
    orderId: string
    amount: number
    currency?: string
  }): Promise<
    ApiResponse<{
      razorpayOrderId: string
      amount: number
      currency: string
      keyId: string
    }>
  > {
    return this.request("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    orderId: string
  }): Promise<ApiResponse<{ verified: boolean }>> {
    return this.request("/payments/verify", {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  // Admin APIs
  async getDashboardStats(): Promise<
    ApiResponse<{
      stats: {
        totalOrders: number
        totalRevenue: number
        totalCustomers: number
        totalProducts: number
      }
      recentOrders: Order[]
      topProducts: Product[]
    }>
  > {
    return this.request("/admin/dashboard")
  }

  async getAllOrders(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : ""
    return this.request(`/admin/orders${queryString ? `?${queryString}` : ""}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export for different platforms
export default ApiClient
