// routes/database.js

import pkg from 'pg';
const { Pool } = pkg;

// Pool usando connection string correta
const pool = new Pool({
  connectionString: 'postgresql://postgres.xrdlhodcecxsabdgbgcz:lnbaQJcQi14ju9as@aws-0-sa-east-1.pooler.supabase.com:5432/postgres'
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
