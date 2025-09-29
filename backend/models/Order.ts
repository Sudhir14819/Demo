import type { Address } from "./Address" // Assuming Address is defined in another file

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  taxAmount: number
  shippingAmount: number
  finalAmount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentId?: string
  shippingAddress: Address
  billingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}
