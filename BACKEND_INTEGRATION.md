# Backend Integration Guide

## ✅ What's Already Configured

Your authentication system is **fully integrated** with your backend at `http://localhost:8000`.

## 📁 Files Created

### Core Redux Files
- `store/store.ts` - Redux store configuration
- `store/hooks.ts` - Typed Redux hooks (useAppDispatch, useAppSelector)
- `store/slices/authSlice.ts` - Auth state management

### API Integration Files
- `lib/axios.ts` - Axios instance with interceptors and error handling
- `lib/auth-api.ts` - Authentication API functions (signInAPI, signUpAPI)

### UI Components
- `components/auth/signin-form.tsx` - Sign in form with validation
- `components/auth/signup-form.tsx` - Sign up form with validation
- `components/auth/user-menu.tsx` - User menu with sign out (example component)
- `components/providers/redux-provider.tsx` - Redux Provider wrapper

### Pages
- `app/signin/page.tsx` - Sign in page route
- `app/signup/page.tsx` - Sign up page route

## 🔌 Backend Endpoints

### Sign In
**Endpoint**: `POST http://localhost:8000/user/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response**:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt-token-string"
}
```

### Sign Up
**Endpoint**: `POST http://localhost:8000/user/register`

**Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response**:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt-token-string"
}
```

## 🔐 How It Works

### 1. User Submits Form
When a user submits the signin/signup form:
- Form data is validated using Zod schema
- Redux action `signInStart()` or `signUpStart()` is dispatched
- Loading state is set to `true`

### 2. API Call with Axios
- `signInAPI()` or `signUpAPI()` is called from `lib/auth-api.ts`
- Axios sends POST request to your backend
- Request includes proper headers and timeout (10 seconds)

### 3. Response Handling
**Success**:
- JWT token is stored in `localStorage`
- User data is stored in Redux state
- `signInSuccess(user)` or `signUpSuccess(user)` is dispatched
- User is redirected to home page

**Error**:
- Error message is extracted from response
- `signInFailure(error)` or `signUpFailure(error)` is dispatched
- Error is displayed in the form

### 4. Automatic Token Management
The Axios interceptor (`lib/axios.ts`) automatically:
- Attaches JWT token to all subsequent API requests
- Handles 401 (Unauthorized) responses by redirecting to `/signin`
- Clears token on sign out

## 🚀 Testing the Integration

### 1. Start Your Backend
```bash
# Make sure your backend is running on localhost:8000
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Test Sign In
1. Navigate to `http://localhost:3000/signin`
2. Enter credentials
3. Check browser console for API calls
4. Check Network tab in DevTools

### 4. Test Sign Up
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form
3. Submit and verify API call

## 🛠️ Customization

### Change Backend URL
Edit `lib/axios.ts`:
```typescript
const api = axios.create({
  baseURL: 'http://your-backend-url:port',
  // ...
});
```

### Change Endpoints
Edit `lib/auth-api.ts`:
```typescript
// Change login endpoint
export const signInAPI = async (credentials: SignInRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/your/custom/login', credentials);
  // ...
};

// Change register endpoint
export const signUpAPI = async (userData: SignUpRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/your/custom/register', userData);
  // ...
};
```

### Adjust Response Format
If your backend returns a different format, update the interfaces in `lib/auth-api.ts`:
```typescript
export interface AuthResponse {
  user: User;
  token: string;
  // Add any additional fields your backend returns
}
```

## 📊 Using Auth State in Components

### Check if User is Authenticated
```typescript
import { useAppSelector } from '@/store/hooks';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Sign Out
```typescript
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

function SignOutButton() {
  const dispatch = useAppDispatch();
  
  const handleSignOut = () => {
    dispatch(signOut());
    // Token is automatically cleared from localStorage
  };
  
  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

### Protected Routes
Create a wrapper component:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

## 🔍 Debugging

### Check API Calls
Open browser DevTools → Network tab:
- Look for requests to `localhost:8000/user/login` or `/user/register`
- Check request payload and response
- Verify status codes (200 = success, 401 = unauthorized, etc.)

### Check Redux State
Install Redux DevTools extension:
- View current auth state
- See dispatched actions
- Time-travel through state changes

### Check Token Storage
Open browser DevTools → Application tab → Local Storage:
- Look for `authToken` key
- Verify token is stored after successful login

### Common Issues

**CORS Errors**:
- Your backend needs to allow requests from `http://localhost:3000`
- Add CORS headers to your backend

**Network Errors**:
- Verify backend is running on `localhost:8000`
- Check firewall settings

**401 Errors**:
- Verify credentials are correct
- Check backend authentication logic

## 📝 Example: Adding User Menu to Navbar

You can use the `UserMenu` component in your navbar:

```typescript
import { UserMenu } from '@/components/auth/user-menu';

export default function Navbar() {
  return (
    <nav>
      {/* Other navbar items */}
      <UserMenu />
    </nav>
  );
}
```

This will show:
- Sign In/Sign Up buttons when not authenticated
- User avatar with dropdown menu when authenticated
- Sign out option in the dropdown

## 🎯 Next Steps

1. **Test the integration** with your backend
2. **Adjust response format** if needed
3. **Add protected routes** for authenticated-only pages
4. **Implement token refresh** if using refresh tokens
5. **Add password reset** functionality
6. **Add email verification** if required
7. **Consider using HTTP-only cookies** instead of localStorage for production
