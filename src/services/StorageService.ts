import type { TokenSet } from '../types/auth.types';
import type { Batida } from '../types/ponto.types';
import type { ExtensionConfig } from '../types/config.types';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  TOKEN_SET: 'token_set',
  REFRESH_TOKEN: 'refresh_token',
  CONFIG: 'extension_config',
  OFFLINE_QUEUE: 'offline_queue',
} as const;

export class StorageService {
  static async saveTokens(tokenSet: TokenSet): Promise<void> {
    await chrome.storage.session.set({
      [KEYS.ACCESS_TOKEN]: tokenSet.accessToken,
      [KEYS.TOKEN_SET]: tokenSet,
    });
    await chrome.storage.local.set({
      [KEYS.REFRESH_TOKEN]: tokenSet.refreshToken,
    });
  }

  static async getTokens(): Promise<TokenSet | null> {
    const result = await chrome.storage.session.get(KEYS.TOKEN_SET);

    return (result[KEYS.TOKEN_SET] as TokenSet) ?? null;
  }

  static async clearTokens(): Promise<void> {
    await chrome.storage.session.remove([KEYS.ACCESS_TOKEN, KEYS.TOKEN_SET]);
    await chrome.storage.local.remove(KEYS.REFRESH_TOKEN);
  }

  static async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return false;
    return tokens.expiresAt > Date.now() + 60_000;
  }

  static async getOfflineQueue(): Promise<Batida[]> {
    const result = await chrome.storage.local.get(KEYS.OFFLINE_QUEUE);

    return (result[KEYS.OFFLINE_QUEUE] as Batida[]) ?? [];
  }

  static async addToOfflineQueue(batida: Batida): Promise<void> {
    const queue = await this.getOfflineQueue();
    await chrome.storage.local.set({ [KEYS.OFFLINE_QUEUE]: [...queue, batida] });
  }

  static async clearOfflineQueue(): Promise<void> {
    await chrome.storage.local.remove(KEYS.OFFLINE_QUEUE);
  }

  static async getConfig(): Promise<ExtensionConfig> {
    const result = await chrome.storage.sync.get(KEYS.CONFIG);
    return (result[KEYS.CONFIG] as ExtensionConfig) ?? {
      apiBaseUrl: 'http://localhost:3001',
      lembretes: ['08:00', '12:00', '13:30', '18:00'],
      geolocalizacaoHabilitada: false,
      notificacoesHabilitadas: true,
    };
  }

  static async saveConfig(config: ExtensionConfig): Promise<void> {
    await chrome.storage.sync.set({ [KEYS.CONFIG]: config });
  }
}