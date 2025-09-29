import { db } from "../config/firebase"
import type { Order } from "../models/Order"
import { ProductService } from "./ProductService"

export class OrderService {
  private collection = db.collection("orders")
  private productService = new ProductService()

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const now = new Date()
    const order = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    }

    // Update stock for each item
    for (const item of orderData.items) {
      await this.productService.updateStock(item.productId, item.quantity)
    }

    const docRef = await this.collection.add(order)
    return { id: docRef.id, ...order } as Order
  }

  async getOrders(userId?: string): Promise<Order[]> {
    let query = this.collection.orderBy("createdAt", "desc")

    if (userId) {
      query = query.where("userId", "==", userId) as any
    }

    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
  }

  async getOrderById(id: string): Promise<Order | null> {
    const doc = await this.collection.doc(id).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() } as Order
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
    await this.collection.doc(id).update({
      status,
      updatedAt: new Date(),
    })
  }

  async updatePaymentStatus(id: string, paymentStatus: Order["paymentStatus"], paymentId?: string): Promise<void> {
    const updateData: any = {
      paymentStatus,
      updatedAt: new Date(),
    }

    if (paymentId) {
      updateData.paymentId = paymentId
    }

    await this.collection.doc(id).update(updateData)
  }
}
