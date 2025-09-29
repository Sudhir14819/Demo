# E-Commerce API Documentation

## Overview
This API provides comprehensive e-commerce functionality for Indian market including authentication, product management, order processing, and payment integration with Razorpay.

**Base URL:** `https://your-domain.com/api`
**Version:** v1
**Authentication:** JWT Bearer Token

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Orders](#orders)
- [Payments](#payments)
- [Admin](#admin)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

### Register User
\`\`\`http
POST /api/auth/register
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543210",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
\`\`\`

### Login User
\`\`\`http
POST /api/auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
\`\`\`

### Refresh Token
\`\`\`http
POST /api/auth/refresh
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <refresh_token>
\`\`\`

## Products

### Get All Products
\`\`\`http
GET /api/products
\`\`\`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search products by name/description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort by price_asc, price_desc, rating, newest

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones",
        "price": 2999,
        "originalPrice": 3999,
        "discount": 25,
        "images": [
          "https://storage.googleapis.com/bucket/image1.jpg"
        ],
        "category": "Electronics",
        "categoryId": "cat_1",
        "stock": 50,
        "rating": 4.5,
        "reviewCount": 128,
        "features": ["Bluetooth 5.0", "30hr Battery"],
        "specifications": {
          "brand": "TechBrand",
          "model": "WH-1000",
          "warranty": "1 year"
        },
        "gst": 18,
        "hsn": "85183000",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
\`\`\`

### Get Product by ID
\`\`\`http
GET /api/products/{productId}
\`\`\`

### Create Product (Admin Only)
\`\`\`http
POST /api/products
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Product",
  "description": "Product description",
  "price": 1999,
  "originalPrice": 2499,
  "categoryId": "cat_1",
  "stock": 100,
  "images": ["image_url_1", "image_url_2"],
  "features": ["Feature 1", "Feature 2"],
  "specifications": {
    "brand": "Brand Name",
    "model": "Model-123"
  },
  "gst": 18,
  "hsn": "12345678"
}
\`\`\`

### Update Product (Admin Only)
\`\`\`http
PUT /api/products/{productId}
\`\`\`

### Delete Product (Admin Only)
\`\`\`http
DELETE /api/products/{productId}
\`\`\`

## Orders

### Create Order
\`\`\`http
POST /api/orders
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <user_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 2999
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91-9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "couponCode": "SAVE10"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2024-001",
      "userId": "user_123",
      "items": [...],
      "subtotal": 5998,
      "gst": 1079.64,
      "discount": 599.8,
      "shippingCharges": 0,
      "total": 6477.84,
      "status": "pending",
      "paymentStatus": "pending",
      "shippingAddress": {...},
      "estimatedDelivery": "2024-01-05",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "razorpayOrderId": "order_razorpay_123"
  }
}
\`\`\`

### Get User Orders
\`\`\`http
GET /api/orders
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <user_token>
\`\`\`

### Get Order by ID
\`\`\`http
GET /api/orders/{orderId}
\`\`\`

### Update Order Status (Admin Only)
\`\`\`http
PUT /api/orders/{orderId}/status
\`\`\`

**Request Body:**
\`\`\`json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789",
  "carrier": "BlueDart"
}
\`\`\`

## Payments

### Create Razorpay Order
\`\`\`http
POST /api/payments/create-order
\`\`\`

**Request Body:**
\`\`\`json
{
  "orderId": "order_123",
  "amount": 647784,
  "currency": "INR"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_razorpay_123",
    "amount": 647784,
    "currency": "INR",
    "keyId": "rzp_live_xxxxxxxxxx"
  }
}
\`\`\`

### Verify Payment
\`\`\`http
POST /api/payments/verify
\`\`\`

**Request Body:**
\`\`\`json
{
  "razorpay_order_id": "order_razorpay_123",
  "razorpay_payment_id": "pay_razorpay_456",
  "razorpay_signature": "signature_hash",
  "orderId": "order_123"
}
\`\`\`

### Process Refund (Admin Only)
\`\`\`http
POST /api/payments/refund
\`\`\`

**Request Body:**
\`\`\`json
{
  "paymentId": "pay_razorpay_456",
  "amount": 647784,
  "reason": "Customer request"
}
\`\`\`

## Admin APIs

### Get Dashboard Stats
\`\`\`http
GET /api/admin/dashboard
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "stats": {
      "totalOrders": 1250,
      "totalRevenue": 2500000,
      "totalCustomers": 850,
      "totalProducts": 120
    },
    "recentOrders": [...],
    "topProducts": [...],
    "salesChart": [...]
  }
}
\`\`\`

### Get All Orders (Admin)
\`\`\`http
GET /api/admin/orders
\`\`\`

### Get All Users (Admin)
\`\`\`http
GET /api/admin/users
\`\`\`

## Categories

### Get All Categories
\`\`\`http
GET /api/categories
\`\`\`

### Create Category (Admin Only)
\`\`\`http
POST /api/categories
\`\`\`

## Cart

### Get User Cart
\`\`\`http
GET /api/cart
\`\`\`

### Add to Cart
\`\`\`http
POST /api/cart
\`\`\`

**Request Body:**
\`\`\`json
{
  "productId": "prod_123",
  "quantity": 2
}
\`\`\`

### Update Cart Item
\`\`\`http
PUT /api/cart/{itemId}
\`\`\`

### Remove from Cart
\`\`\`http
DELETE /api/cart/{itemId}
\`\`\`

## Error Handling

All API endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
\`\`\`

**Common Error Codes:**
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

- **General APIs**: 100 requests per minute per IP
- **Authentication APIs**: 5 requests per minute per IP
- **Admin APIs**: 200 requests per minute per user

## Indian Market Specific Features

### GST Calculation
All product prices include GST calculation based on HSN codes:
- Electronics: 18%
- Clothing: 12%
- Books: 5%
- Food items: 5%

### Payment Methods
Supported payment methods for Indian market:
- Credit/Debit Cards
- Net Banking (All major banks)
- UPI (GPay, PhonePe, Paytm, BHIM)
- Wallets (Paytm, Mobikwik, Ola Money)
- EMI options
- Cash on Delivery (COD)

### Shipping
- Free shipping on orders above ₹499
- COD available for orders below ₹2000
- Delivery partners: BlueDart, Delhivery, Ecom Express
- Estimated delivery times based on location tier

## SDK Examples

### Flutter/Dart
\`\`\`dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ECommerceAPI {
  static const String baseUrl = 'https://your-domain.com/api';
  
  static Future<Map<String, dynamic>> getProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products'),
      headers: {'Content-Type': 'application/json'},
    );
    return json.decode(response.body);
  }
}
\`\`\`

### React Native/JavaScript
\`\`\`javascript
const API_BASE_URL = 'https://your-domain.com/api';

export const apiClient = {
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    return response.json();
  }
};
\`\`\`

### cURL Examples
\`\`\`bash
# Get products
curl -X GET "https://your-domain.com/api/products" \
  -H "Content-Type: application/json"

# Create order
curl -X POST "https://your-domain.com/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"productId":"prod_123","quantity":2}]}'
