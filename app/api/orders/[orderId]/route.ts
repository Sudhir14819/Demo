import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { withAuth } from "@/middleware/auth-middleware"

export const GET = withAuth(
  async (request: NextRequest & { user: any }, { params }: { params: { orderId: string } }) => {
    try {
      const { orderId } = params
      const docRef = doc(db, "orders", orderId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const orderData = docSnap.data()

      // Check if user owns this order or is admin
      if (orderData.userId !== request.user.uid && !request.user.permissions.includes("admin:manage_orders")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }

      return NextResponse.json({
        order: { id: docSnap.id, ...orderData },
      })
    } catch (error: any) {
      console.error("Get order error:", error)
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
  },
)

export const PATCH = withAuth(
  async (request: NextRequest & { user: any }, { params }: { params: { orderId: string } }) => {
    try {
      const { orderId } = params
      const updates = await request.json()

      const docRef = doc(db, "orders", orderId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const orderData = docSnap.data()

      // Check if user owns this order or is admin
      if (orderData.userId !== request.user.uid && !request.user.permissions.includes("admin:manage_orders")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      return NextResponse.json({ message: "Order updated successfully" })
    } catch (error: any) {
      console.error("Update order error:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
  },
)
