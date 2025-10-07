# 🚀 Quick Start - Authentication System

## ✅ What's Been Implemented

Your SmartShop app now has a **complete authentication system** with:
- ✅ Redux Toolkit for state management
- ✅ Axios integration with your backend (`localhost:8000`)
- ✅ Beautiful signin and signup forms
- ✅ Form validation (Zod + React Hook Form)
- ✅ Automatic token management
- ✅ Error handling and loading states

## 🎯 Quick Test

### 1. Make sure your backend is running
```bash
# Your backend should be running on localhost:8000
```

### 2. Start the frontend
```bash
npm run dev
```

### 3. Visit the auth pages
- **Sign In**: http://localhost:3000/signin
- **Sign Up**: http://localhost:3000/signup

## 📋 Backend Requirements

Your backend at `localhost:8000` should have these endpoints:

### POST /user/login
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

### POST /user/register
**Request**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

## 🔧 Configuration

If your backend URL is different, create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url:port
```

## 📚 Key Files

| File | Purpose |
|------|---------|
| `store/store.ts` | Redux store configuration |
| `store/slices/authSlice.ts` | Auth state management |
| `lib/axios.ts` | Axios instance with interceptors |
| `lib/auth-api.ts` | API functions for auth |
| `components/auth/signin-form.tsx` | Sign in form |
| `components/auth/signup-form.tsx` | Sign up form |
| `app/signin/page.tsx` | Sign in page |
| `app/signup/page.tsx` | Sign up page |

## 💡 Usage Examples

### Check if user is authenticated
```typescript
import { useAppSelector } from '@/store/hooks';

function MyComponent() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  return isAuthenticated ? (
    <div>Welcome, {user?.name}!</div>
  ) : (
    <div>Please sign in</div>
  );
}
```

### Sign out
```typescript
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

function SignOutButton() {
  const dispatch = useAppDispatch();
  
  return (
    <button onClick={() => dispatch(signOut())}>
      Sign Out
    </button>
  );
}
```

## 🐛 Troubleshooting

### CORS Error?
Your backend needs to allow requests from `http://localhost:3000`. Add CORS headers.

### Network Error?
- Verify backend is running on `localhost:8000`
- Check the browser console for errors
- Check Network tab in DevTools

### 401 Unauthorized?
- Verify your credentials are correct
- Check backend authentication logic
- Ensure backend is returning the correct response format

## 📖 More Documentation

- `AUTH_IMPLEMENTATION.md` - Detailed implementation guide
- `BACKEND_INTEGRATION.md` - Complete backend integration guide
- `.env.example` - Environment variable template

## 🎉 You're Ready!

Your authentication system is fully set up and ready to use. Just make sure your backend is running and returning the expected response format!
