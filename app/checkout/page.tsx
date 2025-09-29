"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import type { CartItem } from "@/types/order"

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { items, clearCart } = useCart()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }

    // Convert cart items to order format
    const orderItems: CartItem[] = items.map((item) => ({
      id: `cart_${item.id}`,
      productId: item.id,
      product: {
        id: item.id,
        name: item.name,
        price: item.price,
        currency: "₹",
        category: item.category,
        description: item.description,
        imagePath: item.image || "",
        rating: 4.5,
        discount: 0,
        benefits: [],
      },
      quantity: item.quantity,
    }))

    setCartItems(orderItems)
  }, [items, isAuthenticated, authLoading, router])

  const handleOrderComplete = (orderId: string) => {
    clearCart()
    router.push(`/orders/${orderId}?success=true`)
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (cartItems.length === 0) {
    return null // Will redirect to cart
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Review your order and complete your purchase</p>
      </div>

      <CheckoutForm cartItems={cartItems} onOrderComplete={handleOrderComplete} />
    </div>
  )
}
