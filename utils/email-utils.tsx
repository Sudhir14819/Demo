import type { EmailTemplate, EmailNotification } from "@/types/admin"

export class EmailUtils {
  /**
   * Generate email content from template
   */
  static generateEmailContent(template: EmailTemplate, data: any): { subject: string; content: string } {
    let subject = template.subject
    let content = template.content

    // Replace placeholders with actual data
    const replacements: { [key: string]: string } = {
      "{{customerName}}": data.customerName || data.name || "Customer",
      "{{orderNumber}}": data.orderNumber || "",
      "{{orderTotal}}": data.total ? `₹${data.total.toFixed(2)}` : "",
      "{{trackingNumber}}": data.trackingNumber || "",
      "{{estimatedDelivery}}": data.estimatedDelivery || "",
      "{{companyName}}": "GreenGrow",
      "{{supportEmail}}": "support@greengrow.com",
      "{{websiteUrl}}": "https://greengrow.com",
    }

    // Replace placeholders in subject and content
    Object.entries(replacements).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, "g"), value)
      content = content.replace(new RegExp(placeholder, "g"), value)
    })

    return { subject, content }
  }

  /**
   * Get default email templates
   */
  static getDefaultTemplates(): Partial<EmailTemplate>[] {
    return [
      {
        name: "Order Confirmation",
        subject: "Order Confirmed - {{orderNumber}}",
        content: `
          <h2>Thank you for your order, {{customerName}}!</h2>
          <p>Your order <strong>{{orderNumber}}</strong> has been confirmed.</p>
          <p><strong>Order Total:</strong> {{orderTotal}}</p>
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for choosing {{companyName}}!</p>
        `,
        type: "order_confirmation",
        isActive: true,
      },
      {
        name: "Order Shipped",
        subject: "Your order {{orderNumber}} has shipped!",
        content: `
          <h2>Great news, {{customerName}}!</h2>
          <p>Your order <strong>{{orderNumber}}</strong> has been shipped.</p>
          <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
          <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
          <p>Track your package for real-time updates.</p>
        `,
        type: "order_shipped",
        isActive: true,
      },
      {
        name: "Order Delivered",
        subject: "Your order {{orderNumber}} has been delivered!",
        content: `
          <h2>Your order has been delivered, {{customerName}}!</h2>
          <p>Your order <strong>{{orderNumber}}</strong> has been successfully delivered.</p>
          <p>We hope you love your purchase! If you have any questions, please contact us at {{supportEmail}}.</p>
          <p>Thank you for choosing {{companyName}}!</p>
        `,
        type: "order_delivered",
        isActive: true,
      },
      {
        name: "Welcome Email",
        subject: "Welcome to {{companyName}}, {{customerName}}!",
        content: `
          <h2>Welcome to {{companyName}}, {{customerName}}!</h2>
          <p>Thank you for joining our community of plant lovers!</p>
          <p>Explore our wide range of plants, seeds, fertilizers, and gardening tools.</p>
          <p>Visit our website: {{websiteUrl}}</p>
          <p>Happy gardening!</p>
        `,
        type: "welcome",
        isActive: true,
      },
    ]
  }

  /**
   * Validate email template
   */
  static validateTemplate(template: Partial<EmailTemplate>): string[] {
    const errors: string[] = []

    if (!template.name?.trim()) {
      errors.push("Template name is required")
    }

    if (!template.subject?.trim()) {
      errors.push("Subject is required")
    }

    if (!template.content?.trim()) {
      errors.push("Content is required")
    }

    if (!template.type) {
      errors.push("Template type is required")
    }

    return errors
  }

  /**
   * Send email notification (mock implementation)
   */
  static async sendEmail(notification: Partial<EmailNotification>): Promise<boolean> {
    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // - Resend

    console.log("Sending email:", {
      to: notification.to,
      subject: notification.subject,
      content: notification.content,
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate 95% success rate
    return Math.random() > 0.05
  }

  /**
   * Queue email notification
   */
  static async queueEmailNotification(
    to: string,
    templateId: string,
    data: any,
    orderId?: string,
    userId?: string,
  ): Promise<string> {
    // In a real implementation, you would add this to a queue system
    // For now, we'll just create the notification record

    const notificationId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Queued email notification:", {
      id: notificationId,
      to,
      templateId,
      data,
      orderId,
      userId,
    })

    return notificationId
  }
}
