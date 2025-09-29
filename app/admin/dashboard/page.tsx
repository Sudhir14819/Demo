"use client"

import { useState, useEffect } from "react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { EmailTemplates } from "@/components/admin/email-templates"
import { BulkUpload } from "@/components/admin/bulk-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import type { AdminStats } from "@/types/admin"

export default function AdminDashboard() {
  const { user, token, hasPermission } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasPermission("admin:view_analytics")) {
      fetchStats()
    }
  }, [hasPermission])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Fetch stats error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission("admin:view_analytics")) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce platform</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats stats={stats || ({} as AdminStats)} loading={loading} />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <BulkUpload />
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <EmailTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}
