import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

// Libera requisições da extensão Chrome — o origin dela é chrome-extension://...
app.use(cors({ origin: '*' }));

// Banco de dados em memória — reinicia quando o servidor reinicia
const batidas: any[] = [];

// POST /v1/ponto/batidas — registra uma nova batida
app.post('/v1/ponto/batidas', (req, res) => {
  const { timestamp, geolocation } = req.body;

  // Determina o tipo automaticamente pela sequência do dia
  const tiposSequencia = ['ENTRADA', 'INTERVALO', 'RETORNO', 'SAIDA'] as const;
  const tipo = tiposSequencia[batidas.length % 4];

  const novaBatida = {
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

// GET /v1/ponto/batidas?data=2026-04-10 — batidas do dia
app.get('/v1/ponto/batidas', (req, res) => {
  const { data } = req.query;

  // Filtra pelo dia solicitado
  const resultado = batidas.filter((b) => b.timestamp.startsWith(data as string));
  res.json(resultado);
});

// GET /v1/ponto/saldo?mes=2026-04 — saldo do mês (mockado fixo por enquanto)
app.get('/v1/ponto/saldo', (req, res) => {
  const { mes } = req.query;
  res.json({
    mesAno: mes,
    saldoMinutos: 90,       // +1h30 de banco de horas
    horasTrabalhadas: 1530, // em minutos
    horasPrevistas: 1440,
  });
});

app.listen(3001, () => {
  console.log('🚀 Mock API rodando em http://localhost:3001');
});