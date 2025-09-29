import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { withAuth } from "@/middleware/auth-middleware"
import { OrderUtils } from "@/utils/order-utils"

export const PATCH = withAuth(
  async (request: NextRequest & { user: any }, { params }: { params: { orderId: string } }) => {
    try {
      const { orderId } = params
      const docRef = doc(db, "orders", orderId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const orderData = docSnap.data()

      // Check if user owns this order
      if (orderData.userId !== request.user.uid) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }

      // Check if order can be cancelled
      if (!OrderUtils.canCancelOrder(orderData.status)) {
        return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 })
      }

      await updateDoc(docRef, {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      })

      return NextResponse.json({ message: "Order cancelled successfully" })
    } catch (error: any) {
      console.error("Cancel order error:", error)
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
    }
  },
)
