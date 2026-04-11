import { useState, useEffect } from 'react';
import { AuthService } from '../../services/AuthService';

// Esse hook encapsula todo o estado de autenticação da aplicação.
// Qualquer componente que precisar saber se o usuário está logado usa esse hook.
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // começa true para evitar flash de tela errada

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