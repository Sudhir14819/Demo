// Database migration script for Firebase Firestore
// This script handles database schema updates and data migrations

const admin = require("firebase-admin")
const path = require("path")

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_ADMIN_SDK_KEY
    ? JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY)
    : require("../firebase-admin-key.json")

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

const db = admin.firestore()

// Migration functions
const migrations = {
  // Migration 1: Add GST and HSN fields to existing products
  async addGSTFields() {
    console.log("🔄 Adding GST and HSN fields to products...")

    const productsRef = db.collection("products")
    const snapshot = await productsRef.get()

    const batch = db.batch()
    let count = 0

    snapshot.forEach((doc) => {
      const data = doc.data()
      if (!data.gst || !data.hsn) {
        const categoryGST = {
          electronics: 18,
          clothing: 12,
          books: 5,
          beauty: 18,
          home: 18,
          sports: 18,
        }

        batch.update(doc.ref, {
          gst: data.gst || categoryGST[data.categoryId] || 18,
          hsn: data.hsn || "00000000",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        count++
      }
    })

    if (count > 0) {
      await batch.commit()
      console.log(`✅ Updated ${count} products with GST and HSN fields`)
    } else {
      console.log("✅ All products already have GST and HSN fields")
    }
  },

  // Migration 2: Add order tracking fields
  async addOrderTracking() {
    console.log("🔄 Adding tracking fields to orders...")

    const ordersRef = db.collection("orders")
    const snapshot = await ordersRef.get()

    const batch = db.batch()
    let count = 0

    snapshot.forEach((doc) => {
      const data = doc.data()
      if (!data.trackingNumber) {
        batch.update(doc.ref, {
          trackingNumber: null,
          carrier: null,
          estimatedDelivery: null,
          deliveredAt: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        count++
      }
    })

    if (count > 0) {
      await batch.commit()
      console.log(`✅ Updated ${count} orders with tracking fields`)
    } else {
      console.log("✅ All orders already have tracking fields")
    }
  },

  // Migration 3: Create indexes for better query performance
  async createIndexes() {
    console.log("🔄 Creating database indexes...")

    // Note: Firestore indexes are typically created through the Firebase Console
    // or using the Firebase CLI. This is a placeholder for index creation logic.

    const indexesToCreate = [
      {
        collection: "products",
        fields: ["category", "active", "createdAt"],
      },
      {
        collection: "orders",
        fields: ["userId", "status", "createdAt"],
      },
      {
        collection: "users",
        fields: ["email", "createdAt"],
      },
    ]

    console.log("📋 Indexes to create:")
    indexesToCreate.forEach((index) => {
      console.log(`   - ${index.collection}: ${index.fields.join(", ")}`)
    })

    console.log("⚠️  Please create these indexes manually in Firebase Console")
    console.log("✅ Index creation task completed")
  },

  // Migration 4: Add user roles and permissions
  async addUserRoles() {
    console.log("🔄 Adding user roles and permissions...")

    const usersRef = db.collection("users")
    const snapshot = await usersRef.get()

    const batch = db.batch()
    let count = 0

    snapshot.forEach((doc) => {
      const data = doc.data()
      if (!data.role) {
        batch.update(doc.ref, {
          role: "customer",
          permissions: ["read:products", "create:orders", "read:own_orders"],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        count++
      }
    })

    // Add admin user if specified
    if (process.env.ADMIN_EMAIL) {
      const adminQuery = await usersRef.where("email", "==", process.env.ADMIN_EMAIL).get()
      if (!adminQuery.empty) {
        const adminDoc = adminQuery.docs[0]
        batch.update(adminDoc.ref, {
          role: "admin",
          permissions: [
            "read:products",
            "write:products",
            "delete:products",
            "read:orders",
            "write:orders",
            "delete:orders",
            "read:users",
            "write:users",
            "delete:users",
            "read:analytics",
            "write:settings",
          ],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        console.log(`👑 Admin role assigned to ${process.env.ADMIN_EMAIL}`)
      }
    }

    if (count > 0) {
      await batch.commit()
      console.log(`✅ Updated ${count} users with roles and permissions`)
    } else {
      console.log("✅ All users already have roles assigned")
    }
  },
}

// Main migration runner
async function runMigrations() {
  console.log("🚀 Starting database migrations...\n")

  try {
    // Run all migrations in sequence
    await migrations.addGSTFields()
    await migrations.addOrderTracking()
    await migrations.createIndexes()
    await migrations.addUserRoles()

    console.log("\n🎉 All migrations completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
}

module.exports = { migrations, runMigrations }
