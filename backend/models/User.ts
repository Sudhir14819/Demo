export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "admin" | "customer"
  addresses: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}
