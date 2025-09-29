export interface ProductVariety {
  name: string
  price: number
  originalPrice: number
  unitCost?: string | null
}

export interface Product {
  id: string
  nameKey?: string
  name: string
  category: string
  price: number
  currency: string
  rating: number
  imagePath: string
  description: string
  amazonLink?: string
  discount: number
  benefits: string[]
  varieties?: ProductVariety[]
  stock?: number
  sku?: string
  weight?: string
  dimensions?: string
  tags?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
}

export interface BulkUploadResult {
  success: boolean
  totalProcessed: number
  successCount: number
  errorCount: number
  errors: Array<{
    row: number
    error: string
    data?: any
  }>
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  search?: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
