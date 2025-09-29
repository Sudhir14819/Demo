import { type NextRequest, NextResponse } from "next/server"
import { FirebaseAdminService } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const stats = await FirebaseAdminService.getDashboardStats()

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
