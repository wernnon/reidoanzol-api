// routes/database.js

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

// Pool usando connection string correta
const pool = new Pool({
  host:'aws-1-sa-east-1.pooler.supabase.com',
  user: 'postgres.rxcdicqnczmgajkgsnup',
  port: '5432',
  database: 'postgres',
  user: 'postgres.rxcdicqnczmgajkgsnup',
  pool_mode:'session',
  password: 'xr1fENvWET2eUy6o'
});

// Função para testar a conexão
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conectado ao PostgreSQL com sucesso!');
    client.release();
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  }
}

export { pool, testConnection };
