export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  lowStockProducts: number
  pendingOrders: number
  monthlyRevenue: number
  monthlyOrders: number
  revenueGrowth: number
  orderGrowth: number
}

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  image: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "order_confirmation" | "order_shipped" | "order_delivered" | "welcome" | "custom"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailNotification {
  id: string
  to: string
  subject: string
  content: string
  status: "pending" | "sent" | "failed"
  templateId?: string
  orderId?: string
  userId?: string
  sentAt?: string
  error?: string
  createdAt: string
}
