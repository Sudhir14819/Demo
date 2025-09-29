"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Eye, RotateCcw, X } from "lucide-react"
import { OrderUtils } from "@/utils/order-utils"
import { useAuth } from "@/lib/auth"
import type { Order } from "@/types/order"

interface OrderListProps {
  onViewOrder: (order: Order) => void
}

export function OrderList({ onViewOrder }: OrderListProps) {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      console.error("Fetch orders error:", error)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)))
      } else {
        alert("Failed to cancel order")
      }
    } catch (error) {
      console.error("Cancel order error:", error)
      alert("Failed to cancel order")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Your orders will appear here once you make a purchase</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusInfo = OrderUtils.getOrderStatusInfo(order.status)
        const canCancel = OrderUtils.canCancelOrder(order.status)
        const canReturn = OrderUtils.canReturnOrder(order.status, order.actualDelivery)

        return (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">{OrderUtils.formatOrderDate(order.createdAt)}</p>
                </div>
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold">₹{order.total.toFixed(2)}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>Delivery to: {order.deliveryAddress.name}</div>
                  <div>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}
                  </div>
                </div>

                {order.estimatedDelivery && order.status !== "delivered" && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Expected by: </span>
                    <span className="font-medium">{OrderUtils.formatOrderDate(order.estimatedDelivery)}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {canCancel && (
                    <Button variant="outline" size="sm" onClick={() => handleCancelOrder(order.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}

                  {canReturn && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Return
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
