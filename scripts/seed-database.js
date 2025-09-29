// Database seeding script for development and testing
// This script populates the database with sample data

const admin = require("firebase-admin")

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

// Sample data
const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    category: "Electronics",
    categoryId: "electronics",
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Quick charge - 5 min for 3 hours",
      "Premium build quality",
      "Wireless connectivity",
    ],
    specifications: {
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0",
      "Driver Size": "40mm",
    },
    gst: 18,
    hsn: "85183000",
    featured: true,
    active: true,
    tags: ["wireless", "headphones", "audio", "premium", "noise-cancellation"],
    seo: {
      title: "Premium Wireless Headphones - Best Audio Experience",
      description:
        "Shop premium wireless headphones with noise cancellation. 30-hour battery, quick charge, premium build quality.",
      keywords: ["wireless headphones", "noise cancellation", "premium audio", "bluetooth headphones"],
    },
    createdBy: "admin",
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking watch with heart rate monitoring, GPS, and 7-day battery life. Track your health and fitness goals.",
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
    ],
    category: "Electronics",
    categoryId: "electronics",
    stock: 30,
    rating: 4.3,
    reviewCount: 89,
    features: ["Heart rate monitoring", "GPS tracking", "7-day battery life", "Water resistant", "Sleep tracking"],
    specifications: {
      Display: "1.4 inch AMOLED",
      Battery: "7 days",
      "Water Resistance": "5ATM",
      Sensors: "Heart rate, GPS, Accelerometer",
      Compatibility: "iOS & Android",
    },
    gst: 18,
    hsn: "91021200",
    featured: true,
    active: true,
    tags: ["smartwatch", "fitness", "health", "gps", "heart-rate"],
    seo: {
      title: "Smart Fitness Watch - Advanced Health Tracking",
      description: "Track your fitness with our smart watch. Heart rate monitoring, GPS, 7-day battery life.",
      keywords: ["fitness watch", "smart watch", "health tracking", "gps watch"],
    },
    createdBy: "admin",
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt. Perfect for casual wear with a soft, breathable fabric.",
    price: 799,
    originalPrice: 1299,
    discount: 38,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    ],
    category: "Clothing",
    categoryId: "clothing",
    stock: 100,
    rating: 4.2,
    reviewCount: 156,
    features: [
      "100% Organic Cotton",
      "Soft and breathable",
      "Pre-shrunk fabric",
      "Sustainable production",
      "Available in multiple colors",
    ],
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      Care: "Machine washable",
      Origin: "Made in India",
      Sizes: "S, M, L, XL, XXL",
    },
    gst: 12,
    hsn: "61091000",
    featured: false,
    active: true,
    tags: ["organic", "cotton", "t-shirt", "sustainable", "casual"],
    seo: {
      title: "Organic Cotton T-Shirt - Sustainable Fashion",
      description:
        "Shop organic cotton t-shirts. Soft, breathable, sustainable. Available in multiple colors and sizes.",
      keywords: ["organic cotton", "sustainable fashion", "cotton t-shirt", "eco-friendly clothing"],
    },
    createdBy: "admin",
  },
]

const sampleUsers = [
  {
    email: "admin@ecommerce.com",
    name: "Admin User",
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
    phone: "+91-9876543210",
    address: {
      street: "123 Admin Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
  },
  {
    email: "customer@example.com",
    name: "John Customer",
    role: "customer",
    permissions: ["read:products", "create:orders", "read:own_orders"],
    phone: "+91-9876543211",
    address: {
      street: "456 Customer Lane",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
  },
]

const sampleOrders = [
  {
    orderNumber: "ORD-2024-001",
    userId: "customer@example.com",
    customerName: "John Customer",
    customerEmail: "customer@example.com",
    customerPhone: "+91-9876543211",
    items: [
      {
        productId: "prod_1",
        productName: "Premium Wireless Headphones",
        quantity: 1,
        price: 2999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      },
    ],
    subtotal: 2999,
    gst: 539.82,
    discount: 0,
    shippingCharges: 0,
    total: 3538.82,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "razorpay",
    razorpayOrderId: "order_test_123",
    razorpayPaymentId: "pay_test_123",
    shippingAddress: {
      name: "John Customer",
      phone: "+91-9876543211",
      addressLine1: "456 Customer Lane",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    estimatedDelivery: "2024-01-20",
  },
]

// Seeding functions
async function seedProducts() {
  console.log("🌱 Seeding products...")

  const productsRef = db.collection("products")
  const batch = db.batch()

  for (const product of sampleProducts) {
    const docRef = productsRef.doc()
    batch.set(docRef, {
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${sampleProducts.length} products`)
}

async function seedUsers() {
  console.log("🌱 Seeding users...")

  const usersRef = db.collection("users")
  const batch = db.batch()

  for (const user of sampleUsers) {
    const docRef = usersRef.doc(user.email)
    batch.set(docRef, {
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${sampleUsers.length} users`)
}

async function seedOrders() {
  console.log("🌱 Seeding orders...")

  const ordersRef = db.collection("orders")
  const batch = db.batch()

  for (const order of sampleOrders) {
    const docRef = ordersRef.doc()
    batch.set(docRef, {
      ...order,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${sampleOrders.length} orders`)
}

// Main seeding function
async function seedDatabase() {
  console.log("🚀 Starting database seeding...\n")

  try {
    await seedProducts()
    await seedUsers()
    await seedOrders()

    console.log("\n🎉 Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
