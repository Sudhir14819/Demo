"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Truck, MapPin } from "lucide-react"
import { AddressList } from "@/components/location/address-list"
import { OrderSummary } from "@/components/order/order-summary"
import { OrderUtils } from "@/utils/order-utils"
import { useAuth } from "@/lib/auth"
import type { Address } from "@/types/location"
import type { CartItem, OrderSummary as OrderSummaryType } from "@/types/order"

interface CheckoutFormProps {
  cartItems: CartItem[]
  onOrderComplete: (orderId: string) => void
}

export function CheckoutForm({ cartItems, onOrderComplete }: CheckoutFormProps) {
  const { user, token } = useAuth()
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate delivery fee based on selected address
  const deliveryEstimate = selectedAddress
    ? OrderUtils.estimateDelivery(selectedAddress.pincode)
    : { deliveryFee: 0, available: true }

  const orderSummary: OrderSummaryType = OrderUtils.calculateOrderSummary(cartItems, deliveryEstimate.deliveryFee)

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address")
      return
    }

    if (!user) {
      setError("Please log in to place an order")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orderData = {
        userId: user.uid,
        items: cartItems.map((item) => ({
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          variety: item.variety,
        })),
        subtotal: orderSummary.subtotal,
        deliveryFee: orderSummary.deliveryFee,
        tax: orderSummary.tax,
        discount: orderSummary.discount,
        total: orderSummary.total,
        deliveryAddress: selectedAddress,
        paymentMethod,
        estimatedDelivery: OrderUtils.calculateEstimatedDelivery(
          new Date().toISOString(),
          deliveryEstimate.available ? 5 : 7,
        ),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        onOrderComplete(result.orderId)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to place order")
      }
    } catch (error: any) {
      console.error("Place order error:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressList
              onAddNew={() => {}} // You could implement add new address in modal
              onEdit={() => {}} // You could implement edit address in modal
              onSelect={setSelectedAddress}
              selectedAddressId={selectedAddress?.id}
              showSelection={true}
            />
          </CardContent>
        </Card>

        {/* Delivery Options */}
        {selectedAddress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {deliveryEstimate.available ? "Standard Delivery" : "Not Available"}
                  </span>
                  <span className="font-semibold">
                    {deliveryEstimate.deliveryFee > 0 ? `₹${deliveryEstimate.deliveryFee}` : "Free"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Estimated delivery in 5-7 business days</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online Payment (UPI/Card)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <OrderSummary summary={orderSummary} />

        <Button onClick={handlePlaceOrder} disabled={loading || !selectedAddress} className="w-full" size="lg">
          {loading ? "Placing Order..." : `Place Order - ₹${orderSummary.total.toFixed(2)}`}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          By placing your order, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
