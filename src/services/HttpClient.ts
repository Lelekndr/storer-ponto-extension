import { StorageService } from './StorageService';

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: unknown;
  timeoutMs?: number;
}

class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

    const tokens = await StorageService.getTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            await StorageService.clearTokens();
            throw new NonRetryableError('Sessão expirada. Faça login novamente.');
          }
          throw new Error(`Erro da API: ${response.status}`);
        }

        const data: unknown = await response.json();
        return data as T;

      } catch (error) {
        if (error instanceof NonRetryableError) throw error;

        const isLastAttempt = attempt === MAX_RETRIES - 1;
        if (isLastAttempt) throw error;

        const waitMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }
    }

    throw new Error('Falha inesperada na requisição.');
  }
}