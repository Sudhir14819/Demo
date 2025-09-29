# Authentication System Documentation

## Overview
This e-commerce platform uses JWT-based authentication with Firebase backend integration. All user sessions are managed with secure token storage and role-based permissions.

## Architecture

### Token-Based Authentication
- **JWT Tokens**: Generated server-side with user permissions
- **Session Storage**: Tokens stored in sessionStorage for security
- **Auto-Expiry**: Sessions expire when browser closes
- **Permission System**: Role-based access control (RBAC)

### User Roles & Permissions

#### Customer (user)
- `user:view_products` - Browse product catalog
- `user:create_order` - Place orders
- `user:view_own_orders` - View order history
- `user:manage_cart` - Add/remove cart items

#### Administrator (admin)
- All user permissions plus:
- `admin:manage_products` - CRUD operations on products
- `admin:manage_orders` - View/update all orders
- `admin:manage_users` - User management
- `admin:view_analytics` - Access dashboard analytics
- `admin:manage_inventory` - Inventory management

## API Endpoints

### Authentication
\`\`\`
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/logout
\`\`\`

### Protected Routes
All API routes require Bearer token authentication:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Frontend Integration

### Auth Context Usage
\`\`\`typescript
const { user, token, permissions, isAuthenticated, logout } = useAuth()
\`\`\`

### Token Display Component
- Shows current session information
- Displays user permissions
- Allows token copying for API testing
- Security information display

## Security Features

1. **Session Storage**: More secure than localStorage
2. **Token Expiration**: 24-hour token lifetime
3. **Permission Validation**: Server-side permission checks
4. **Firebase Integration**: Secure user management
5. **HTTPS Only**: Production tokens require HTTPS

## Currency & Localization
- **Currency**: Indian Rupees (₹)
- **GST Integration**: Built-in tax calculations
- **Indian Address Format**: Pincode, state validation

## Design Theme
- **Primary**: Golden Yellow (#F5D916)
- **Secondary**: Fresh Green (#4ADE80)
- **Accent**: Lime (#84CC16)
- **Background**: Warm cream tones
- **Professional**: E-commerce optimized color palette

## Mobile App Integration
The same JWT tokens work across platforms:
- Web application
- React Native mobile apps
- API integrations
- Third-party services

## Development Notes
- Use `TokenDisplay` component for debugging
- Check permissions before rendering admin features
- Always handle token expiration gracefully
- Test logout functionality across all platforms
