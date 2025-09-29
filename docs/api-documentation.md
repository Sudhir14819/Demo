# E-Commerce Platform API Documentation

## Overview
This document provides comprehensive documentation for the e-commerce platform APIs, including authentication, product management, order processing, and admin functionality.

## Base URL
\`\`\`
Production: https://your-domain.com/api
Development: http://localhost:3000/api
\`\`\`

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Token Management
- Tokens are stored in session storage for security
- Tokens expire after 24 hours and need to be refreshed
- Use the `/auth/verify` endpoint to check token validity

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Login with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

#### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
\`\`\`

### Product Management

#### GET /products
Get paginated list of products with filtering and sorting.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `search`: Search term
- `sort`: Sort field (name, price, createdAt)
- `order`: Sort order (asc, desc)

#### POST /admin/products/bulk-upload
Upload products in bulk using CSV or JSON format.

**Request:**
- Content-Type: multipart/form-data
- File field: `file`
- Supported formats: CSV, JSON

**CSV Format:**
\`\`\`csv
name,description,price,category,subcategory,stock,sku,images
Tomato Seeds,Premium quality tomato seeds,299,Seeds,Vegetable Seeds,100,TOM001,"image1.jpg,image2.jpg"
\`\`\`

**JSON Format:**
\`\`\`json
[
  {
    "name": "Tomato Seeds",
    "description": "Premium quality tomato seeds",
    "price": 299,
    "category": "Seeds",
    "subcategory": "Vegetable Seeds",
    "stock": 100,
    "sku": "TOM001",
    "images": ["image1.jpg", "image2.jpg"]
  }
]
\`\`\`

### Order Management

#### POST /orders
Create a new order.

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "productId": "prod123",
      "quantity": 2,
      "price": 299
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91-9876543210",
    "addressLine1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod"
}
\`\`\`

#### GET /orders/{orderId}/tracking
Get order tracking information.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ORD123",
    "status": "shipped",
    "trackingHistory": [
      {
        "status": "confirmed",
        "timestamp": "2024-01-15T10:00:00Z",
        "message": "Order confirmed"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-16T14:30:00Z",
        "message": "Order shipped"
      }
    ]
  }
}
\`\`\`

## Error Handling

All API responses follow a consistent format:

**Success Response:**
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format"
    }
  }
}
\`\`\`

## Rate Limiting
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Bulk upload: 5 requests per hour

## Currency
All prices are in Indian Rupees (INR).

## Support
For API support, contact: support@yourplatform.com
