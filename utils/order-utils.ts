import type { OrderSummary, DeliveryEstimate, OrderStatus } from "@/types/order"
import type { CartItem } from "@/types/order"

export class OrderUtils {
  /**
   * Generate order number
   */
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `ORD-${timestamp.slice(-8)}-${random}`
  }

  /**
   * Calculate order summary
   */
  static calculateOrderSummary(items: CartItem[], deliveryFee = 0, discountPercent = 0): OrderSummary {
    const subtotal = items.reduce((sum, item) => {
      const price = item.product.price
      return sum + price * item.quantity
    }, 0)

    const discount = (subtotal * discountPercent) / 100
    const taxableAmount = subtotal - discount
    const tax = taxableAmount * 0.18 // 18% GST
    const total = taxableAmount + tax + deliveryFee

    return {
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
    }
  }

  /**
   * Estimate delivery based on pincode
   */
  static estimateDelivery(pincode: string): DeliveryEstimate {
    // This would typically call a delivery service API
    // For demo purposes, we'll use simple logic based on pincode

    const firstDigit = pincode.charAt(0)
    const metropolitanCities = ["1", "2", "4", "5", "6"] // Delhi, Haryana, Rajasthan, UP, Bihar

    if (metropolitanCities.includes(firstDigit)) {
      return {
        minDays: 2,
        maxDays: 4,
        deliveryFee: 50,
        available: true,
        message: "Express delivery available",
      }
    }

    return {
      minDays: 5,
      maxDays: 8,
      deliveryFee: 80,
      available: true,
      message: "Standard delivery",
    }
  }

  /**
   * Get order status display info
   */
  static getOrderStatusInfo(status: OrderStatus): { label: string; color: string; description: string } {
    const statusMap = {
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        description: "Order is being processed",
      },
      confirmed: {
        label: "Confirmed",
        color: "bg-blue-100 text-blue-800",
        description: "Order has been confirmed",
      },
      processing: {
        label: "Processing",
        color: "bg-purple-100 text-purple-800",
        description: "Order is being prepared",
      },
      packed: {
        label: "Packed",
        color: "bg-indigo-100 text-indigo-800",
        description: "Order has been packed",
      },
      shipped: {
        label: "Shipped",
        color: "bg-cyan-100 text-cyan-800",
        description: "Order is on the way",
      },
      out_for_delivery: {
        label: "Out for Delivery",
        color: "bg-orange-100 text-orange-800",
        description: "Order is out for delivery",
      },
      delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800",
        description: "Order has been delivered",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
        description: "Order has been cancelled",
      },
      returned: {
        label: "Returned",
        color: "bg-gray-100 text-gray-800",
        description: "Order has been returned",
      },
    }

    return statusMap[status]
  }

  /**
   * Check if order can be cancelled
   */
  static canCancelOrder(status: OrderStatus): boolean {
    return ["pending", "confirmed", "processing"].includes(status)
  }

  /**
   * Check if order can be returned
   */
  static canReturnOrder(status: OrderStatus, deliveredDate?: string): boolean {
    if (status !== "delivered" || !deliveredDate) return false

    const delivered = new Date(deliveredDate)
    const now = new Date()
    const daysDiff = (now.getTime() - delivered.getTime()) / (1000 * 3600 * 24)

    return daysDiff <= 7 // 7 days return policy
  }

  /**
   * Format order date
   */
  static formatOrderDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  /**
   * Calculate estimated delivery date
   */
  static calculateEstimatedDelivery(orderDate: string, estimatedDays: number): string {
    const order = new Date(orderDate)
    const estimated = new Date(order.getTime() + estimatedDays * 24 * 60 * 60 * 1000)
    return estimated.toISOString()
  }
}
