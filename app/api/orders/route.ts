import { type NextRequest, NextResponse } from "next/server"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { FirebaseAdminService } from "@/lib/firebase-admin"
import { withAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { userId, items, total, shippingAddress, paymentMethod = "cod" } = await request.json()

    if (!userId || !items || !total || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate GST and other charges
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const gst = Math.round(subtotal * 0.18) // 18% GST
    const shippingCharges = subtotal >= 499 ? 0 : 50 // Free shipping above ₹499

    const orderData = {
      orderNumber,
      userId,
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email || "",
      customerPhone: shippingAddress.phone,
      items: items.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      subtotal,
      gst,
      discount: 0,
      shippingCharges,
      total: subtotal + gst + shippingCharges,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      paymentMethod,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || "India",
      },
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "orders"), orderData)

    // Update product stock
    for (const item of items) {
      await FirebaseAdminService.updateProductStock(item.id, item.quantity, "decrement")
    }

    return NextResponse.json({
      orderId: docRef.id,
      orderNumber,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export const GET = withAuth(async (request: NextRequest & { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const result = await FirebaseAdminService.getOrders({
      userId: request.user.uid, // Only get orders for the authenticated user
      status: status || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
})
