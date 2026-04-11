import { describe, it, expect, vi } from 'vitest';
import { StorageService } from '../../src/services/StorageService';
import type { TokenSet } from '../../src/types/auth.types';

const mockTokenSet: TokenSet = {
  accessToken: 'access-123',
  refreshToken: 'refresh-456',
  idToken: 'id-789',
  expiresAt: Date.now() + 15 * 60 * 1000,
  userId: 'user-001',
  userEmail: 'test@storer.com.br',
  userDisplayName: 'Test User',
};

describe('StorageService', () => {
  describe('saveTokens', () => {
    it('deve salvar o access token na session storage', async () => {
      await StorageService.saveTokens(mockTokenSet);

      expect(chrome.storage.session.set).toHaveBeenCalledWith(
        expect.objectContaining({ access_token: 'access-123' })
      );
    });

    it('deve salvar o refresh token na local storage', async () => {
      await StorageService.saveTokens(mockTokenSet);

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({ refresh_token: 'refresh-456' })
      );
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar false quando não há tokens no storage', async () => {
      // Cast para any necessário porque o tipo do chrome.storage é muito restrito para mocks
      vi.mocked(chrome.storage.session.get).mockResolvedValue({} as any);

      const result = await StorageService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('deve retornar false quando o token está expirado', async () => {
      const tokenExpirado = { ...mockTokenSet, expiresAt: Date.now() - 1000 };
      vi.mocked(chrome.storage.session.get).mockResolvedValue({
        token_set: tokenExpirado,
      } as any);

      const result = await StorageService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('deve retornar true quando o token ainda é válido', async () => {
      vi.mocked(chrome.storage.session.get).mockResolvedValue({
        token_set: mockTokenSet,
      } as any);

      const result = await StorageService.isAuthenticated();

      expect(result).toBe(true);
    });
  });

  describe('getOfflineQueue', () => {
    it('deve retornar array vazio quando não há fila offline', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({} as any);

      const result = await StorageService.getOfflineQueue();

      expect(result).toEqual([]);
    });
  });
});