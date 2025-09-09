// server.mjs (Corrigido para aceitar apenas o seu site)

// Importa dependências
import express from 'express';
import cors from 'cors';
import { pool, testConnection } from './database.js';
import teamRoutes from './routes/team.js';

const app = express();

// Porta do servidor
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'https://reidoanzol.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions)); // Usa as opções de CORS que definimos acima
app.use(express.json());   // Permite receber JSON no body das requisições

// Testar conexão
testConnection();

// Usa as rotas de equipe com prefixo /api
app.use('/api', teamRoutes);

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