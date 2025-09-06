// routes/team.js
import express from "express";
import { pool } from "../database.js"; // importa o pool do database.js

const router = express.Router();

router.post("/register-team", async (req, res) => {
  try {
    const { teamName, leader, members, registrationCode } = req.body;

    // 1️⃣ Criar líder
    const leaderResult = await pool.query(
      `INSERT INTO users (id, nome, email, telefone, role)
       VALUES (gen_random_uuid(), $1, $2, $3, 'lider')
       RETURNING id`,
      [leader.nome, leader.email, leader.telefone]
    );
    const leaderId = leaderResult.rows[0].id;

    // 2️⃣ Criar equipe
    const teamResult = await pool.query(
      `INSERT INTO teams (tournament_id, name, invite_code, leader_id, status)
       VALUES ($1, $2, $3, $4, 'pendente')
       RETURNING id`,
      [1, teamName, registrationCode, leaderId] // Ajuste tournament_id conforme necessário
    );
    const teamId = teamResult.rows[0].id;

    // 3️⃣ Adicionar líder como membro
    await pool.query(
      `INSERT INTO team_members (user_id, team_id, role_in_team)
       VALUES ($1, $2, 'lider')`,
      [leaderId, teamId]
    );

    // 4️⃣ Adicionar outros membros
    for (const member of members) {
      const userResult = await pool.query(
        `INSERT INTO users (id, nome, telefone, role)
         VALUES (gen_random_uuid(), $1, $2, 'participante')
         RETURNING id`,
        [member.nome, member.telefone]
      );
      const userId = userResult.rows[0].id;

      await pool.query(
        `INSERT INTO team_members (user_id, team_id, role_in_team)
         VALUES ($1, $2, $3)`,
        [userId, teamId, member.isDriver ? "condutor" : "participante"]
      );
    }

    res.status(201).json({ success: true, teamId });
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    res.status(500).json({ success: false, error: "Erro ao criar equipe" });
  }
});

export default router;
