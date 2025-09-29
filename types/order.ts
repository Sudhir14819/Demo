import type { Address } from "./location"
import type { Product } from "./product"

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  variety?: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  deliveryAddress: Address
  estimatedDelivery: string
  actualDelivery?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface OrderTracking {
  id: string
  orderId: string
  status: OrderStatus
  message: string
  location?: string
  timestamp: string
  isActive: boolean
}

export interface DeliveryEstimate {
  minDays: number
  maxDays: number
  deliveryFee: number
  available: boolean
  message?: string
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  tax: number
  discount: number
  total: number
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  variety?: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  updatedAt: string
}
