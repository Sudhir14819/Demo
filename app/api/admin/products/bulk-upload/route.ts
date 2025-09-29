import { type NextRequest, NextResponse } from "next/server"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { requirePermission } from "@/middleware/auth-middleware"
import { PERMISSIONS } from "@/config/api-endpoints"
import { ProductUtils } from "@/utils/product-utils"
import type { Product, BulkUploadResult } from "@/types/product"

export const POST = requirePermission(PERMISSIONS.ADMIN.MANAGE_PRODUCTS)(
  async (request: NextRequest & { user: any }) => {
    try {
      const { products } = await request.json()

      if (!products || !Array.isArray(products)) {
        return NextResponse.json({ error: "Products array is required" }, { status: 400 })
      }

      const result: BulkUploadResult = {
        success: true,
        totalProcessed: products.length,
        successCount: 0,
        errorCount: 0,
        errors: [],
      }

      const productsCollection = collection(db, "products")

      for (let i = 0; i < products.length; i++) {
        try {
          const product = products[i]

          // Validate product data
          const validationErrors = ProductUtils.validateProduct(product)
          if (validationErrors.length > 0) {
            result.errorCount++
            result.errors.push({
              row: i + 1,
              error: validationErrors.join(", "),
              data: product,
            })
            continue
          }

          // Prepare product for Firebase
          const productData: Partial<Product> = {
            ...product,
            id: ProductUtils.generateSKU(product),
            sku: ProductUtils.generateSKU(product),
            currency: product.currency || "₹",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: request.user.uid,
          }

          // Add to Firebase
          await addDoc(productsCollection, {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })

          result.successCount++
        } catch (error: any) {
          console.error(`Error processing product ${i + 1}:`, error)
          result.errorCount++
          result.errors.push({
            row: i + 1,
            error: error.message || "Failed to save product",
            data: products[i],
          })
        }
      }

      result.success = result.errorCount === 0

      return NextResponse.json(result)
    } catch (error: any) {
      console.error("Bulk upload error:", error)
      return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 })
    }
  },
)
