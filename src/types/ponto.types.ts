
export type TipoBatida = 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA';


export interface Batida { //Registro completo
  id: string;
  timestamp: string; 
  tipo: TipoBatida;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  sincronizado: boolean; 
}

export interface RegistrarBatidaRequest { //Extensão manda para a API
  timestamp: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface RegistrarBatidaResponse { //O que a API devolve
  id: string;
  timestamp: string;
  tipo: TipoBatida;
}

export interface SaldoMes {
  mesAno: string;          
  saldoMinutos: number;    
  horasTrabalhadas: number;
  horasPrevistas: number;
}