// routes/database.js

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

// Pool usando connection string correta
const pool = new Pool({
 host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
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
