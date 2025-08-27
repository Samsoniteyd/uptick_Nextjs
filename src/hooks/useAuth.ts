import { useState, useEffect, useCallback } from 'react';
import authService from '@/lib/auth.service';
import { RegisterData, LoginData, User } from '@/types';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [userError, setUserError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [updateProfileError, setUpdateProfileError] = useState<Error | null>(null);

  // Centralized toast handlers
  const handleSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, { description, duration: 3000 });
  }, []);

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : defaultMessage;

    toast.error('Error occurred', { description: errorMessage, duration: 5000 });
    return errorMessage;
  }, []);

  // Fetch current user on mount if authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) return;

    const fetchUser = async () => {
      setIsLoadingUser(true);
      setUserError(null);

      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
           if (error instanceof Error) {
     setUserError(error.message);}
        
        const msg = handleError(error, 'Failed to fetch user');

        if ((error as Error).message.toLowerCase().includes('unauthorized')) {
          toast.error('Session expired', { description: 'Please login again' });
          authService.logout();
          setUser(null);
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [handleError]);

  // Register user
  const register = useCallback(async (data: RegisterData) => {
    setIsRegistering(true);
    setRegisterError(null);

    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      handleSuccess('Welcome!', 'Account created successfully');
      return response;
    } catch (error) {
         if (error instanceof Error) {
     setRegisterError(error.message);}
     
      handleError(error, 'Failed to create account');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [handleSuccess, handleError]);

  // Login user
  const login = useCallback(async (data: LoginData) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await authService.login(data);
      setUser(response.data.user);
      handleSuccess('Welcome back!', 'You have successfully logged in');
      return response;
    } catch (error) {
     if (error instanceof Error) {
    setLoginError(error.message);}
      handleError(error, 'Login failed');
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, [handleSuccess, handleError]);

  // Update profile
  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    setIsUpdatingProfile(true);
    setUpdateProfileError(null);

    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      handleSuccess('Profile Updated', 'Your profile has been updated successfully');
      return updatedUser;
    } catch (error) {
      setUpdateProfileError(error as Error);
      handleError(error, 'Failed to update profile');
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  }, [handleSuccess, handleError]);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);

    toast.success('Logout Successful', {
      description: 'You have been logged out',
      duration: 2000,
      action: {
        label: 'Login again',
        onClick: () => window.location.href = '/login',
      },
    });
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoadingUser,
    userError,

    register,
    login,
    logout,
    updateProfile,

    isRegistering,
    isLoggingIn,
    isUpdatingProfile,

    registerError,
    loginError,
    updateProfileError,
  };
};
