import type { Product } from "@/types/product"

export class ProductUtils {
  /**
   * Validate product data
   */
  static validateProduct(product: Partial<Product>): string[] {
    const errors: string[] = []

    if (!product.name?.trim()) {
      errors.push("Product name is required")
    }

    if (!product.category?.trim()) {
      errors.push("Category is required")
    }

    if (!product.price || product.price <= 0) {
      errors.push("Valid price is required")
    }

    if (!product.description?.trim()) {
      errors.push("Description is required")
    }

    if (!product.imagePath?.trim()) {
      errors.push("Image path is required")
    }

    if (product.rating && (product.rating < 0 || product.rating > 5)) {
      errors.push("Rating must be between 0 and 5")
    }

    return errors
  }

  /**
   * Generate SKU for product
   */
  static generateSKU(product: Partial<Product>): string {
    const categoryCode = product.category?.substring(0, 3).toUpperCase() || "PRD"
    const nameCode =
      product.name
        ?.substring(0, 3)
        .toUpperCase()
        .replace(/[^A-Z]/g, "") || "XXX"
    const timestamp = Date.now().toString().slice(-6)
    return `${categoryCode}-${nameCode}-${timestamp}`
  }

  /**
   * Parse CSV data to products
   */
  static parseCSVToProducts(csvData: string): { products: Partial<Product>[]; errors: string[] } {
    const lines = csvData.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const products: Partial<Product>[] = []
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const product: Partial<Product> = {}

        headers.forEach((header, index) => {
          const value = values[index]
          if (!value) return

          switch (header.toLowerCase()) {
            case "name":
              product.name = value
              break
            case "category":
              product.category = value
              break
            case "price":
              product.price = Number.parseFloat(value)
              break
            case "currency":
              product.currency = value
              break
            case "rating":
              product.rating = Number.parseFloat(value)
              break
            case "description":
              product.description = value
              break
            case "imagepath":
            case "image_path":
              product.imagePath = value
              break
            case "amazonlink":
            case "amazon_link":
              product.amazonLink = value
              break
            case "discount":
              product.discount = Number.parseInt(value)
              break
            case "benefits":
              product.benefits = value.split("|").map((b) => b.trim())
              break
            case "stock":
              product.stock = Number.parseInt(value)
              break
            case "weight":
              product.weight = value
              break
            case "tags":
              product.tags = value.split("|").map((t) => t.trim())
              break
          }
        })

        if (product.name) {
          product.id = this.generateSKU(product)
          product.sku = product.id
          product.currency = product.currency || "₹"
          product.isActive = true
          product.createdAt = new Date().toISOString()
          products.push(product)
        }
      } catch (error) {
        errors.push(`Error parsing line ${i + 1}: ${error}`)
      }
    }

    return { products, errors }
  }

  /**
   * Convert products to CSV format
   */
  static productsToCSV(products: Product[]): string {
    const headers = [
      "name",
      "category",
      "price",
      "currency",
      "rating",
      "description",
      "imagePath",
      "amazonLink",
      "discount",
      "benefits",
      "stock",
      "weight",
      "tags",
    ]

    const csvLines = [headers.join(",")]

    products.forEach((product) => {
      const values = [
        `"${product.name}"`,
        `"${product.category}"`,
        product.price.toString(),
        `"${product.currency}"`,
        product.rating.toString(),
        `"${product.description}"`,
        `"${product.imagePath}"`,
        `"${product.amazonLink || ""}"`,
        product.discount.toString(),
        `"${product.benefits.join("|")}"`,
        (product.stock || 0).toString(),
        `"${product.weight || ""}"`,
        `"${product.tags?.join("|") || ""}"`,
      ]
      csvLines.push(values.join(","))
    })

    return csvLines.join("\n")
  }

  /**
   * Generate sample CSV template
   */
  static generateSampleCSV(): string {
    const sampleProduct = {
      name: "Sample Plant Product",
      category: "plants",
      price: 299,
      currency: "₹",
      rating: 4.5,
      description: "Beautiful sample plant perfect for indoor decoration",
      imagePath: "assets/images/products/sample.png",
      amazonLink: "https://example.com/product",
      discount: 20,
      benefits: "Easy care|Air purifying|Beautiful flowers",
      stock: 100,
      weight: "500g",
      tags: "indoor|flowering|beginner-friendly",
    }

    return this.productsToCSV([sampleProduct as Product])
  }
}
