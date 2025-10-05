// Firebase Configuration for Indian E-commerce Platform
// This file contains all Firebase and Razorpay configurations

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { Configfb as configfb } from "./env"
// Firebase Configuration
const firebaseConfig = {
  apiKey: configfb.apiKey,
  authDomain: configfb.authDomain,
  projectId: configfb.projectId,
  storageBucket: configfb,
  messagingSenderId:configfb.messagingSenderId,
  appId:configfb.appId,
  measurementId:configfb.measurementId, // Add your measurement ID if available
}

// Razorpay Configuration for Indian Market
export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxx",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "your-secret-key",
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "your-webhook-secret",
  currency: "INR",
  company: {
    name: "E-Store India",
    logo: "/logo.png",
    theme: {
      color: "#059669",
    },
  },
}

// Payment Methods for Indian Market
export const indianPaymentMethods = {
  cards: true,
  netbanking: true,
  wallet: true,
  upi: true,
  emi: true,
  cardless_emi: true,
  paylater: true,
  banks: ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "YES", "INDUSIND", "BOB", "PNB", "CANARA", "UNION", "INDIAN"],
  wallets: ["paytm", "mobikwik", "olamoney", "freecharge", "jio"],
  upi_apps: ["googlepay", "phonepe", "paytm", "bhim", "mobikwik"],
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

auth = getAuth(app)
db = getFirestore(app)
storage = getStorage(app)

// Initialize Analytics only on client side
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

// Export Firebase instances
export { app, auth, db, storage, analytics }

// API Configuration for Cross-Platform Usage
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://your-domain.com/api",
  version: "v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Version": "v1",
  },
}

// Indian Market Specific Configuration
export const indianMarketConfig = {
  currency: "INR",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  gst: {
    enabled: true,
    rates: {
      electronics: 18,
      clothing: 12,
      books: 5,
      food: 5,
      default: 18,
    },
  },
  shipping: {
    freeShippingThreshold: 499, // INR
    codAvailable: true,
    deliveryPartners: ["bluedart", "delhivery", "ecom", "dtdc"],
    estimatedDelivery: {
      metro: "1-2 days",
      tier1: "2-3 days",
      tier2: "3-5 days",
      tier3: "5-7 days",
    },
  },
  support: {
    phone: "+91-1234567890",
    email: "support@estore.in",
    whatsapp: "+91-9876543210",
    hours: "9 AM - 9 PM IST",
  },
}

// Environment Variables Template
export const requiredEnvVars = {
  firebase: [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  ],
  razorpay: ["NEXT_PUBLIC_RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
  api: ["NEXT_PUBLIC_API_URL", "JWT_SECRET", "ADMIN_EMAIL"],
}
