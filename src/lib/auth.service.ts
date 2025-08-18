import api, { authApi } from './axios';
import Cookies from 'js-cookie';
import { RegisterData, LoginData, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Starting registration...');
      console.log('📤 Sending to:', `${authApi.defaults.baseURL}/api/auth/register`);
      
      const response = await authApi.post<AuthResponse>('/api/auth/register', data);
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log('✅ Registration successful');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const handledError = this.handleAuthError(error, 'Registration');
      throw handledError;
    }
  }

  login = async (data: LoginData): Promise<AuthResponse> => {
    try {
    const response = await authApi.post<AuthResponse>('/api/auth/login', {
        email: data.email?.trim(),
        password: data.password
      });
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log('✅ Login successful');
      }
      
      return response.data;
    } catch (error: any) {
     
      
      const handledError = this.handleAuthError(error, 'Login');
      console.error('❌ Handled error:', handledError.message);
      throw handledError;
    }
  }

  private handleAuthError = (error: any, operation: string): Error => {
    console.log('🔍 Handling auth error for:', operation);
    console.log('🔍 Error object:', error);
    console.log('🔍 Error.response:', error.response);
    console.log('🔍 Error.code:', error.code);
    console.log('🔍 Error.message:', error.message);

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new Error('Request timed out. Your backend might be slow or unresponsive. Please try again.');
    }

    if (error.type === 'TIMEOUT_ERROR' || error.status === 'timeout') {
      return new Error('Request timed out. Your backend might be slow or unresponsive. Please try again.');
    }

    if (!error.response || error.type === 'NETWORK_ERROR' || error.status === 'no_response') {
      return new Error('Cannot connect to server. Please check if your backend is running on the correct port.');
    }

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      const message = responseData?.message || responseData?.error || responseData?.details;

      console.log('🔍 HTTP Error - Status:', status);
      console.log('🔍 HTTP Error - Message:', message);

      switch (status) {
        case 400:
          return new Error(message || 'Invalid request. Please check your input.');
        
        case 401:
          if (operation === 'Login') {
            return new Error('Invalid email or password. Please check your credentials.');
          }
          return new Error(message || 'Authentication failed.');
        
        case 403:
          return new Error('Access denied. You do not have permission to perform this action.');
        
        case 404:
          return new Error(`${operation} endpoint not found. Please check your backend configuration.`);
        
        case 422:
          return new Error(message || 'Validation failed. Please check your input.');
        
        case 429:
          return new Error('Too many requests. Please wait a moment and try again.');
        
        case 500:
          return new Error('Internal server error. Please try again later.');
        
        case 502:
          return new Error('Bad gateway. The server is temporarily unavailable.');
        
        case 503:
          return new Error('Service unavailable. Please try again later.');
        
        default:
          return new Error(message || `${operation} failed. Please try again.`);
      }
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error(`${operation} failed. Please check your connection and try again.`);
  }

  logout = (): void => {
    console.log('🚪 Logging out...');
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  getProfile = async (): Promise<User> => {
    try {
      console.log('👤 Fetching user profile...');
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/profile');
      console.log('✅ Profile fetched successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      
      if (error.response?.status === 401) {
        this.logout();
      }
      
      throw this.handleAuthError(error, 'Profile fetch');
    }
  }

  updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      console.log('📝 Updating profile...');
      const response = await api.put<ApiResponse<{ user: User }>>('/api/auth/profile', data);
      console.log('✅ Profile updated successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw this.handleAuthError(error, 'Profile update');
    }
  }

  deleteProfile = async (): Promise<void> => {
    try {
      console.log('🗑️ Deleting profile...');
      await api.delete('/api/auth/profile');
      console.log('✅ Profile deleted successfully');
      this.logout();
    } catch (error: any) {
      console.error('❌ Delete profile error:', error);
      throw this.handleAuthError(error, 'Profile deletion');
    }
  }

  isAuthenticated = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  }

  getToken = (): string | null => {
    return Cookies.get('token') || null;
  }
}

export default new AuthService();