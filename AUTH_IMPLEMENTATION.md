# Authentication Implementation with Redux Toolkit

## Overview
This implementation includes signin and signup forms with Redux Toolkit for state management.

## Features
- ✅ Redux Toolkit store configuration
- ✅ Auth slice with signin/signup actions
- ✅ Modern, responsive signin form
- ✅ Modern, responsive signup form
- ✅ Form validation using Zod and React Hook Form
- ✅ Password visibility toggle
- ✅ Loading states
- ✅ Error handling
- ✅ Beautiful UI with shadcn/ui components

## File Structure
```
store/
├── store.ts                 # Redux store configuration
├── hooks.ts                 # Typed Redux hooks
└── slices/
    └── authSlice.ts        # Auth state and actions

components/
├── providers/
│   └── redux-provider.tsx  # Redux Provider wrapper
└── auth/
    ├── signin-form.tsx     # Sign in form component
    └── signup-form.tsx     # Sign up form component

app/
├── signin/
│   └── page.tsx           # Sign in page
└── signup/
    └── page.tsx           # Sign up page
```

## Redux Store Structure

### Auth State
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

### Available Actions
- `signInStart()` - Start signin process
- `signInSuccess(user)` - Signin successful
- `signInFailure(error)` - Signin failed
- `signUpStart()` - Start signup process
- `signUpSuccess(user)` - Signup successful
- `signUpFailure(error)` - Signup failed
- `signOut()` - Sign out user
- `clearError()` - Clear error message

## Usage

### Access Auth State
```typescript
import { useAppSelector } from '@/store/hooks';

const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
```

### Dispatch Actions
```typescript
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

const dispatch = useAppDispatch();
dispatch(signOut());
```

## Routes
- `/signin` - Sign in page
- `/signup` - Sign up page

## Form Validation

### Sign In
- Email: Valid email format required
- Password: Minimum 6 characters

### Sign Up
- Name: Minimum 2 characters
- Email: Valid email format required
- Password: Minimum 6 characters
- Confirm Password: Must match password
- Terms: Must accept terms and conditions

## Backend Integration

The forms are **already integrated** with your backend using Axios!

### Backend Configuration
- **Base URL**: `http://localhost:8000`
- **Login Endpoint**: `POST /user/login`
- **Register Endpoint**: `POST /user/register` (assumed)

### API Files
- `lib/axios.ts` - Axios instance with interceptors
- `lib/auth-api.ts` - Authentication API functions

### Expected API Response Format
Your backend should return responses in this format:

**Login Response** (`POST /user/login`):
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt-token-here"
}
```

**Register Response** (`POST /user/register`):
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt-token-here"
}
```

### Request Format
**Login Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register Request**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

### Token Management
- JWT tokens are automatically stored in `localStorage`
- Tokens are automatically attached to all API requests via Axios interceptors
- On 401 (Unauthorized) responses, users are redirected to `/signin`

## Persistence

To persist auth state across page refreshes, consider adding:
- Local storage middleware
- Session storage
- HTTP-only cookies (recommended for production)

Example with Redux Persist:
```bash
npm install redux-persist
```

## Security Best Practices
- Never store sensitive data in Redux state
- Use HTTP-only cookies for tokens
- Implement CSRF protection
- Use HTTPS in production
- Validate on both client and server
- Implement rate limiting for auth endpoints

## Next Steps
1. Create API endpoints for authentication
2. Add JWT token management
3. Implement protected routes
4. Add password reset functionality
5. Add email verification
6. Add OAuth providers (Google, GitHub, etc.)
