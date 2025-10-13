import express from 'express';
import dotenv from "dotenv";
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import tasksRoutes from './src/routes/tasks.routes.js';
import LoggerMiddleware from "./src/middlewares/logger.middleware.js";
import ErrorMiddleware from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(LoggerMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', tasksRoutes);

app.use(ErrorMiddleware);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;