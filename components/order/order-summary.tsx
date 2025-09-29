"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { OrderSummary as OrderSummaryType } from "@/types/order"

interface OrderSummaryProps {
  summary: OrderSummaryType
  showTitle?: boolean
}

export function OrderSummary({ summary, showTitle = true }: OrderSummaryProps) {
  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? "" : "p-6"}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{summary.subtotal.toFixed(2)}</span>
          </div>

          {summary.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{summary.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{summary.deliveryFee > 0 ? `₹${summary.deliveryFee.toFixed(2)}` : "Free"}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (GST 18%)</span>
            <span>₹{summary.tax.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{summary.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
