"use client"

import { useState } from "react"
import { OrderList } from "@/components/order/order-list"
import { OrderTrackingComponent } from "@/components/order/order-tracking"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Order } from "@/types/order"

export default function OrdersPage() {
  const { isAuthenticated, loading } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleBackToList = () => {
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to view your orders.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {selectedOrder ? (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order #{selectedOrder.orderNumber}</h1>
              <p className="text-muted-foreground">Track your order status and details</p>
            </div>
          </div>
          <OrderTrackingComponent order={selectedOrder} />
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
          <OrderList onViewOrder={handleViewOrder} />
        </>
      )}
    </div>
  )
}
