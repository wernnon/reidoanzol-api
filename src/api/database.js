// routes/database.js

import pkg from 'pg';
const { Pool } = pkg;


// Pool usando dados fixos (os seus)
const pool = new Pool({
  host: 'aws-1-sa-east-1.pooler.supabase.com',
  user: 'postgres.rxcdicqnczmgajkgsnup',
  port: 5432,
  database: 'postgres',
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
