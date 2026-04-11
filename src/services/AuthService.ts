import type { TokenSet } from '../types/auth.types';
import { StorageService } from './StorageService';

export class AuthService {
  // Simula um login bem-sucedido sem precisar do Zitadel.
  // Em produção, aqui entraria o fluxo PKCE real com redirecionamento para o Zitadel.
  static async loginMock(): Promise<void> {
    const mockTokenSet: TokenSet = {
      accessToken: 'mock-access-token-123',
      refreshToken: 'mock-refresh-token-456',
      idToken: 'mock-id-token-789',
      // Token "expira" daqui a 15 minutos — comportamento real do Zitadel
      expiresAt: Date.now() + 15 * 60 * 1000,
      userId: 'user-001',
      userEmail: 'colaborador@storer.com.br',
      userDisplayName: 'Teste',
      userAvatarUrl: undefined,
    };

    await StorageService.saveTokens(mockTokenSet);
  }

  static async logout(): Promise<void> {
    // Em produção, aqui chamaria o endpoint de revogação do Zitadel antes de limpar
    await StorageService.clearTokens();
  }

  static async isAuthenticated(): Promise<boolean> {
    return StorageService.isAuthenticated();
  }

  static async getCurrentUser(): Promise<Pick<TokenSet, 'userDisplayName' | 'userEmail' | 'userAvatarUrl'> | null> {
    const tokens = await StorageService.getTokens();
    if (!tokens) return null;
    return {
      userDisplayName: tokens.userDisplayName,
      userEmail: tokens.userEmail,
      userAvatarUrl: tokens.userAvatarUrl,
    };
  }
}