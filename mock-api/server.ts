import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

// Libera requisições da extensão Chrome — o origin dela é chrome-extension://...
app.use(cors({ origin: '*' }));

type TipoBatida = 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA';

// Interface que representa uma batida no banco em memória
interface BatidaMock {
  id: string;
  timestamp: string;
  tipo: TipoBatida;
  geolocation?: { latitude: number; longitude: number };
  sincronizado: boolean;
}

const batidas: BatidaMock[] = [];

// POST /v1/ponto/batidas — registra uma nova batida
app.post('/v1/ponto/batidas', (req, res) => {
  const { timestamp, geolocation } = req.body;

  // Determina o tipo automaticamente pela sequência do dia
  const tiposSequencia = ['ENTRADA', 'INTERVALO', 'RETORNO', 'SAIDA'] as const;
  const tipo = tiposSequencia[batidas.length % 4];

  const novaBatida: BatidaMock = {
    id: crypto.randomUUID(),
    timestamp: timestamp || new Date().toISOString(),
    tipo,
    geolocation,
    sincronizado: true,
  };

  batidas.push(novaBatida);
  console.log(`✅ Batida registrada: ${tipo} às ${novaBatida.timestamp}`);
  res.status(201).json(novaBatida);
});


app.get('/v1/ponto/batidas', (req, res) => {
  const { data } = req.query;

 
  const resultado = batidas.filter((b) => b.timestamp.startsWith(data as string));
  res.json(resultado);
});


app.get('/v1/ponto/saldo', (req, res) => {
  const { mes } = req.query;
  res.json({
    mesAno: mes,
    saldoMinutos: 90,       
    horasTrabalhadas: 1530,  
    horasPrevistas: 1440,
  });
});

app.listen(3001, () => {
  console.log('🚀 Mock API rodando em http://localhost:3001');
});