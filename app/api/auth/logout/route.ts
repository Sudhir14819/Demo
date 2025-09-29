import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // In a production app, you might want to maintain a blacklist of invalidated tokens
    // For now, we'll just return success as the client will remove the token

    return NextResponse.json({
      message: "Logout successful",
    })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
