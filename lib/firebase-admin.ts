// Firebase Admin Operations for Product Management
// This file handles all Firebase operations for admin functionality

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase-config"

export interface FirebaseProduct {
  id?: string
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
  featured: boolean
  active: boolean
  createdAt: any
  updatedAt: any
  createdBy: string
  tags: string[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface FirebaseOrder {
  id?: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    image: string
  }>
  subtotal: number
  gst: number
  discount: number
  shippingCharges: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  shippingAddress: {
    name: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  trackingNumber?: string
  carrier?: string
  estimatedDelivery: string
  deliveredAt?: any
  createdAt: any
  updatedAt: any
  notes?: string
}

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  lowStockProducts: number
  pendingOrders: number
  monthlyRevenue: number
  monthlyOrders: number
}

// Product Management Functions
export class FirebaseAdminService {
  // Get all products with pagination and filtering
  static async getProducts(
    options: {
      page?: number
      limit?: number
      category?: string
      search?: string
      sortBy?: "name" | "price" | "stock" | "createdAt"
      sortOrder?: "asc" | "desc"
      activeOnly?: boolean
    } = {},
  ) {
    try {
      const {
        page = 1,
        limit: pageLimit = 20,
        category,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
        activeOnly = false,
      } = options

      let q = query(collection(db, "products"))

      // Add filters
      if (activeOnly) {
        q = query(q, where("active", "==", true))
      }

      if (category) {
        q = query(q, where("category", "==", category))
      }

      // Add sorting
      q = query(q, orderBy(sortBy, sortOrder))

      // Add pagination
      if (page > 1) {
        const offset = (page - 1) * pageLimit
        q = query(q, limit(offset + pageLimit))
      } else {
        q = query(q, limit(pageLimit))
      }

      const snapshot = await getDocs(q)
      let products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseProduct[]

      // Client-side search filtering (for simplicity)
      if (search) {
        const searchLower = search.toLowerCase()
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
      }

      // Apply pagination after filtering
      const startIndex = (page - 1) * pageLimit
      const paginatedProducts = products.slice(startIndex, startIndex + pageLimit)

      return {
        products: paginatedProducts,
        total: products.length,
        page,
        totalPages: Math.ceil(products.length / pageLimit),
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  // Get single product
  static async getProduct(productId: string): Promise<FirebaseProduct | null> {
    try {
      const docRef = doc(db, "products", productId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseProduct
      }
      return null
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  // Create new product
  static async createProduct(productData: Omit<FirebaseProduct, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  }

  // Update product
  static async updateProduct(productId: string, updates: Partial<FirebaseProduct>): Promise<void> {
    try {
      const docRef = doc(db, "products", productId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  }

  // Delete product
  static async deleteProduct(productId: string): Promise<void> {
    try {
      // Delete product images from storage
      const product = await this.getProduct(productId)
      if (product?.images) {
        await Promise.all(product.images.map((imageUrl) => this.deleteImage(imageUrl)))
      }

      // Delete product document
      const docRef = doc(db, "products", productId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  }

  // Upload product image
  static async uploadProductImage(file: File, productId: string): Promise<string> {
    try {
      const timestamp = Date.now()
      const fileName = `${productId}_${timestamp}_${file.name}`
      const storageRef = ref(storage, `products/${fileName}`)

      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      return downloadURL
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  // Delete image from storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (error) {
      console.error("Error deleting image:", error)
      // Don't throw error for image deletion failures
    }
  }

  // Order Management Functions
  static async getOrders(
    options: {
      page?: number
      limit?: number
      status?: string
      userId?: string
      sortBy?: "createdAt" | "total" | "status"
      sortOrder?: "asc" | "desc"
    } = {},
  ) {
    try {
      const { page = 1, limit: pageLimit = 20, status, userId, sortBy = "createdAt", sortOrder = "desc" } = options

      let q = query(collection(db, "orders"))

      // Add filters
      if (status) {
        q = query(q, where("status", "==", status))
      }

      if (userId) {
        q = query(q, where("userId", "==", userId))
      }

      // Add sorting
      q = query(q, orderBy(sortBy, sortOrder))

      // Add pagination
      q = query(q, limit(pageLimit))

      const snapshot = await getDocs(q)
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseOrder[]

      return {
        orders,
        total: orders.length,
        page,
        totalPages: Math.ceil(orders.length / pageLimit),
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: FirebaseOrder["status"],
    trackingInfo?: { trackingNumber: string; carrier: string },
  ): Promise<void> {
    try {
      const updates: any = {
        status,
        updatedAt: serverTimestamp(),
      }

      if (trackingInfo) {
        updates.trackingNumber = trackingInfo.trackingNumber
        updates.carrier = trackingInfo.carrier
      }

      if (status === "delivered") {
        updates.deliveredAt = serverTimestamp()
      }

      const docRef = doc(db, "orders", orderId)
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error("Error updating order status:", error)
      throw error
    }
  }

  // Get admin dashboard stats
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      // Get all orders
      const ordersSnapshot = await getDocs(collection(db, "orders"))
      const orders = ordersSnapshot.docs.map((doc) => doc.data()) as FirebaseOrder[]

      // Get all products
      const productsSnapshot = await getDocs(collection(db, "products"))
      const products = productsSnapshot.docs.map((doc) => doc.data()) as FirebaseProduct[]

      // Get all users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const totalCustomers = usersSnapshot.size

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const totalOrders = orders.length
      const totalProducts = products.length
      const lowStockProducts = products.filter((p) => p.stock < 10).length
      const pendingOrders = orders.filter((o) => o.status === "pending").length

      // Calculate monthly stats
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyOrders = orders.filter((order) => {
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0)

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockProducts,
        pendingOrders,
        monthlyRevenue,
        monthlyOrders: monthlyOrders.length,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      throw error
    }
  }

  // Real-time listeners
  static subscribeToProducts(callback: (products: FirebaseProduct[]) => void) {
    const q = query(collection(db, "products"), orderBy("updatedAt", "desc"))

    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseProduct[]
      callback(products)
    })
  }

  static subscribeToOrders(callback: (orders: FirebaseOrder[]) => void) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(50))

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseOrder[]
      callback(orders)
    })
  }

  // Bulk operations
  static async bulkUpdateProducts(productIds: string[], updates: Partial<FirebaseProduct>): Promise<void> {
    try {
      const batch = db.batch ? db.batch() : null
      if (!batch) throw new Error("Batch operations not supported")

      productIds.forEach((productId) => {
        const docRef = doc(db, "products", productId)
        batch.update(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
    } catch (error) {
      console.error("Error bulk updating products:", error)
      throw error
    }
  }

  // Update product stock
  static async updateProductStock(
    productId: string,
    quantity: number,
    operation: "increment" | "decrement" | "set",
  ): Promise<void> {
    try {
      const docRef = doc(db, "products", productId)

      let stockUpdate
      if (operation === "set") {
        stockUpdate = quantity
      } else if (operation === "increment") {
        stockUpdate = increment(quantity)
      } else {
        stockUpdate = increment(-quantity)
      }

      await updateDoc(docRef, {
        stock: stockUpdate,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating product stock:", error)
      throw error
    }
  }
}
