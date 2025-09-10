import express from "express";
import { pool } from "../database.js";

const router = express.Router();

// Função para simular um atraso (útil para depuração)
const delay = ms => new Promise(res => setTimeout(res, ms));

// Novo endpoint para registrar um único competidor
router.post("/register-competitor-kayak", async (req, res) => {
  const client = await pool.connect();
  
  try {
    await delay(250);
    console.log("➡️ Tentando registrar um novo competidor...");

    const { nome, telefone, email } = req.body;
    await delay(250);
    console.log(`📥 Dados recebidos | Nome: ${nome}`);

    // Insere o novo competidor na tabela 'kayak_competidor'
    const result = await client.query(
      `INSERT INTO kayak_competidor (nome, telefone, email)
      VALUES ($1, $2, $3)
      RETURNING id`,
      [nome, telefone, email]
    );

    const competitorId = result.rows[0].id;
    await delay(250);
    console.log(`✅ Competidor registrado com sucesso | ID: ${competitorId}`);

    // Responde com o ID do competidor recém-criado
    res.status(201).json({ success: true, competitorId });

  } catch (error) {
    console.error("❌ Erro ao registrar competidor:", error.message);
    res.status(500).json({ success: false, message: "Erro interno no servidor ao tentar registrar o competidor." });
  } finally {
    client.release();
    await delay(250);
    console.log("🔚 Conexão liberada");
  }
});

export default router;