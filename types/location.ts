export interface Address {
  id: string
  userId: string
  type: "home" | "work" | "other"
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
  isDefault: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}

export interface DeliveryZone {
  id: string
  name: string
  pincodes: string[]
  deliveryFee: number
  estimatedDays: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LocationValidation {
  isValid: boolean
  errors: string[]
  suggestions?: Address[]
}

export interface GeolocationResult {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

export interface PincodeInfo {
  pincode: string
  city: string
  state: string
  country: string
  deliveryAvailable: boolean
  deliveryFee?: number
  estimatedDays?: number
}
