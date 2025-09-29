export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand: string
  stock: number
  sku: string
  hsn?: string
  gst?: number
  specifications: Record<string, any>
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand: string
  stock: number
  sku: string
  hsn?: string
  gst?: number
  specifications: Record<string, any>
  tags: string[]
  isActive?: boolean
  isFeatured?: boolean
}
