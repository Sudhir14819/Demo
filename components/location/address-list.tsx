"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Edit, Trash2, Plus, Star } from "lucide-react"
import { LocationUtils } from "@/utils/location-utils"
import { useAuth } from "@/lib/auth"
import type { Address } from "@/types/location"

interface AddressListProps {
  onAddNew: () => void
  onEdit: (address: Address) => void
  onSelect?: (address: Address) => void
  selectedAddressId?: string
  showSelection?: boolean
}

export function AddressList({
  onAddNew,
  onEdit,
  onSelect,
  selectedAddressId,
  showSelection = false,
}: AddressListProps) {
  const { user, token } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      } else {
        setError("Failed to load addresses")
      }
    } catch (error) {
      console.error("Fetch addresses error:", error)
      setError("Failed to load addresses")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
      } else {
        alert("Failed to delete address")
      }
    } catch (error) {
      console.error("Delete address error:", error)
      alert("Failed to delete address")
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/set-default`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        )
      } else {
        alert("Failed to set default address")
      }
    } catch (error) {
      console.error("Set default address error:", error)
      alert("Failed to set default address")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <Button onClick={onAddNew} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-4">Add your first address to get started</p>
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-colors ${
                showSelection && selectedAddressId === address.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => showSelection && onSelect?.(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{address.name}</h4>
                      <Badge variant={address.type === "home" ? "default" : "secondary"}>{address.type}</Badge>
                      {address.isDefault && (
                        <Badge variant="outline" className="text-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{LocationUtils.formatAddress(address)}</p>
                    {address.coordinates && (
                      <p className="text-xs text-muted-foreground">
                        📍 {address.coordinates.latitude.toFixed(6)}, {address.coordinates.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {!showSelection && (
                    <div className="flex items-center gap-1 ml-4">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSetDefault(address.id)
                          }}
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(address)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(address.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
