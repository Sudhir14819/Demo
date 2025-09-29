import type { Address, LocationValidation, GeolocationResult } from "@/types/location"

export class LocationUtils {
  /**
   * Validate address data
   */
  static validateAddress(address: Partial<Address>): LocationValidation {
    const errors: string[] = []

    if (!address.name?.trim()) {
      errors.push("Address name is required")
    }

    if (!address.addressLine1?.trim()) {
      errors.push("Address line 1 is required")
    }

    if (!address.city?.trim()) {
      errors.push("City is required")
    }

    if (!address.state?.trim()) {
      errors.push("State is required")
    }

    if (!address.pincode?.trim()) {
      errors.push("Pincode is required")
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.push("Pincode must be 6 digits")
    }

    if (!address.country?.trim()) {
      errors.push("Country is required")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Format address for display
   */
  static formatAddress(address: Address): string {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ].filter(Boolean)

    return parts.join(", ")
  }

  /**
   * Get user's current location
   */
  static getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  /**
   * Calculate distance between two coordinates (in km)
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Generate address ID
   */
  static generateAddressId(): string {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validate Indian pincode format
   */
  static isValidIndianPincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode)
  }

  /**
   * Get state from pincode (basic mapping for major states)
   */
  static getStateFromPincode(pincode: string): string | null {
    const firstDigit = pincode.charAt(0)
    const stateMap: { [key: string]: string } = {
      "1": "Delhi",
      "2": "Haryana",
      "3": "Punjab",
      "4": "Rajasthan",
      "5": "Uttar Pradesh",
      "6": "Bihar",
      "7": "West Bengal",
      "8": "Odisha",
      "9": "Tamil Nadu",
    }
    return stateMap[firstDigit] || null
  }
}
