import express from "express";
import { pool } from "../database.js";

const router = express.Router();

// Rota para registrar um participante do sorteio
router.post("/register-raffle", async (req, res) => {
  const { nome, telefone } = req.body;

  // Validação simples dos dados recebidos
  if (!nome || !telefone) {
    return res.status(400).json({
      success: false,
      message: "Nome e telefone são obrigatórios.",
    });
  }

  try {
    // Insere o novo participante na tabela do banco de dados
    const result = await pool.query(
      `INSERT INTO sorteio_participantes (nome, telefone) 
       VALUES ($1, $2) 
       RETURNING id, nome`,
      [nome, telefone]
    );

    console.log(`✅ Participante do sorteio registrado: ${result.rows[0].nome}`);

    // Retorna uma resposta de sucesso
    res.status(201).json({
      success: true,
      message: "Participação no sorteio registrada com sucesso!",
      participantId: result.rows[0].id,
    });

  } catch (error) {
    console.error("❌ Erro ao registrar participante do sorteio:", error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro no servidor.",
    });
  }
});

export default router;