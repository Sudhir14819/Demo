"use client"

import { useState } from "react"
import { AddressForm } from "@/components/location/address-form"
import { AddressList } from "@/components/location/address-list"
import { useAuth } from "@/lib/auth"
import type { Address } from "@/types/location"

export default function AddressesPage() {
  const { isAuthenticated, loading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleAddNew = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleSave = async (addressData: Partial<Address>) => {
    try {
      const url = editingAddress ? `/api/user/addresses/${editingAddress.id}` : "/api/user/addresses"

      const method = editingAddress ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingAddress(null)
        // Refresh the list by forcing a re-render
        window.location.reload()
      } else {
        throw new Error("Failed to save address")
      }
    } catch (error) {
      console.error("Save address error:", error)
      throw error
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to manage your addresses.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Addresses</h1>
        <p className="text-muted-foreground">Add and manage your delivery addresses</p>
      </div>

      {showForm ? (
        <AddressForm address={editingAddress || undefined} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <AddressList onAddNew={handleAddNew} onEdit={handleEdit} />
      )}
    </div>
  )
}
