# TaskFlow API

TaskFlow API é uma aplicação Node.js desenvolvida para gerenciar tarefas utilizando arquitetura limpa com **Controller**, **Service**, **Repository**, **DTO**, **Middleware** e banco de dados **MongoDB Atlas**.

A API conta com autenticação via JWT, validação com Joi, mensagens publicadas em Redis e um worker para processar eventos.

---

## Estrutura do projeto

```
taskflow-api/
├─ src/
│  ├─ controllers/
│  ├─ db/
│  ├─ services/
│  ├─ repositories/
│  ├─ dtos/
│  ├─ models/
│  ├─ middlewares/
│  ├─ validators/
│  ├─ routes/
│  └─ views/
├─ worker/
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ server.js
└─ app.js
```

---

## Tecnologias

- Node.js + Express
- MongoDB Atlas + Mongoose
- Redis (mensageria)
- Joi (validação)
- bcrypt (hash de senhas)
- JWT (autenticação)
- Docker / Docker Compose

---

## Funcionalidades

- CRUD de usuários e tarefas
- Autenticação JWT
- RBAC (controle de acesso por papel)
- Validação de dados com Joi
- Logging de requisições
- Worker que consome eventos de tarefas via Redis

---

## Configuração do Ambiente

### Crie o arquivo `.env`

```
cp .env.example .env
```

---

## Executando o projeto

### Sem Docker

1. Instalar dependências:

```
npm install
```

2. Rodar API:

```bash
npm run dev
```

### Com Docker

```
docker-compose up --build -d
```

A aplicação vai está rodando em:

```
http://localhost:3000/
```

---

## Rotas da API

### Autenticação

- `POST /api/v1/auth/register` - registrar usuário
- `POST /api/v1/auth/login` - login
- `POST /api/v1/auth/logout` - logout

### Usuários

- `GET /api/v1/users/` - listar todos
- `GET /api/v1/users/:id` - buscar por ID
- `PUT /api/v1/users/:id` - atualizar
- `DELETE /api/v1/users/:id` - deletar

### Tarefas

- `GET /api/v1/tasks/` - listar tasks
- `GET /api/v1/tasks/:id` - buscar task
- `POST /api/v1/tasks/` - criar task
- `PATCH /api/v1/tasks/:id` - atualizar
- `DELETE /api/v1/tasks/:id` - deletar

---

## Testes rápidos (curl)

1. Criar usuário:

```
curl -X POST http://localhost:3000/api/v1/auth/register -H "Content-Type: application/json" -d '{"name":"Carol","email":"carol@example.com","password":"123456","role":"admin"}'
```

2. Login (copiar token):

```
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"carol@example.com","password":"123456"}'
```

3. Criar tarefa:

```
curl -X POST http://localhost:3000/api/v1/tasks -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"title": "Task 1", "description": "Descrição da task", "dueDate": "2025-12-20"}'
```

4. Listar tarefas:

```
curl -X GET http://localhost:3000/api/v1/tasks -H "Authorization: Bearer <TOKEN>"
```

5. Atualizar tarefa:

```
curl -X PUT http://localhost:3000/api/v1/tasks/<TASK_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"title": "Task 1 Atualizada", "description": "Nova descrição", "status": "in-progress", "dueDate": "2025-12-22"}'
```

---

## Observações

- Tokens JWT devem ser enviados no header `Authorization: Bearer <token>`.
- Apenas usuários com papel adequado podem acessar certas rotas (RBAC).

---

## Testando Redis

### Ver mensagens publicadas

```
docker exec -it redis redis-cli
SUBSCRIBE taskEvents
```

---

# Estrutura Clean Architecture

## DTOs

- Validam e padronizam dados recebidos nos services

## Repositories

- Isolam acesso ao MongoDB

## Services

- Contêm regras de negócio

## Controllers

- Recebem requisições e chamam os services

---

## Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/xyz`)
3. Commit (`git commit -m "feat: descrição"`)
4. Push (`git push origin feature/xyz`)
5. Abra Pull Request

---

## Licença

MIT
