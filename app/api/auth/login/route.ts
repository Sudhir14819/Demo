import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase-config"
import { AuthService } from "@/services/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    // Check if user is active
    if (!userData.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 })
    }

    const permissions = AuthService.getUserPermissions(userData.role)
    const token = AuthService.generateToken({
      uid: user.uid,
      email: user.email!,
      role: userData.role,
      permissions,
    })

    // Return user data without sensitive information
    const userResponse = {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: userData.role,
      profile: userData.profile,
    }

    return NextResponse.json({
      user: userResponse,
      token, // Include JWT token in response
      permissions, // Include user permissions
      message: "Login successful",
    })
  } catch (error: any) {
    console.error("Login error:", error)

    // Handle Firebase Auth errors
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    } else if (error.code === "auth/invalid-email") {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    } else if (error.code === "auth/too-many-requests") {
      return NextResponse.json({ error: "Too many failed attempts. Please try again later." }, { status: 429 })
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
