import { useState, useEffect } from 'react';
import { AuthService } from '../../services/AuthService';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    // Verifica o estado de autenticação assim que o popup abre
    AuthService.isAuthenticated().then((result) => {
      setIsAuthenticated(result);
      setIsLoading(false);
    });
  }, []);

  const login = async (): Promise<void> => {
    setIsLoading(true);
    await AuthService.loginMock();
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}