import express from "express";
import { pool } from "../database.js";

const router = express.Router();

// Rota para registrar um competidor de caiaque
router.post("/register-kayak", async (req, res) => {
  const { nome, telefone, email } = req.body;

  console.log("Dados recebidos:", req.body); // Log para verificar entrada

  if (!nome || !telefone || !email) {
    return res.status(400).json({
      success: false,
      error: "Nome, telefone e e-mail são obrigatórios.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO kayak_competidor (nome, telefone, email) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome`,
      [nome, telefone, email]
    );

    console.log("Resultado da query:", result); // Log completo da resposta do banco

    if (!result.rows || result.rows.length === 0) {
      throw new Error("Nenhum dado retornado da inserção");
    }

    console.log(`Competidor de caiaque registrado: ${result.rows[0].nome}`);

    res.status(201).json({
      success: true,
      competitorId: result.rows[0].id,
    });

  } catch (error) {
    console.error("Erro ao registrar competidor de caiaque:", error.stack || error.message || error);
    res.status(500).json({
      success: false,
      error: "Ocorreu um erro no servidor ao tentar registrar.",
    });
  }
});

export default router;