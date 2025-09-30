# reidoanzol-api

## Visão Geral

API Node.js para gerenciamento de equipes, competidores de caiaque e participantes de sorteio. Utiliza PostgreSQL como banco de dados.

## Endpoints

### Equipes

- **POST /api/register-team**
  - Registra uma nova equipe, líder e membros.
  - **Body:**  
    ```json
    {
      "teamName": "Nome da Equipe",
      "leader": { "nome": "Líder", "email": "email", "cpf": "cpf" },
      "members": [{ "nome": "Membro", "cpf": "cpf" }, ...],
      "registrationCode": "Código"
    }
    ```
  - **Response:**  
    ```json
    { "success": true, "equipeId": 1 }
    ```

### Caiaque

- **POST /api/register-kayak**
  - Registra competidor de caiaque.
  - **Body:**  
    ```json
    { "nome": "Nome", "telefone": "Telefone", "email": "Email" }
    ```
  - **Response:**  
    ```json
    { "success": true, "competitorId": 1 }
    ```

### Sorteio

- **POST /api/register-raffle**
  - Registra participante do sorteio.
  - **Body:**  
    ```json
    { "nome": "Nome", "telefone": "Telefone" }
    ```
  - **Response:**  
    ```json
    { "success": true, "participantId": 1 }
    ```

## Testes

- **GET /users**: Lista usuários.
- **GET /**: Status do servidor.
- **GET /status**: Status e timestamp.

## Banco de Dados

- Configurado em [database.js](http://_vscodecontentref_/0).

## Inicialização

```sh
npm install
npm start
