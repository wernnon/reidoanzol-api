import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.post("/register-team", async (req, res) => {
  const client = await pool.connect();
  let equipeId;

  try {
    await client.query("BEGIN");
    console.log("➡️ Transação iniciada");

    const { teamName, leader, members, registrationCode } = req.body;
    console.log(`📥 Dados recebidos | Equipe: ${teamName}`);

    // 1️⃣ Criar equipe
    const equipeResult = await client.query(
      `INSERT INTO equipes (nome_da_equipe, nome_motorista, codigo_convite)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [teamName, leader.nome, registrationCode]
    );
    equipeId = equipeResult.rows[0].id;
    console.log(`👥 Equipe criada | ID: ${equipeId}`);

    // 2️⃣ Inserir líder como usuário
    const leaderResult = await client.query(
      `INSERT INTO usuarios (equipe_id, nome_completo, email, cpf)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [equipeId, leader.nome, leader.email, leader.cpf]
    );
    const leaderId = leaderResult.rows[0].id;
    console.log(`👤 Líder criado como usuário | ID: ${leaderId}`);

    // 3️⃣ Inserir todos os membros na tabela membros
    // Incluindo o líder
    const allMembers = [leader, ...members];

    for (const member of allMembers) {
      if (!member.nome || !member.cpf) {
        console.log("⚠️ Membro ignorado (dados incompletos)");
        continue;
      }

      await client.query(
        `INSERT INTO membros (equipe_id, nome_completo, cpf)
         VALUES ($1, $2, $3)`,
        [equipeId, member.nome, member.cpf]
      );
      console.log(`👥 Membro adicionado à equipe ${equipeId} | Nome: ${member.nome}`);
    }

    await client.query("COMMIT");
    console.log(`✅ Transação concluída | Equipe ${equipeId} registrada`);

    res.status(201).json({ success: true, equipeId });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Erro ao criar equipe:", error.message);
    res.status(500).json({ success: false, message: "Erro interno no servidor ao tentar criar a equipe." });
  } finally {
    client.release();
    console.log("🔚 Conexão liberada");
  }
});

export default router;
