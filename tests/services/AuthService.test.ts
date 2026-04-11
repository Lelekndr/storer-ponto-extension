import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../../src/services/AuthService';
import { StorageService } from '../../src/services/StorageService';

describe('AuthService', () => {
  describe('loginMock', () => {
    it('deve salvar os tokens no storage após o login', async () => {
      // Arrange
      const saveSpy = vi.spyOn(StorageService, 'saveTokens').mockResolvedValue(undefined);

      // Act
      await AuthService.loginMock();

      // Assert
      expect(saveSpy).toHaveBeenCalledOnce();
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
          userEmail: 'colaborador@storer.com.br',
          userDisplayName: 'Teste',
        })
      );
    });

    it('deve gerar um token com expiração futura', async () => {
      // Arrange
      vi.spyOn(StorageService, 'saveTokens').mockResolvedValue(undefined);

      // Act
      await AuthService.loginMock();

      // Assert — captura o que foi passado para saveTokens e verifica o expiresAt
      const chamada = vi.mocked(StorageService.saveTokens).mock.calls[0][0];
      expect(chamada.expiresAt).toBeGreaterThan(Date.now());
    });
  });

  describe('logout', () => {
    it('deve limpar os tokens do storage ao fazer logout', async () => {
      // Arrange
      const clearSpy = vi.spyOn(StorageService, 'clearTokens').mockResolvedValue(undefined);

      // Act
      await AuthService.logout();

      // Assert
      expect(clearSpy).toHaveBeenCalledOnce();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar false quando não há tokens', async () => {
      // Arrange
      vi.spyOn(StorageService, 'isAuthenticated').mockResolvedValue(false);

      // Act
      const result = await AuthService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar true quando há tokens válidos', async () => {
      // Arrange
      vi.spyOn(StorageService, 'isAuthenticated').mockResolvedValue(true);

      // Act
      const result = await AuthService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });
  });
});