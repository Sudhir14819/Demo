import { type NextRequest, NextResponse } from "next/server"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase-config"
import { AuthService } from "@/services/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = "user" } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile with display name
    await updateProfile(user, {
      displayName: name,
    })

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      profile: {
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      },
    })

    const permissions = AuthService.getUserPermissions(role)
    const token = AuthService.generateToken({
      uid: user.uid,
      email: user.email!,
      role: role,
      permissions,
    })

    // Return user data without sensitive information
    const userData = {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      name: name,
      role: role,
    }

    return NextResponse.json({
      user: userData,
      token, // Include JWT token in response
      permissions, // Include user permissions
      message: "User registered successfully",
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle Firebase Auth errors
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    } else if (error.code === "auth/weak-password") {
      return NextResponse.json({ error: "Password should be at least 6 characters" }, { status: 400 })
    } else if (error.code === "auth/invalid-email") {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
