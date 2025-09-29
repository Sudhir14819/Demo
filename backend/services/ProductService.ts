import { db } from "../config/firebase"
import type { Product, CreateProductData } from "../models/Product"

export class ProductService {
  private collection = db.collection("products")

  async createProduct(data: CreateProductData): Promise<Product> {
    const now = new Date()
    const productData = {
      ...data,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await this.collection.add(productData)
    return { id: docRef.id, ...productData } as Product
  }

  async getProducts(filters?: {
    category?: string
    isActive?: boolean
    isFeatured?: boolean
    limit?: number
  }): Promise<Product[]> {
    let query = this.collection.orderBy("createdAt", "desc")

    if (filters?.category) {
      query = query.where("category", "==", filters.category) as any
    }
    if (filters?.isActive !== undefined) {
      query = query.where("isActive", "==", filters.isActive) as any
    }
    if (filters?.isFeatured !== undefined) {
      query = query.where("isFeatured", "==", filters.isFeatured) as any
    }
    if (filters?.limit) {
      query = query.limit(filters.limit) as any
    }

    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
  }

  async getProductById(id: string): Promise<Product | null> {
    const doc = await this.collection.doc(id).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() } as Product
  }

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    await this.collection.doc(id).delete()
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const productRef = this.collection.doc(id)
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(productRef)
      if (!doc.exists) throw new Error("Product not found")

      const currentStock = doc.data()?.stock || 0
      const newStock = currentStock - quantity

      if (newStock < 0) throw new Error("Insufficient stock")

      transaction.update(productRef, { stock: newStock, updatedAt: new Date() })
    })
  }
}
