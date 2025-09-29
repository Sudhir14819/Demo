// Payment processing utilities
// In a real app, this would integrate with Stripe, Razorpay, or similar payment processors

export interface PaymentMethod {
  id: string
  type: "card" | "upi" | "netbanking" | "wallet"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "failed"
  clientSecret?: string
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
}

// Mock payment processor (replace with real payment gateway)
class MockPaymentProcessor {
  async createPaymentIntent(amount: number, currency = "USD"): Promise<PaymentIntent> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `pi_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: "requires_payment_method",
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success/failure (90% success rate)
    const success = Math.random() > 0.1

    if (success) {
      return {
        success: true,
        paymentIntent: {
          id: paymentIntentId,
          amount: 0, // Would be filled from actual payment intent
          currency: "USD",
          status: "succeeded",
        },
      }
    } else {
      return {
        success: false,
        error: "Your card was declined. Please try a different payment method.",
      }
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      paymentIntent: {
        id: paymentIntentId,
        amount: amount || 0,
        currency: "USD",
        status: "succeeded",
      },
    }
  }
}

export const paymentProcessor = new MockPaymentProcessor()

// Utility functions for payment formatting
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function validateCardNumber(cardNumber: string): boolean {
  // Basic Luhn algorithm validation
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function validateExpiryDate(month: number, year: number): boolean {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  if (month < 1 || month > 12) return false

  return true
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

export function getCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "")

  if (/^4/.test(digits)) return "visa"
  if (/^5[1-5]/.test(digits)) return "mastercard"
  if (/^3[47]/.test(digits)) return "amex"
  if (/^6/.test(digits)) return "discover"

  return "unknown"
}
