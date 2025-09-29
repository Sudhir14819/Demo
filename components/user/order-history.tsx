import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Eye, Download, RefreshCw } from "lucide-react"

export function OrderHistory() {
  // Mock order data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 299.99,
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 199.99 },
        { name: "Phone Case", quantity: 2, price: 50.0 },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 159.99,
      items: [{ name: "Smart Watch", quantity: 1, price: 159.99 }],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 89.99,
      items: [{ name: "Coffee Maker", quantity: 1, price: 89.99 }],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="default">Delivered</Badge>
      case "shipped":
        return <Badge variant="secondary">Shipped</Badge>
      case "processing":
        return <Badge variant="outline">Processing</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Order {order.id}</h3>
                  <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(order.status)}
                  <span className="font-semibold">${order.total}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                </div>
                {order.status === "delivered" && (
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
