"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/products/product-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ShoppingCart, User, Package, Heart } from "lucide-react"

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

export default function UserDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "user")) {
      router.push("/user/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true)
        const response = await fetch("/api/products?limit=6&activeOnly=true&sortBy=createdAt&sortOrder=desc")
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()
        setFeaturedProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "user") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Discover amazing products at great prices</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">My Cart</h3>
              <p className="text-sm text-muted-foreground mb-3">View items in cart</p>
              <Button asChild size="sm" className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">My Orders</h3>
              <p className="text-sm text-muted-foreground mb-3">Track your orders</p>
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/account">View Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Wishlist</h3>
              <p className="text-sm text-muted-foreground mb-3">Saved items</p>
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/wishlist">View Wishlist</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Profile</h3>
              <p className="text-sm text-muted-foreground mb-3">Manage account</p>
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href="/account">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Featured Products</h2>
              <p className="text-muted-foreground">Check out our most popular items</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} loading={productsLoading} />
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Electronics", "Sports", "Home", "Accessories"].map((category) => (
              <Link key={category} href={`/products?category=${category}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {category.slice(0, 2).toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
