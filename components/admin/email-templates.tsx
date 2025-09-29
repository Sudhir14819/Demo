"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Plus, Edit, Trash2, Send } from "lucide-react"
import { EmailUtils } from "@/utils/email-utils"
import { useAuth } from "@/lib/auth"
import type { EmailTemplate } from "@/types/admin"

export function EmailTemplates() {
  const { token } = useAuth()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    content: "",
    type: "custom",
    isActive: true,
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/email-templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Fetch templates error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const validationErrors = EmailUtils.validateTemplate(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const url = editingTemplate ? `/api/admin/email-templates/${editingTemplate.id}` : "/api/admin/email-templates"

      const method = editingTemplate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTemplates()
        setShowForm(false)
        setEditingTemplate(null)
        setFormData({
          name: "",
          subject: "",
          content: "",
          type: "custom",
          isActive: true,
        })
        setErrors([])
      }
    } catch (error) {
      console.error("Save template error:", error)
      setErrors(["Failed to save template"])
    }
  }

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData(template)
    setShowForm(true)
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchTemplates()
      }
    } catch (error) {
      console.error("Delete template error:", error)
    }
  }

  const handleTestEmail = async (template: EmailTemplate) => {
    try {
      const response = await fetch("/api/admin/email-templates/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: template.id,
          testData: {
            customerName: "John Doe",
            orderNumber: "ORD-12345",
            orderTotal: 299.99,
            trackingNumber: "TRK123456789",
            estimatedDelivery: "December 25, 2024",
          },
        }),
      })

      if (response.ok) {
        alert("Test email sent successfully!")
      } else {
        alert("Failed to send test email")
      }
    } catch (error) {
      console.error("Test email error:", error)
      alert("Failed to send test email")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Order Confirmation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Template Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                    <SelectItem value="order_shipped">Order Shipped</SelectItem>
                    <SelectItem value="order_delivered">Order Delivered</SelectItem>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Order Confirmed - {{orderNumber}}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Email content with placeholders like {{customerName}}, {{orderNumber}}, etc."
                rows={10}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>{editingTemplate ? "Update Template" : "Create Template"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingTemplate(null)
                  setFormData({
                    name: "",
                    subject: "",
                    content: "",
                    type: "custom",
                    isActive: true,
                  })
                  setErrors([])
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{template.type.replace("_", " ")}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTestEmail(template)}>
                  <Send className="h-4 w-4 mr-2" />
                  Test
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
