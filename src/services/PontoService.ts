import type { Batida, RegistrarBatidaRequest, RegistrarBatidaResponse, SaldoMes } from '../types/ponto.types';
import { HttpClient } from './HttpClient';
import { StorageService } from './StorageService';

export class PontoService {
  private client: HttpClient;

  constructor(apiBaseUrl: string) {
    this.client = new HttpClient(apiBaseUrl);
  }

  async registrarBatida(geolocation?: { latitude: number; longitude: number }): Promise<RegistrarBatidaResponse> {
    const payload: RegistrarBatidaRequest = {
      timestamp: new Date().toISOString(),
      geolocation,
    };

    if (!navigator.onLine) {
      const batidaOffline: Batida = {
        id: crypto.randomUUID(),
        timestamp: payload.timestamp,
        tipo: 'ENTRADA',
        geolocation,
        sincronizado: false,
      };
      await StorageService.addToOfflineQueue(batidaOffline);
      return { id: batidaOffline.id, timestamp: batidaOffline.timestamp, tipo: batidaOffline.tipo };
    }

    return this.client.request<RegistrarBatidaResponse>({
      method: 'POST',
      path: '/v1/ponto/batidas',
      body: payload,
    });
  }

  async getBatidasDia(data?: string): Promise<Batida[]> {
    const dataFormatada = data ?? new Date().toISOString().split('T')[0];
    return this.client.request<Batida[]>({
      method: 'GET',
      path: `/v1/ponto/batidas?data=${dataFormatada}`,
    });
  }

  async getSaldo(mesAno: string): Promise<SaldoMes> {
    return this.client.request<SaldoMes>({
      method: 'GET',
      path: `/v1/ponto/saldo?mes=${mesAno}`,
    });
  }
}