import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthUser } from '@/lib/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout: authService.logout
  };
};

export default useAuth;
