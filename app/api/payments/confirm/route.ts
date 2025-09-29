import { type NextRequest, NextResponse } from "next/server"
import { paymentProcessor } from "@/lib/payment"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, paymentMethod } = await request.json()

    if (!paymentIntentId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await paymentProcessor.confirmPayment(paymentIntentId, paymentMethod)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
