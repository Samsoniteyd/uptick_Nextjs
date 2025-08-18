import { useState, useEffect, useCallback } from 'react';
import authService from '@/lib/auth.service';
import { RegisterData, LoginData, User } from '@/types';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isUserError, setIsUserError] = useState(false);
  const [userError, setUserError] = useState<Error | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [registerError, setRegisterError] = useState<Error | null>(null);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [updateProfileError, setUpdateProfileError] = useState<Error | null>(null);

  const handleSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }, []);

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string'
      ? error
      : defaultMessage;

    toast.error('Error occurred', {
      description: errorMessage,
      duration: 5000,
    });

    return errorMessage;
  }, []);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const fetchUser = async () => {
        setIsLoadingUser(true);
        setIsUserError(false);
        setUserError(null);
        
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          setIsUserError(true);
          setUserError(error as Error);
          handleError(error, 'Failed to fetch user');
          
          if ((error as Error).message.includes('Unauthorized')) {
            toast.error('Session expired', {
              description: 'Please login again to continue',
            });
            authService.logout();
            setUser(null);
          }
        } finally {
          setIsLoadingUser(false);
        }
      };

      fetchUser();
    }
  }, [handleError]);

  const register = useCallback(async (registerData: RegisterData) => {
    setIsRegistering(true);
    setRegisterError(null);
    
    try {
      const response = await authService.register(registerData);
      setUser(response.data.user);
      handleSuccess('Welcome!', 'Account created successfully');
      return response;
    } catch (error) {
      setRegisterError(error as Error);
      handleError(error, 'Failed to create account');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [handleSuccess, handleError]);

  const login = useCallback(async (loginData: LoginData) => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const response = await authService.login(loginData);
      setUser(response.data.user);
      handleSuccess('Welcome back!', 'You have successfully logged in');
      return response;
    } catch (error) {
      const errorMessage = handleError(error, 'Login failed');
      setLoginError(error as Error);
      
      if (errorMessage.toLowerCase().includes('invalid credentials') || 
          errorMessage.toLowerCase().includes('email or password')) {
      }
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, [handleSuccess, handleError]);

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

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    
    toast.success('Logout Successful', {
      description: 'You have been logged out successfully',
      duration: 2000,
      action: {
        label: 'Login again',
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
    });

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }, 2000);
  }, []);

  return {
    user,
    isLoadingUser,
    isUserError,
    userError,
    isAuthenticated: !!user,
    
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