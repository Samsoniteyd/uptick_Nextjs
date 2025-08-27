import api from './axios';
import { User, ApiResponse, CreateUserData } from '../types';



export const fetchUsers = async (): Promise<User[]> => {
 
  try {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data.data?.users || [];
  } catch (error) {
    console.warn('Users endpoint not available, returning empty array');
    return [];
  }
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
    try{
 const response = await api.post<ApiResponse<{ user: User }>>('/api/user', userData);
  return response.data.data!.user;
    }catch(error){
   console.error('Error creating user:', error);
    throw error; 

    }
 
};

export const updateUser = async (id: string, userData:Partial<CreateUserData>): Promise<User> => {
      try{
        
  const response = await api.put<ApiResponse<{ user: User }>>('/api/user/${id}', userData);
  return response.data.data!.user;

    }catch(error){
       console.error('Error updating user:', error);
    throw error; 

    }
  
};

export const deleteUser = async (userId: string): Promise<boolean> => {
     try{
       await api.delete('/users/${userId}');
       return true;

    }catch(error){
    console.error(`Error deleting user ${userId}:`, error);
    return false;

    }
};

export const getCurrentUser = async (): Promise<User | null> => {

    try{
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
  return response.data.data!.user;
    }catch(error){
            console.error('Error fetching current user:', error);

        return null;
    }

  
};

export const getUserById = async (userId: string): Promise<User | null> => {
  
  try{
  const response = await api.get<ApiResponse<{ user: User }>>(`/users/${userId}`);
  return response.data.data!.user;
  }catch(error){
    
    return null;

  }
  
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<boolean> => {
    try{
  await api.put('/auth/change-password', passwordData);
return true;
    }catch (error){
            console.error('Error changing password:', error);

        return false;
    }
};

export const resetPassword = async (email: string): Promise<boolean> => {
    try{
  await api.post('/auth/forgot-password', { email });
  return true;
    }catch(error){
    console.error('Error resetting password:', error);
  return false;
    }
}; 