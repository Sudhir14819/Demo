"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Truck, Package, MapPin } from "lucide-react"
import { OrderUtils } from "@/utils/order-utils"
import type { Order, OrderTracking, OrderStatus } from "@/types/order"

interface OrderTrackingProps {
  order: Order
}

export function OrderTrackingComponent({ order }: OrderTrackingProps) {
  const [trackingHistory, setTrackingHistory] = useState<OrderTracking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrackingHistory()
  }, [order.id])

  const fetchTrackingHistory = async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}/tracking`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTrackingHistory(data.tracking || [])
      }
    } catch (error) {
      console.error("Fetch tracking error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: OrderStatus, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    switch (status) {
      case "shipped":
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "packed":
        return <Package className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <MapPin className="h-5 w-5 text-green-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const statusInfo = OrderUtils.getOrderStatusInfo(order.status)

  const trackingSteps: { status: OrderStatus; label: string }[] = [
    { status: "confirmed", label: "Order Confirmed" },
    { status: "processing", label: "Processing" },
    { status: "packed", label: "Packed" },
    { status: "shipped", label: "Shipped" },
    { status: "out_for_delivery", label: "Out for Delivery" },
    { status: "delivered", label: "Delivered" },
  ]

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex((step) => step.status === order.status)
  }

  const currentStepIndex = getCurrentStepIndex()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Tracking</span>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Status */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-1">{statusInfo.label}</h3>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
            {order.trackingNumber && (
              <p className="text-xs text-muted-foreground mt-2">Tracking: {order.trackingNumber}</p>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isUpcoming = index > currentStepIndex

              return (
                <div key={step.status} className="flex items-center gap-3">
                  <div className="flex-shrink-0">{getStatusIcon(step.status, isCompleted)}</div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </div>
                    {isCurrent && (
                      <div className="text-sm text-muted-foreground">
                        {step.status === "delivered" && order.actualDelivery
                          ? `Delivered on ${OrderUtils.formatOrderDate(order.actualDelivery)}`
                          : step.status === "shipped" && order.estimatedDelivery
                            ? `Expected by ${OrderUtils.formatOrderDate(order.estimatedDelivery)}`
                            : "In progress"}
                      </div>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="text-xs text-muted-foreground">
                      {/* You could show timestamps here from trackingHistory */}✓
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tracking History */}
          {trackingHistory.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Tracking History</h4>
              <div className="space-y-2">
                {trackingHistory.map((tracking) => (
                  <div key={tracking.id} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-medium">{tracking.message}</div>
                      {tracking.location && <div className="text-muted-foreground">{tracking.location}</div>}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {OrderUtils.formatOrderDate(tracking.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== "delivered" && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Estimated Delivery</div>
              <div className="text-sm text-blue-700">{OrderUtils.formatOrderDate(order.estimatedDelivery)}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
