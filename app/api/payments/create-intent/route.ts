import { type NextRequest, NextResponse } from "next/server"
import { paymentProcessor } from "@/lib/payment"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "USD" } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await paymentProcessor.createPaymentIntent(amount, currency)

    return NextResponse.json({ paymentIntent })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
