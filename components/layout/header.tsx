"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import { Menu, Search, ShoppingCart, User, LogOut, Shield } from "lucide-react"

export function Header() {
  const { itemCount } = useCart()
  const { user, logout, isAuthenticated, permissions } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      logout() // Always clear local session
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              E-Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">
              Products
            </Link>
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors font-medium">
              Categories
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 border-primary/20 focus:border-primary"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.role === "admin" && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="/products" className="text-lg font-medium">
                    Products
                  </Link>
                  <Link href="/categories" className="text-lg font-medium">
                    Categories
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    Contact
                  </Link>
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <>
                        {user?.role === "admin" && (
                          <Badge variant="outline" className="border-primary text-primary mb-2">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        <Link href="/account" className="text-lg font-medium block mb-2">
                          My Account
                        </Link>
                        <Button variant="ghost" onClick={handleLogout} className="text-lg font-medium p-0 h-auto">
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-lg font-medium block mb-2">
                          Sign In
                        </Link>
                        <Link href="/register" className="text-lg font-medium block">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <Link href="/admin/login" className="text-lg font-medium text-primary">
                      Admin Portal
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
