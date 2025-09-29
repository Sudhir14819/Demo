import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { withAuth } from "@/middleware/auth-middleware"

export const GET = withAuth(
  async (request: NextRequest & { user: any }, { params }: { params: { orderId: string } }) => {
    try {
      const { orderId } = params

      // Get tracking history
      const trackingRef = collection(db, "order_tracking")
      const q = query(trackingRef, where("orderId", "==", orderId), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)

      const tracking = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return NextResponse.json({ tracking })
    } catch (error: any) {
      console.error("Get tracking error:", error)
      return NextResponse.json({ error: "Failed to fetch tracking information" }, { status: 500 })
    }
  },
)
