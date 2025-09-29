import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories, products } from "@/lib/products"
import Link from "next/link"

export default function CategoriesPage() {
  const getCategoryStats = (category: string) => {
    const categoryProducts = products.filter((p) => p.category === category)
    return {
      count: categoryProducts.length,
      minPrice: Math.min(...categoryProducts.map((p) => p.price)),
      maxPrice: Math.max(...categoryProducts.map((p) => p.price)),
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">Browse our product categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category)
            return (
              <Link key={category} href={`/products?category=${category}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Badge variant="secondary" className="text-lg font-bold">
                          {category.slice(0, 2).toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category}</h3>
                      <p className="text-muted-foreground mb-4">
                        {stats.count} product{stats.count !== 1 ? "s" : ""}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        ${stats.minPrice} - ${stats.maxPrice}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
