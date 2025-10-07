import api from './axios';
import { User } from '@/store/slices/authSlice';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

// Admin login request (uses username instead of email)
export interface AdminSignInRequest {
  username: string;
  password: string;
}

// Admin login response (only returns access_token)
export interface AdminAuthResponse {
  access_token: {
    access_token: string;
  };
}

// User login response
export interface UserAuthResponse {
  access_token: {
    access_token: string;
  };
  user: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Sign in API call
export const signInAPI = async (credentials: SignInRequest): Promise<AuthResponse> => {
  if(credentials.email === "muhammadrizwaneng@gmail.com"){
    // Admin login - convert email to username for admin endpoint
    const adminCredentials: AdminSignInRequest = {
      username: credentials.email,
      password: credentials.password
    };
    const response = await api.post<AdminAuthResponse>('/admin/login', adminCredentials);
    
    if (response?.data?.access_token?.access_token) {
      localStorage.setItem('authToken', response.data.access_token.access_token);
    }
    
    console.log("0-0-0-0response-",response)
    // Transform admin response to match AuthResponse format
    return {
      token: response.data.access_token.access_token,
      user: {
        id: 'admin',
        email: credentials.email,
        name: 'Admin',
        user: response.data.user
      } as User
    };
  } else {
    // User login
    const response = await api.post<UserAuthResponse>('/user/login', credentials);
    
    if (response?.data?.access_token?.access_token) {
      localStorage.setItem('authToken', response.data.access_token.access_token);
    }
    
    // Transform user response to match AuthResponse format
    return {
      token: response.data.access_token.access_token,
      user: response.data.user
    };
  }
};

// Sign up API call
export const signUpAPI = async (userData: SignUpRequest): Promise<AuthResponse> => {
    let response = ""
    if(userData?.email === "muhammadrizwaneng@gmail.com"){
      // @ts-ignore
      response = await api.post<AuthResponse>('/admin/register', userData);
    } else {
      // @ts-ignore
      response = await api.post<AuthResponse>('/user/register', userData);
    }
  
  // Store token in localStorage
  if (response?.data?.access_token?.access_token) {
    localStorage.setItem('authToken', response?.data?.access_token?.access_token);
  }
  
  return response.data;
};

// Sign out
export const signOutAPI = () => {
  localStorage.removeItem('authToken');
};
