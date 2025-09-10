// routes/database.js

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import 'dotenv/config';

// Função para esperar 1/4 de segundo (250ms)
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  await delay(250);
  console.log('Iniciando o arquivo de configuração do banco de dados...');

  dotenv.config();

  await delay(250);
  console.log('Configurando o pool de conexões...');
  const pool = new Pool({
    host: 'aws-1-sa-east-1.pooler.supabase.com',
    user: 'postgres.rxcdicqnczmgajkgsnup',
    port: '5432',
    database: 'postgres',
    pool_mode: 'session',
    password: 'xr1fENvWET2eUy6o'
  });
  await delay(250);
  console.log('Pool de conexões configurado.');

  // Função para testar a conexão
  async function testConnection() {
    await delay(250);
    console.log('Tentando conectar ao banco de dados...');
    try {
      const client = await pool.connect();
      await delay(250);
      console.log('✅ Conectado ao PostgreSQL com sucesso!');
      client.release();
      await delay(250);
      console.log('Conexão liberada de volta para o pool.');
    } catch (err) {
      await delay(250);
      console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
      // Exibe o erro completo para depuração
      await delay(250);
      console.error(err);
    }
  }

  // Chame a função testConnection() onde for necessário no seu código,
  // por exemplo, no server.mjs como você já estava fazendo.
  // Você também pode exportar as funções e objetos como antes.
  return { pool, testConnection };
}

// Chame a função main e exporte os resultados
const { pool, testConnection } = await main();
export { pool, testConnection };