import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../../src/services/HttpClient';
import { StorageService } from '../../src/services/StorageService';

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient('http://localhost:3001');
    vi.spyOn(StorageService, 'getTokens').mockResolvedValue(null);
  });

  describe('request', () => {
    it('deve retornar os dados quando a API responde com sucesso', async () => {
      // Arrange
      const mockData = { id: '1', tipo: 'ENTRADA', timestamp: '2026-04-10T08:00:00Z' };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response));

      // Act
      const result = await client.request({ method: 'GET', path: '/v1/ponto/batidas' });

      // Assert
      expect(result).toEqual(mockData);
    });

    it('deve incluir o Authorization header quando há token', async () => {
      // Arrange
      vi.spyOn(StorageService, 'getTokens').mockResolvedValue({
        accessToken: 'token-abc',
        refreshToken: '',
        idToken: '',
        expiresAt: Date.now() + 60000,
        userId: '1',
        userEmail: 'test@test.com',
        userDisplayName: 'Test',
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response));

      // Act
      await client.request({ method: 'GET', path: '/v1/ponto/batidas' });

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token-abc',
          }),
        })
      );
    });

    it('deve tentar 3 vezes antes de desistir quando a API falha', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      // Act & Assert
      await expect(
        client.request({ method: 'GET', path: '/v1/ponto/batidas' })
      ).rejects.toThrow('Network error');

      // Verifica que tentou exatamente 3 vezes — conforme MAX_RETRIES do HttpClient
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('deve limpar os tokens e lançar erro quando a API retorna 401', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      } as Response));
      const clearSpy = vi.spyOn(StorageService, 'clearTokens').mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        client.request({ method: 'GET', path: '/v1/ponto/batidas' })
      ).rejects.toThrow('Sessão expirada');

      expect(clearSpy).toHaveBeenCalledOnce();
    });
  });
});