"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { LocationUtils } from "@/utils/location-utils"
import type { Address } from "@/types/location"

interface AddressFormProps {
  address?: Address
  onSave: (address: Partial<Address>) => Promise<void>
  onCancel: () => void
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<Address>>({
    type: "home",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    landmark: "",
    isDefault: false,
    ...address,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const getCurrentLocation = async () => {
    setGettingLocation(true)
    try {
      const location = await LocationUtils.getCurrentLocation()

      // Reverse geocoding would go here - for now, just store coordinates
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }))

      // In a real app, you'd use a geocoding service to get the address
      // For demo purposes, we'll just show a success message
      alert(`Location captured: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
    } catch (error: any) {
      console.error("Location error:", error)
      alert("Failed to get current location. Please enter address manually.")
    } finally {
      setGettingLocation(false)
    }
  }

  const handlePincodeChange = (pincode: string) => {
    setFormData((prev) => ({ ...prev, pincode }))

    // Auto-fill state based on pincode
    if (LocationUtils.isValidIndianPincode(pincode)) {
      const state = LocationUtils.getStateFromPincode(pincode)
      if (state) {
        setFormData((prev) => ({ ...prev, state }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      const validation = LocationUtils.validateAddress(formData)
      if (!validation.isValid) {
        setErrors(validation.errors)
        setLoading(false)
        return
      }

      await onSave(formData)
    } catch (error: any) {
      console.error("Save address error:", error)
      setErrors([error.message || "Failed to save address"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {address ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="type">Address Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Address Name</Label>
              <Input
                id="name"
                placeholder="e.g., Home, Office, etc."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} disabled={gettingLocation}>
                {gettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                Use Current Location
              </Button>
            </div>
            <Input
              id="addressLine1"
              placeholder="House/Flat No., Building Name, Street"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Area, Colony, Sector"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input
              id="landmark"
              placeholder="Near landmark"
              value={formData.landmark}
              onChange={(e) => handleInputChange("landmark", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="6-digit pincode"
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="USA">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => handleInputChange("isDefault", checked as boolean)}
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Address"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
