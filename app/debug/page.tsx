"use client"

import { TokenDisplay } from "@/components/auth/token-display"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DebugPage() {
  const { user, token, permissions, isAuthenticated, loading } = useAuth()

  const testTokenVerification = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const result = await response.json()
      console.log("Token verification result:", result)
      alert(`Token verification: ${result.valid ? "Valid" : "Invalid"}`)
    } catch (error) {
      console.error("Token verification failed:", error)
      alert("Token verification failed")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading authentication...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view authentication debug information.</p>
            <Button asChild className="mt-4">
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Authentication Debug</h1>
        <Button onClick={testTokenVerification} variant="outline">
          Test Token Verification
        </Button>
      </div>

      <TokenDisplay />

      <Card>
        <CardHeader>
          <CardTitle>Raw Authentication Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">User Object:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Permissions Array:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(permissions, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Session Storage Contents:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(
                  {
                    token: token ? "***PRESENT***" : null,
                    user: user ? "***PRESENT***" : null,
                    permissions: permissions.length > 0 ? "***PRESENT***" : [],
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
