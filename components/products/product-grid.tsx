"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Eye, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured?: boolean
  active?: boolean
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleAddToCart = async (product: Product) => {
    setLoadingStates((prev) => ({ ...prev, [product.id]: true }))

    // Simulate loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      category: product.category,
      stock: product.stock,
      featured: product.featured,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setLoadingStates((prev) => ({ ...prev, [product.id]: false }))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-square bg-muted rounded-t-lg" />
            </CardContent>
            <CardFooter className="p-4">
              <div className="w-full space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {product.featured && <Badge className="absolute top-2 left-2">Featured</Badge>}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Low Stock
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}

              {/* Overlay with quick actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                <Link href={`/products/${product.id}`}>
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0 || loadingStates[product.id]}
                >
                  {loadingStates[product.id] ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-1" />
                  )}
                  {loadingStates[product.id] ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4">
            <div className="w-full">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 mt-1">{product.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">₹{product.price}</span>
                  <Badge variant="outline" className="text-xs w-fit">
                    {product.category}
                  </Badge>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0 || loadingStates[product.id]}
                  className="shrink-0"
                >
                  {loadingStates[product.id] ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Adding...
                    </>
                  ) : product.stock === 0 ? (
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
