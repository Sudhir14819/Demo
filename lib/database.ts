// Database connection and query utilities
// This would typically use a real database connection like PostgreSQL with node-postgres
// For this demo, we'll simulate database operations with local storage and mock data

export interface DatabaseUser {
  id: number
  email: string
  name: string
  password_hash: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface DatabaseProduct {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  stock: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface DatabaseOrder {
  id: number
  user_id: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: any
  created_at: string
  updated_at: string
}

export interface DatabaseOrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
}

// Mock database operations (in a real app, these would be actual SQL queries)
class MockDatabase {
  private users: DatabaseUser[] = [
    {
      id: 1,
      email: "admin@store.com",
      name: "Admin User",
      password_hash: "admin123", // In real app, this would be properly hashed
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      email: "user@store.com",
      name: "Regular User",
      password_hash: "user123", // In real app, this would be properly hashed
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  private products: DatabaseProduct[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
      price: 299.99,
      image_url: "/wireless-headphones.png",
      category_id: 1,
      stock: 25,
      rating: 4.5,
      review_count: 128,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Advanced fitness tracking smartwatch with heart rate monitor.",
      price: 199.99,
      image_url: "/smartwatch-lifestyle.png",
      category_id: 1,
      stock: 15,
      rating: 4.3,
      review_count: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Running Shoes",
      description: "Lightweight running shoes with advanced cushioning technology.",
      price: 129.99,
      image_url: "/running-shoes-on-track.png",
      category_id: 2,
      stock: 30,
      rating: 4.7,
      review_count: 203,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Coffee Maker",
      description: "Programmable coffee maker with built-in grinder and thermal carafe.",
      price: 149.99,
      image_url: "/modern-coffee-maker.png",
      category_id: 3,
      stock: 12,
      rating: 4.4,
      review_count: 67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Laptop Backpack",
      description: "Water-resistant laptop backpack with multiple compartments.",
      price: 79.99,
      image_url: "/laptop-backpack.png",
      category_id: 4,
      stock: 40,
      rating: 4.6,
      review_count: 156,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
      price: 89.99,
      image_url: "/bluetooth-speaker.png",
      category_id: 1,
      stock: 22,
      rating: 4.2,
      review_count: 94,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  private orders: DatabaseOrder[] = [
    {
      id: 1,
      user_id: 2,
      total: 429.98,
      status: "processing",
      shipping_address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      user_id: 2,
      total: 399.98,
      status: "shipped",
      shipping_address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      created_at: "2024-01-14T15:45:00Z",
      updated_at: "2024-01-14T15:45:00Z",
    },
  ]

  private orderItems: DatabaseOrderItem[] = [
    { id: 1, order_id: 1, product_id: 1, quantity: 1, price: 299.99, created_at: "2024-01-15T10:30:00Z" },
    { id: 2, order_id: 1, product_id: 3, quantity: 1, price: 129.99, created_at: "2024-01-15T10:30:00Z" },
    { id: 3, order_id: 2, product_id: 2, quantity: 2, price: 199.99, created_at: "2024-01-14T15:45:00Z" },
  ]

  // User operations
  async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async createUser(userData: Omit<DatabaseUser, "id" | "created_at" | "updated_at">): Promise<DatabaseUser> {
    const newUser: DatabaseUser = {
      ...userData,
      id: this.users.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  // Product operations
  async getAllProducts(): Promise<DatabaseProduct[]> {
    return this.products
  }

  async getProductById(id: number): Promise<DatabaseProduct | null> {
    return this.products.find((product) => product.id === id) || null
  }

  async updateProductStock(id: number, stock: number): Promise<void> {
    const product = this.products.find((p) => p.id === id)
    if (product) {
      product.stock = stock
      product.updated_at = new Date().toISOString()
    }
  }

  // Order operations
  async createOrder(orderData: Omit<DatabaseOrder, "id" | "created_at" | "updated_at">): Promise<DatabaseOrder> {
    const newOrder: DatabaseOrder = {
      ...orderData,
      id: this.orders.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.orders.push(newOrder)
    return newOrder
  }

  async createOrderItems(items: Omit<DatabaseOrderItem, "id" | "created_at">[]): Promise<void> {
    items.forEach((item) => {
      const newItem: DatabaseOrderItem = {
        ...item,
        id: this.orderItems.length + 1,
        created_at: new Date().toISOString(),
      }
      this.orderItems.push(newItem)
    })
  }

  async getOrdersByUserId(userId: number): Promise<DatabaseOrder[]> {
    return this.orders.filter((order) => order.user_id === userId)
  }

  async getAllOrders(): Promise<DatabaseOrder[]> {
    return this.orders
  }

  async updateOrderStatus(id: number, status: DatabaseOrder["status"]): Promise<void> {
    const order = this.orders.find((o) => o.id === id)
    if (order) {
      order.status = status
      order.updated_at = new Date().toISOString()
    }
  }
}

// Export singleton instance
export const db = new MockDatabase()

// API route helpers
export async function authenticateUser(email: string, password: string): Promise<DatabaseUser | null> {
  const user = await db.findUserByEmail(email)
  if (user && user.password_hash === password) {
    // In real app, use proper password hashing
    return user
  }
  return null
}

export async function registerUser(email: string, password: string, name: string): Promise<DatabaseUser> {
  return await db.createUser({
    email,
    name,
    password_hash: password, // In real app, hash the password
    role: "user",
  })
}
