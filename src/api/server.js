// server.mjs (Corrigido para aceitar apenas o seu site)

// Importa dependências
import express from 'express';
import cors from 'cors';
import { pool, testConnection } from './database.js';
import teamRoutes from './routes/team.js';

// Função para esperar 1/4 de segundo (250ms)
const delay = ms => new Promise(res => setTimeout(res, ms));

async function startServer() {
  await delay(250);
  console.log('Iniciando o servidor...');

  const app = express();

  await delay(250);
  // Porta do servidor
  const PORT = process.env.PORT || 3001;
  console.log(`Configurando a porta: ${PORT}`);

  const allowedOrigins = [
    'https://reidoanzol.vercel.app',
    'https://reidoanzolpvh.com',
    'https://www.reidoanzolpvh.com',
    'http://localhost:5173'
  ];

  const corsOptions = {
    origin: async function(origin, callback) {
      await delay(250);
      console.log(`Requisição recebida de origem: ${origin}`);
      if (!origin) {
        await delay(250);
        console.log('Permitindo requisição sem origem (Postman, etc.).');
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        await delay(250);
        console.log(`Origem ${origin} permitida por CORS.`);
        callback(null, true);
      } else {
        await delay(250);
        console.error(`Origem ${origin} não permitida por CORS.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  await delay(250);
  app.use(cors(corsOptions));
  console.log('Middleware CORS aplicado.');

  await delay(250);
  // Middlewares
  app.use(express.json()); // Permite receber JSON no body das requisições
  console.log('Middleware express.json aplicado.');

  await delay(250);
  // Testar conexão

  await testConnection();

  await delay(250);
  // Usa as rotas de equipe com prefixo /api
  app.use('/api', teamRoutes);
  console.log('Rotas de equipe aplicadas com prefixo /api.');

  // Exemplo de rota que consulta o banco
  app.get('/users', async (req, res) => {
    await delay(250);
    console.log('Requisição GET para /users recebida.');
    try {
      const result = await pool.query('SELECT * FROM users');
      await delay(250);
      console.log('Consulta ao banco de dados para usuários executada com sucesso.');
      res.json(result.rows);
      await delay(250);
      console.log('Resposta enviada para /users.');
    } catch (err) {
      await delay(250);
      console.error('Erro na consulta de usuários:', err);
      res.status(500).json({ error: 'Erro ao consultar usuários' });
    }
  });

  // Rotas de teste
  app.get('/', async (req, res) => {
    await delay(250);
    console.log('Requisição GET para a raiz (/) recebida.');
    res.send('<h1>Servidor Node.js funcionando!</h1><p>Bem-vindo à API</p>');
    await delay(250);
    console.log('Resposta enviada para a raiz.');
  });

  app.get('/status', async (req, res) => {
    await delay(250);
    console.log('Requisição GET para /status recebida.');
    res.json({ status: 'ok', timestamp: new Date() });
    await delay(250);
    console.log('Resposta de status enviada.');
  });

  // Rota de exemplo para criar um recurso
  app.post('/create', async (req, res) => {
    await delay(250);
    console.log('Requisição POST para /create recebida.');
    const data = req.body;
    await delay(250);
    console.log('Dados recebidos:', data);
    res.json({ message: 'Dados recebidos com sucesso!', data });
    await delay(250);
    console.log('Resposta de criação enviada.');
  });

  // Inicializa o servidor
  app.listen(PORT, async () => {
    await delay(250);
    console.log(`✅ Servidor rodando com sucesso na porta ${PORT}`);
  });
}

startServer();