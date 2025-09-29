"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart, Settings, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">E-Store</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to your complete e-commerce solution. Choose your portal to get started.
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Customer Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Browse products, manage your cart, and place orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Browse thousands of products</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Add items to cart and checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Track your orders and manage profile</span>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/user/login">Login as Customer</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                >
                  <Link href="/user/register">Register as Customer</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-emerald-100 rounded-full w-fit">
                <Settings className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage products, inventory, and view analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Add and manage products</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>View inventory and analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Manage orders and customers</span>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/admin/login">Login as Admin</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Link href="/admin/register">Register as Admin</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-white rounded-full w-fit shadow-sm">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
            <p className="text-sm text-gray-600">Secure authentication for customers and admins</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-white rounded-full w-fit shadow-sm">
              <ShoppingCart className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">E-commerce Ready</h3>
            <p className="text-sm text-gray-600">Complete shopping cart and checkout system</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-white rounded-full w-fit shadow-sm">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Analytics Dashboard</h3>
            <p className="text-sm text-gray-600">Comprehensive insights and reporting tools</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; 2024 E-Store. Built for the Indian market with ₹ pricing.</p>
        </div>
      </div>
    </div>
  )
}
