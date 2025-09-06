// routes/team.js
import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.post("/register-team", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { teamName, leader, members, registrationCode } = req.body;

    // 1️⃣ Criar líder com CPF
    const leaderResult = await client.query(
      `INSERT INTO users (id, nome, email, telefone, cpf, role)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, 'lider')
        RETURNING id`,
      [leader.nome, leader.email, leader.telefone, leader.cpf]
    );
    const leaderId = leaderResult.rows[0].id;

    // 2️⃣ Criar equipe
    const teamResult = await client.query(
      `INSERT INTO teams (tournament_id, name, invite_code, leader_id, status)
        VALUES ($1, $2, $3, $4, 'pendente')
        RETURNING id`,
      [1, teamName, registrationCode, leaderId]
    );
    const teamId = teamResult.rows[0].id;

    // 3️⃣ Adicionar líder como membro
    await client.query(
      `INSERT INTO team_members (user_id, team_id, role_in_team)
        VALUES ($1, $2, 'lider')`,
      [leaderId, teamId]
    );

    // 4️⃣ Adicionar outros membros com CPF
    for (const member of members) {
      const userResult = await client.query(
        `INSERT INTO users (id, nome, telefone, cpf, role)
          VALUES (gen_random_uuid(), $1, $2, $3, 'participante')
          RETURNING id`,
        [member.fullName, member.phone, member.cpf]
      );
      const userId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO team_members (user_id, team_id, role_in_team)
          VALUES ($1, $2, $3)`,
        [userId, teamId, member.isDriver ? "condutor" : "participante"]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ success: true, teamId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar equipe:", error);
    res.status(500).json({ success: false, error: "Erro ao criar equipe" });
  } finally {
    client.release();
  }
});

export default router;