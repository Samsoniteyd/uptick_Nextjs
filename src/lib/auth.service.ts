import api, { authApi } from './axios';
import Cookies from 'js-cookie';
import { RegisterData, LoginData, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/api/auth/register', data);

      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error, 'Registration');
    }
  };

  login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/api/auth/login', {
        email: data.email?.trim(),
        password: data.password,
      });

      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error, 'Login');
    }
  };

  getProfile = async (): Promise<User> => {
    try {
 console.log('Fetching user profile from /api/profile/profile');

      const response = await api.get<ApiResponse<{ user: User }>>('/api/profile');
     console.log('response', response)
      return response.data.data!.user;
    } catch (error: any) {
      if (error.response?.status === 401) this.logout();
      throw this.handleAuthError(error, 'Profile fetch');
    }
  };

  updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<{ user: User }>>('/api/auth/profile', data);
      return response.data.data!.user;
    } catch (error: any) {
      throw this.handleAuthError(error, 'Profile update');
    }
  };

  deleteProfile = async (): Promise<void> => {
    try {
      await api.delete('/api/auth/profile');
      this.logout();
    } catch (error: any) {
      throw this.handleAuthError(error, 'Profile deletion');
    }
  };

  logout = (): void => {
    Cookies.remove('token');
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  isAuthenticated = (): boolean => !!Cookies.get('token');
  getToken = (): string | null => Cookies.get('token') || null;

  private handleAuthError(error: any, operation: string): Error {
    if (!error.response) return new Error(`${operation} failed. Cannot reach server.`);
    const message = error.response.data?.message || error.response.data?.error || `${operation} failed.`;
    return new Error(message);
  }
}

export default new AuthService();
