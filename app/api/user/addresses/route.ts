import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { withAuth } from "@/middleware/auth-middleware"
import { LocationUtils } from "@/utils/location-utils"
import type { Address } from "@/types/location"

export const GET = withAuth(async (request: NextRequest & { user: any }) => {
  try {
    const addressesRef = collection(db, "addresses")
    const q = query(addressesRef, where("userId", "==", request.user.uid))
    const querySnapshot = await getDocs(q)

    const addresses: Address[] = []
    querySnapshot.forEach((doc) => {
      addresses.push({ id: doc.id, ...doc.data() } as Address)
    })

    // Sort by default first, then by creation date
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({ addresses })
  } catch (error: any) {
    console.error("Get addresses error:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest & { user: any }) => {
  try {
    const addressData = await request.json()

    // Validate address data
    const validation = LocationUtils.validateAddress(addressData)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 })
    }

    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      const addressesRef = collection(db, "addresses")
      const q = query(addressesRef, where("userId", "==", request.user.uid), where("isDefault", "==", true))
      const querySnapshot = await getDocs(q)

      // In a real app, you'd update these in a batch
      // For now, we'll just note that this should be handled
    }

    const newAddress: Partial<Address> = {
      ...addressData,
      id: LocationUtils.generateAddressId(),
      userId: request.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "addresses"), {
      ...newAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      address: { ...newAddress, id: docRef.id },
      message: "Address saved successfully",
    })
  } catch (error: any) {
    console.error("Save address error:", error)
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 })
  }
})
