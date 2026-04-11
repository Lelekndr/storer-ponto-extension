// Os 4 tipos possíveis de batida — a API determina qual é com base na sequência do dia
export type TipoBatida = 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA';

export interface Batida {
  id: string;
  timestamp: string; // ISO 8601 UTC, ex: "2026-04-10T11:00:00Z"
  tipo: TipoBatida;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  sincronizado: boolean; // false quando está na fila offline
}

export interface RegistrarBatidaRequest {
  timestamp: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface RegistrarBatidaResponse {
  id: string;
  timestamp: string;
  tipo: TipoBatida;
}

export interface SaldoMes {
  mesAno: string;          // "2026-04"
  saldoMinutos: number;    // positivo = banco de horas, negativo = devendo
  horasTrabalhadas: number;
  horasPrevistas: number;
}