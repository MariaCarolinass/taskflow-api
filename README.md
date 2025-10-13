# TaskFlow API

API REST simples para gerenciamento de tarefas com **Node.js**, **Express** e **mensageria via Redis**.

---

## Funcionalidades

- CRUD de usuários e tarefas
- Autenticação JWT
- RBAC (controle de acesso por papel)
- Validação de dados com Joi
- Logging de requisições
- Worker que consome eventos de tarefas via Redis
- Persistência simples com arquivos JSON

---

## Estrutura do projeto

```
taskflow-api/
├─ src/
│  ├─ controllers/
│  ├─ models/
│  ├─ middlewares/
│  ├─ validators/
│  ├─ routes/
│  └─ db/
├─ worker/
├─ data/
├─ .env
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ server.js
└─ app.js
```

---

## Tecnologias

- Node.js + Express
- Redis (mensageria)
- Joi (validação)
- bcrypt (hash de senhas)
- JWT (autenticação)

---

## Rodando localmente

1. Instalar dependências:

```bash
npm install
```

2. Criar arquivo `.env`:

```
PORT=3000
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1h
REDIS_URL=redis://localhost:6379
DATA_DIR=./data
```

3. Rodar API:

```bash
npm run dev
```

4. Rodar worker:

```bash
node worker/task.worker.js
```

---

## Rodando com Docker

```bash
docker-compose up --build
```

- API na porta `3000`
- Redis na porta `6379`
- Worker consumindo eventos de tasks

---

## Endpoints principais

### Auth

- `POST /api/v1/auth/register` → registrar usuário
- `POST /api/v1/auth/login` → login
- `POST /api/v1/auth/logout` → logout (JWT)

### Users

- `GET /api/v1/users/` → listar todos
- `GET /api/v1/users/:id` → buscar por ID
- `PUT /api/v1/users/:id` → atualizar
- `DELETE /api/v1/users/:id` → deletar

### Tasks

- `GET /api/v1/tasks/` → listar tasks
- `GET /api/v1/tasks/:id` → buscar task
- `POST /api/v1/tasks/` → criar task
- `PATCH /api/v1/tasks/:id` → atualizar
- `DELETE /api/v1/tasks/:id` → deletar

---

## Observações

- Tokens JWT devem ser enviados no header `Authorization: Bearer <token>`.
- Apenas usuários com papel adequado podem acessar certas rotas (RBAC).
- Dados persistem em arquivos JSON na pasta `data/`.

---

## Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/xyz`)
3. Commit (`git commit -m "feat: descrição"`)
4. Push (`git push origin feature/xyz`)
5. Abra Pull Request