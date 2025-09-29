"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Copy, Check } from "lucide-react"

export function TokenDisplay() {
  const { user, token, permissions, isAuthenticated } = useAuth()
  const [showToken, setShowToken] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isAuthenticated) {
    return null
  }

  const copyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="text-primary">Authentication Status</CardTitle>
        <CardDescription>Current session information and permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* User Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">User Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{user?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{user?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Role:</span>
              <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="ml-2">
                {user?.role}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="default" className="ml-2 bg-secondary">
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Token Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Session Token</h4>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showToken ? "Hide" : "Show"}
              </Button>
              <Button variant="outline" size="sm" onClick={copyToken} disabled={!token}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
            {showToken ? token : "••••••••••••••••••••••••••••••••••••••••"}
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs border-secondary text-secondary-foreground">
                {permission}
              </Badge>
            ))}
          </div>
        </div>

        {/* Session Info */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-semibold text-foreground">Session Details</h4>
          <div className="text-sm text-muted-foreground">
            <p>• Token stored in sessionStorage for security</p>
            <p>• Session expires when browser is closed</p>
            <p>• All API requests include Bearer token authentication</p>
            <p>• Currency: Indian Rupees (₹)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
