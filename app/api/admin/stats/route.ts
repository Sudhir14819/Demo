import { type NextRequest, NextResponse } from "next/server"
import { FirebaseAdminService } from "@/lib/firebase-admin"
import { requirePermission } from "@/middleware/auth-middleware"
import { PERMISSIONS } from "@/config/api-endpoints"

export const GET = requirePermission(PERMISSIONS.ADMIN.VIEW_ANALYTICS)(async (request: NextRequest & { user: any }) => {
  try {
    const stats = await FirebaseAdminService.getDashboardStats()

    // Calculate growth percentages (mock data for demo)
    const revenueGrowth = Math.floor(Math.random() * 20) + 5 // 5-25% growth
    const orderGrowth = Math.floor(Math.random() * 15) + 3 // 3-18% growth

    return NextResponse.json({
      stats: {
        ...stats,
        revenueGrowth,
        orderGrowth,
      },
    })
  } catch (error: any) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
})
