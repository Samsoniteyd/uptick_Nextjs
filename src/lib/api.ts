import api from './axios';
import { User, ApiResponse } from '../types';



export const fetchUsers = async (): Promise<User[]> => {
 
  try {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/api/users');
    return response.data.data?.users || [];
  } catch (error) {
    console.warn('Users endpoint not available, returning empty array');
    return [];
  }
};

export const createUser = async (userData: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/register', userData);
  return response.data.data!.user;
};

export const updateUser = async (userData: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}): Promise<User> => {
  const { id, ...updateData } = userData;
  const response = await api.put<ApiResponse<{ user: User }>>('/api/auth/profile', updateData);
  return response.data.data!.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete('/api/auth/profile');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/profile');
  return response.data.data!.user;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>(`/api/users/${userId}`);
  return response.data.data!.user;
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put('/api/auth/change-password', passwordData);
};

export const resetPassword = async (email: string): Promise<void> => {
  await api.post('/api/auth/forgot-password', { email });
}; 