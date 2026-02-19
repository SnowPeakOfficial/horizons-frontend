# 🔐 Authentication Setup Guide

This guide will help you set up the authentication flow between the frontend and backend.

---

## 📋 Prerequisites

- **Backend**: Running at `http://localhost:3000`
- **Frontend**: Will run at `http://localhost:5173`
- **Node.js**: v18+ installed
- **npm**: Latest version

---

## 🚀 Quick Start

### 1. **Environment Configuration**

```bash
# Navigate to the web app directory
cd apps/web

# Copy the example environment file
cp .env.example .env

# The .env file is already configured for localhost:3000
```

**Default .env values:**

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Horizons
VITE_APP_URL=http://localhost:5173
```

### 2. **Install Dependencies**

```bash
# From the root directory
npm install

# Or from apps/web directory
cd apps/web && npm install
```

### 3. **Start the Development Server**

```bash
# From apps/web directory
npm run dev

# The app will be available at http://localhost:5173
```

---

## 🔌 Backend API Endpoints

The frontend expects the following endpoints to be available:

### **Authentication**

- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Sign in
- `GET /api/v1/users/me` - Get current user profile

### **Request/Response Format**

#### **Login Request**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

#### **Register Request**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "yourPassword123",
  "timezone": "America/Toronto"
}
```

#### **Auth Response**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "timezone": "America/Toronto",
    "tier": "FREE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

---

## 🔒 Authentication Flow

### **How It Works**

1. **User Registration/Login**
   - User submits credentials via LoginPage or RegisterPage
   - Frontend sends POST request to backend
   - Backend validates and returns JWT token + user data

2. **Token Storage**
   - Access token stored in `localStorage` as `horizons_access_token`
   - User data stored in `localStorage` as `horizons_user`
   - Zustand store manages auth state in memory

3. **Authenticated Requests**
   - API interceptor automatically adds `Authorization: Bearer <token>` header
   - All requests to protected endpoints include the token

4. **Token Expiration**
   - 401 response triggers automatic logout
   - User redirected to login page
   - Local storage cleared

---

## 🛡️ Security Features

### **Built-in Protection**

✅ **Email Validation** - RFC 5322 compliant email format check
✅ **Password Requirements** - Min 6 chars, mixed case letters required
✅ **Input Sanitization** - Trimmed whitespace, XSS prevention
✅ **Error Handling** - Specific error messages without leaking info
✅ **Network Error Handling** - Graceful degradation when backend offline
✅ **Auto-logout on 401** - Expired/invalid tokens handled automatically
✅ **Timezone Detection** - Auto-detects user timezone during registration

### **Password Requirements**

Registration enforces:

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- Passwords must match (confirmation field)

---

## 📝 Testing the Auth Flow

### **Manual Testing Steps**

#### **1. Test Registration**

```bash
# Start backend on port 3000
# Start frontend on port 5173
# Navigate to http://localhost:5173/auth/register

# Fill in the form:
Name: Test User
Email: test@example.com
Password: TestPass123
Confirm: TestPass123

# Submit and check:
✓ Console logs registration attempt
✓ Toast notification appears
✓ Redirects to /dashboard on success
✓ Token stored in localStorage
```

#### **2. Test Login**

```bash
# Navigate to http://localhost:5173/auth/login

# Use registered credentials:
Email: test@example.com
Password: TestPass123

# Submit and check:
✓ Console logs login attempt
✓ Success toast appears
✓ Redirects to /dashboard
✓ Token stored in localStorage
```

#### **3. Test Protected Routes**

```bash
# Without logging in, try to access:
http://localhost:5173/dashboard

# Should redirect to /auth/login
# After login, should access dashboard successfully
```

#### **4. Test Logout**

```bash
# From dashboard, click logout
# Should:
✓ Clear localStorage
✓ Redirect to /auth/login
✓ Cannot access /dashboard anymore
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **❌ "Cannot connect to server"**

**Solution:**

- Ensure backend is running on `http://localhost:3000`
- Check `.env` file has correct `VITE_API_URL`
- Verify backend API path is `/api/v1/auth/...`

#### **❌ "CORS Error"**

**Solution:**

- Backend must allow `http://localhost:5173` origin
- Check backend CORS configuration
- Ensure credentials: 'include' if using cookies

#### **❌ "401 Unauthorized"**

**Solution:**

- Invalid credentials
- Token expired - try logging in again
- Check backend JWT configuration

#### **❌ "Network Error"**

**Solution:**

- Backend not running
- Check backend port (should be 3000)
- Check firewall settings

---

## 🔍 Debug Mode

### **Console Logging**

The auth flow includes helpful console logs:

```javascript
// API Service
🌐 API Base URL: http://localhost:3000/api/v1

// Login
🔐 Attempting login for: user@example.com

// Registration
📝 Attempting registration for: user@example.com

// Errors
❌ Login error: { statusCode: 401, message: "..." }
❌ Network error: Cannot connect to server
```

### **View in DevTools**

```javascript
// Check localStorage
localStorage.getItem("horizons_access_token");
localStorage.getItem("horizons_user");

// Check auth state (React DevTools)
// Look for useAuthStore hook state
```

---

## 📚 Code Structure

### **Key Files**

```
apps/web/src/
├── services/
│   ├── api.ts              # Axios instance + interceptors
│   └── authService.ts      # Auth API calls
├── stores/
│   └── authStore.ts        # Zustand auth state
├── pages/auth/
│   ├── LoginPage.tsx       # Login form
│   └── RegisterPage.tsx    # Registration form
├── components/auth/
│   ├── ProtectedRoute.tsx  # Auth-required routes
│   └── GuestRoute.tsx      # Guest-only routes
└── types/
    └── api.types.ts        # TypeScript types
```

### **State Management Flow**

```
User Action (LoginPage)
    ↓
authStore.login()
    ↓
authService.login()
    ↓
API POST /auth/login
    ↓
Store token + user in localStorage
    ↓
Update Zustand state
    ↓
Navigate to /dashboard
```

---

## 🔧 Configuration Options

### **API Timeout**

```typescript
// apps/web/src/services/api.ts
const API_TIMEOUT = 30000; // 30 seconds
```

### **Token Storage Key**

```typescript
// Change if needed
localStorage.setItem("horizons_access_token", token);
localStorage.setItem("horizons_user", JSON.stringify(user));
```

### **Redirect URLs**

```typescript
// LoginPage.tsx & RegisterPage.tsx
navigate("/dashboard"); // Change redirect after login
```

---

## ✅ Production Checklist

Before deploying:

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Remove console.log statements (or use env-based logging)
- [ ] Implement refresh token logic
- [ ] Add rate limiting on frontend
- [ ] Implement "Remember Me" option
- [ ] Add email verification flow
- [ ] Add password reset flow
- [ ] Enable HTTPS only
- [ ] Add CSRF protection
- [ ] Implement session timeout warnings
- [ ] Add 2FA support (if needed)

---

## 🤝 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify backend logs
4. Review this documentation
5. Check backend API documentation

---

**Last Updated:** February 7, 2026
**Version:** 1.0.0
