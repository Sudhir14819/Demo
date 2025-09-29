# E-Commerce Platform Database Rules & Schema

## Firebase Firestore Security Rules

This document outlines the comprehensive security rules and database schema for the e-commerce platform.

## Collections Overview

### 1. Users Collection (`/users/{userId}`)
**Purpose**: Store user profile information and roles
**Access Rules**:
- Users can read/write their own data
- Admins can read all user data
- Only authenticated users can create profiles

**Schema**:
\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

### 2. Products Collection (`/products/{productId}`)
**Purpose**: Store product catalog information
**Access Rules**:
- Public read access for all users
- Only admins can create/update/delete products
- Validation ensures required fields and data types

**Schema**:
\`\`\`typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  tags: string[];
  specifications: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

### 3. Orders Collection (`/orders/{orderId}`)
**Purpose**: Store customer orders and order history
**Access Rules**:
- Users can read their own orders
- Admins can read all orders
- Users can create orders for themselves
- Status updates allowed by users and admins

**Schema**:
\`\`\`typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}
\`\`\`

### 4. Categories Collection (`/categories/{categoryId}`)
**Purpose**: Store product categories for organization
**Access Rules**:
- Public read access
- Only admins can create/update/delete categories

**Schema**:
\`\`\`typescript
interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  parentId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

### 5. Cart Collection (`/carts/{userId}`)
**Purpose**: Store user shopping cart items
**Access Rules**:
- Users can only access their own cart
- Real-time updates for cart modifications

**Schema**:
\`\`\`typescript
interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Timestamp;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
\`\`\`

### 6. Reviews Collection (`/reviews/{reviewId}`)
**Purpose**: Store product reviews and ratings
**Access Rules**:
- Public read access
- Authenticated users can create reviews
- Users can edit their own reviews
- Admins can moderate all reviews

**Schema**:
\`\`\`typescript
interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1-5
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

### 7. Payments Collection (`/payments/{paymentId}`)
**Purpose**: Store payment transaction records
**Access Rules**:
- Users can read their own payment records
- Admins can read all payment records
- Only admins can update payment status

**Schema**:
\`\`\`typescript
interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

### 8. Addresses Collection (`/addresses/{addressId}`)
**Purpose**: Store user shipping and billing addresses
**Access Rules**:
- Users can only access their own addresses
- Full CRUD operations for address management

**Schema**:
\`\`\`typescript
interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
\`\`\`

## Security Features

### Role-Based Access Control
- **Admin Role**: Full access to products, orders, analytics, and user management
- **User Role**: Access to personal data, cart, orders, and reviews

### Data Validation
- Required field validation for all collections
- Type checking for numeric fields (price, stock, rating)
- Range validation (rating 1-5, stock >= 0)
- Status validation for orders and payments

### Privacy Protection
- Users can only access their own personal data
- Order information is restricted to the order owner and admins
- Payment details are secured and access-controlled

### Audit Trail
- All documents include createdAt and updatedAt timestamps
- Order status changes are tracked
- Payment transaction records are immutable

## Indian E-Commerce Specific Features

### Currency
- All prices stored in Indian Rupees (₹)
- GST calculation support in order totals
- Regional pricing support

### Compliance
- Data localization compliance
- GST number validation for business orders
- Indian address format support

## API Integration
All security rules are designed to work seamlessly with:
- Web application APIs
- Mobile application APIs
- Third-party integrations
- Admin dashboard tools

## Monitoring & Analytics
- Admin-only access to analytics data
- Order tracking and inventory management
- User behavior analytics (anonymized)
