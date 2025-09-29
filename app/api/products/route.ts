import { type NextRequest, NextResponse } from "next/server"
import { FirebaseAdminService } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const sortBy = (searchParams.get("sortBy") as "name" | "price" | "stock" | "createdAt") || "createdAt"
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    const activeOnly = searchParams.get("activeOnly") === "true"

    const result = await FirebaseAdminService.getProducts({
      page,
      limit,
      category: category || undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
      activeOnly,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "stock"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const productId = await FirebaseAdminService.createProduct({
      ...productData,
      images: productData.images || [],
      rating: 0,
      reviewCount: 0,
      features: productData.features || [],
      specifications: productData.specifications || {},
      gst: productData.gst || 18,
      hsn: productData.hsn || "",
      featured: productData.featured || false,
      active: productData.active !== false,
      createdBy: productData.createdBy || "admin",
      tags: productData.tags || [],
      seo: productData.seo || {
        title: productData.name,
        description: productData.description,
        keywords: [],
      },
    })

    return NextResponse.json({
      productId,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
