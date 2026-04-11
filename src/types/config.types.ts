export interface ExtensionConfig {
  apiBaseUrl: string;
  lembretes: string[];              // ex: ["08:00", "12:00", "13:30", "18:00"]
  geolocalizacaoHabilitada: boolean;
  notificacoesHabilitadas: boolean;
}