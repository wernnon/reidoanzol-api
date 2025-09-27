import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.post("/register-raffle", async (req, res) => {
  const { nome, telefone } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({
      success: false,
      message: "Nome e telefone são obrigatórios.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sorteio_participantes (nome, telefone) 
       VALUES ($1, $2) 
       RETURNING id, nome`,
      [nome, telefone]
    );

    console.log(`✅ Participante do sorteio registrado: ${result.rows[0].nome}`);

    res.status(201).json({
      success: true,
      message: "Participação no sorteio registrada com sucesso!",
      participantId: result.rows[0].id,
    });

  } catch (error) {
    // --- LÓGICA DE ERRO ATUALIZADA ---
    // O código de erro '23505' é específico do PostgreSQL para violação de restrição UNIQUE
    if (error.code === '23505') {
      console.warn(`⚠️ Tentativa de registro duplicado | Telefone: ${telefone}`);
      return res.status(409).json({ // 409 Conflict é o status ideal para duplicidade
        success: false,
        message: "Este número de telefone já foi cadastrado no sorteio.",
      });
    }

    // Para qualquer outro tipo de erro
    console.error("❌ Erro ao registrar participante do sorteio:", error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro interno no servidor.",
    });
  }
});

export default router;