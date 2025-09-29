# E-Commerce Platform Setup Guide

## Prerequisites
- Node.js 18+ 
- Firebase Account
- Razorpay Account (for Indian payments)
- Git

## Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <your-repo-url>
cd ecommerce-platform
npm install
\`\`\`

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

**Required Environment Variables:**

#### Firebase Configuration
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

#### Razorpay Configuration
\`\`\`env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
\`\`\`

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication, Firestore, and Storage
4. Get configuration from Project Settings

#### Setup Firestore Database
\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore
\`\`\`

#### Setup Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Add authorized domains

#### Setup Storage
1. Go to Storage
2. Set up storage bucket
3. Deploy storage rules: `firebase deploy --only storage`

### 4. Razorpay Setup

#### Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create account and complete KYC
3. Get API keys from Settings > API Keys
4. Setup webhooks for payment verification

#### Webhook Configuration
- Webhook URL: `https://your-domain.com/api/payments/webhook`
- Events: `payment.captured`, `payment.failed`, `order.paid`

### 5. Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### 6. Database Seeding

Run the SQL scripts to set up initial data:
\`\`\`bash
# This will create tables and seed sample data
npm run db:setup
\`\`\`

## Deployment Options

### Option 1: Firebase Hosting
\`\`\`bash
# Build the app
npm run build
npm run export

# Deploy to Firebase
firebase deploy --only hosting
\`\`\`

### Option 2: Vercel
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
\`\`\`

### Option 3: AWS with CI/CD

#### Setup AWS Infrastructure
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # Add all environment variables
      
      - name: Deploy to S3
        run: aws s3 sync ./out s3://${{ secrets.S3_BUCKET }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
\`\`\`

## API Testing

### Using Postman
1. Import `docs/postman_collection.json`
2. Set environment variables:
   - `base_url`: Your API base URL
   - `auth_token`: JWT token from login

### Using cURL
\`\`\`bash
# Test product endpoint
curl -X GET "http://localhost:3000/api/products" \
  -H "Content-Type: application/json"

# Test with authentication
curl -X GET "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## Cross-Platform Integration

### Flutter Integration
\`\`\`dart
// pubspec.yaml
dependencies:
  http: ^0.13.5
  shared_preferences: ^2.0.15

// lib/services/api_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'https://your-domain.com/api';
  
  static Future<List<Product>> getProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products'),
      headers: {'Content-Type': 'application/json'},
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['data']['products'] as List)
          .map((json) => Product.fromJson(json))
          .toList();
    }
    throw Exception('Failed to load products');
  }
}
\`\`\`

### React Native Integration
\`\`\`javascript
// services/apiService.js
const API_BASE_URL = 'https://your-domain.com/api';

class ApiService {
  static async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  }
  
  static async createOrder(orderData, token) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    return response.json();
  }
}

export default ApiService;
\`\`\`

## Monitoring and Analytics

### Firebase Analytics
\`\`\`javascript
// lib/analytics.ts
import { analytics } from '@/lib/firebase-config';
import { logEvent } from 'firebase/analytics';

export const trackPurchase = (orderId: string, value: number) => {
  if (analytics) {
    logEvent(analytics, 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'INR'
    });
  }
};
\`\`\`

### Error Monitoring
\`\`\`bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
\`\`\`

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Firebase security rules are configured
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Input validation is implemented
- [ ] JWT tokens have proper expiration
- [ ] Razorpay webhook signature verification
- [ ] CORS is properly configured

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Check environment variables
   - Verify Firebase project configuration
   - Ensure proper authentication setup

2. **Razorpay Payment Failures**
   - Verify API keys
   - Check webhook configuration
   - Test in sandbox mode first

3. **API CORS Errors**
   - Add your domain to Firebase authorized domains
   - Configure CORS headers in API routes

4. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for missing environment variables
   - Verify all dependencies are installed

### Support
- Email: support@estore.in
- Documentation: [API Docs](./API_DOCUMENTATION.md)
- Issues: Create GitHub issue
