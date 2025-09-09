import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.post("/register-team", async (req, res) => {
  // Começamos uma "transação". Se qualquer passo der errado, tudo é desfeito.
  const client = await pool.connect();
  let teamId; // Variável para guardar o ID da equipe criada

  try {
    await client.query("BEGIN");

    // --- CORRIGIDO ---
    // Agora pegamos o tournamentId que vem do formulário
    const { teamName, leader, members, registrationCode, tournamentId } = req.body;

    // Validação básica para garantir que os dados essenciais chegaram
    if (!leader.data_nascimento || !tournamentId) {
      throw new Error("Dados essenciais como data de nascimento do líder ou ID do torneio não foram recebidos.");
    }
    
    // 1️⃣ Criar o usuário líder e seu perfil
    const leaderResult = await client.query(
      `INSERT INTO users (nome, email, telefone, cpf, data_nascimento, role)
       VALUES ($1, $2, $3, $4, $5, 'lider')
       RETURNING id`,
      // --- CORRIGIDO --- Adicionamos leader.data_nascimento
      [leader.nome, leader.email, leader.telefone, leader.cpf, leader.data_nascimento]
    );
    const leaderId = leaderResult.rows[0].id;
    
    // --- ADICIONADO ---
    // Agora criamos o perfil obrigatório do líder
    await client.query(
      `INSERT INTO user_profiles (id, nome, cpf, data_nascimento)
       VALUES ($1, $2, $3, $4)`,
      [leaderId, leader.nome, leader.cpf, leader.data_nascimento]
    );

    // 2️⃣ Criar a equipe no banco de dados
    const teamResult = await client.query(
      `INSERT INTO teams (tournament_id, name, invite_code, leader_id, status)
       VALUES ($1, $2, $3, $4, 'pendente')
       RETURNING id`,
      // --- CORRIGIDO --- Usamos o tournamentId vindo do formulário
      [tournamentId, teamName, registrationCode, leaderId]
    );
    teamId = teamResult.rows[0].id; // Guardamos o ID da equipe

    // 3️⃣ Adicionar o líder como um membro da equipe que ele acabou de criar
    await client.query(
      `INSERT INTO team_members (user_id, team_id, role_in_team)
       VALUES ($1, $2, 'lider')`,
      [leaderId, teamId]
    );

    // 4️⃣ Criar cada um dos outros membros e seus perfis
    for (const member of members) {
      if (!member.nome || !member.cpf || !member.data_nascimento) continue; // Pula membros vazios

      const userResult = await client.query(
        `INSERT INTO users (nome, telefone, cpf, data_nascimento, role)
         VALUES ($1, $2, $3, $4, 'participante')
         RETURNING id`,
        // --- CORRIGIDO --- Usamos member.nome e adicionamos member.data_nascimento
        [member.nome, member.telefone, member.cpf, member.data_nascimento]
      );
      const userId = userResult.rows[0].id;

      // --- ADICIONADO ---
      // Criamos o perfil obrigatório para cada membro
      await client.query(
        `INSERT INTO user_profiles (id, nome, cpf, data_nascimento)
         VALUES ($1, $2, $3, $4)`,
        [userId, member.nome, member.cpf, member.data_nascimento]
      );

      // Adiciona o usuário recém-criado na tabela de membros da equipe
      await client.query(
        `INSERT INTO team_members (user_id, team_id, role_in_team)
         VALUES ($1, $2, $3)`,
        [userId, teamId, member.isDriver ? "condutor" : "participante"]
      );
    }

    // Se todos os passos acima funcionaram, a gente confirma as mudanças no banco
    await client.query("COMMIT");
    res.status(201).json({ success: true, teamId: teamId });

  } catch (error) {
    // Se qualquer passo falhou, a gente desfaz TUDO
    await client.query("ROLLBACK");
    console.error("Erro detalhado ao criar equipe:", error);
    res.status(500).json({ success: false, message: "Erro interno no servidor ao tentar criar a equipe." });
  } finally {
    // Libera a conexão com o banco, independentemente de ter dado certo ou errado
    client.release();
  }
});

export default router;
