import api from './axios';
import { User, ApiResponse } from '../types';

class UserService {
  fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<{ users: User[] }>>('/api/users');
      return response.data.data?.users || [];
    } catch (error: any) {
      console.error('❌ Fetch users failed:', error);
      throw new Error('Could not fetch users. Please check your backend.');
    }
  };

  createUser = async (userData: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
  }): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/register', userData);
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Create user failed:', error);
      throw new Error('Could not create user. Please check input and try again.');
    }
  };

  updateUser = async (userData: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<User> => {
    try {
      const { id, ...updateData } = userData;
      const response = await api.put<ApiResponse<{ user: User }>>(`/api/users/${id}`, updateData);
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Update user failed:', error);
      throw new Error('Could not update user. Please check input and try again.');
    }
  };

  deleteUser = async (userId: string): Promise<void> => {
    try {
      await api.delete(`/api/users/${userId}`);
    } catch (error: any) {
      console.error('❌ Delete user failed:', error);
      throw new Error('Could not delete user. Please try again.');
    }
  };

  getUserById = async (userId: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>(`/api/users/${userId}`);
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Get user by ID failed:', error);
      throw new Error('Could not fetch user. Please check the ID and try again.');
    }
  };
}

export default new UserService();
