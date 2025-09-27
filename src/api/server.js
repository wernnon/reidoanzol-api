// server.mjs (Corrigido para aceitar seu site e localhost)

// Importa dependências
import express from 'express';
import cors from 'cors';
import { pool, testConnection } from './database.js';
import teamRoutes from './routes/team.js';
import kayakRoutes from './routes/kayak.js';
import sorteioRoutes from './routes/sorteio.js';

const app = express();

// Porta do servidor
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: [
    'https://www.reidoanzolpvh.com', 
    'https://reidoanzolpvh.com'  
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Testar conexão
testConnection();

// Usa as rotas de equipe com prefixo /api
app.use('/api', teamRoutes);
app.use('/api', kayakRoutes);
app.use('/api', sorteioRoutes);

// Exemplo de rota que consulta o banco
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar usuários' });
  }
});

// Rotas de teste
app.get('/', (req, res) => {
  res.send('<h1>Servidor Node.js funcionando!</h1><p>Bem-vindo à API</p>');
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Rota de exemplo para criar um recurso
app.post('/create', (req, res) => {
  const data = req.body;
  res.json({ message: 'Dados recebidos com sucesso!', data });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
