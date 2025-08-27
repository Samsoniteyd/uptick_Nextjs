// components/ProtectedRoute.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
        router.push('/login');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoadingUser, router]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}