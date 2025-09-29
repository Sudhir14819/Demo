import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { requirePermission } from "@/middleware/auth-middleware"
import { PERMISSIONS } from "@/config/api-endpoints"
import { EmailUtils } from "@/utils/email-utils"
import type { EmailTemplate } from "@/types/admin"

export const GET = requirePermission(PERMISSIONS.ADMIN.MANAGE_USERS)(async (request: NextRequest & { user: any }) => {
  try {
    const templatesRef = collection(db, "email_templates")
    const querySnapshot = await getDocs(templatesRef)

    const templates: EmailTemplate[] = []
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() } as EmailTemplate)
    })

    return NextResponse.json({ templates })
  } catch (error: any) {
    console.error("Get email templates error:", error)
    return NextResponse.json({ error: "Failed to fetch email templates" }, { status: 500 })
  }
})

export const POST = requirePermission(PERMISSIONS.ADMIN.MANAGE_USERS)(async (request: NextRequest & { user: any }) => {
  try {
    const templateData = await request.json()

    // Validate template data
    const validationErrors = EmailUtils.validateTemplate(templateData)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    const newTemplate: Partial<EmailTemplate> = {
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "email_templates"), {
      ...newTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      template: { ...newTemplate, id: docRef.id },
      message: "Email template created successfully",
    })
  } catch (error: any) {
    console.error("Create email template error:", error)
    return NextResponse.json({ error: "Failed to create email template" }, { status: 500 })
  }
})
