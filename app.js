import express, { json } from 'express';
import dotenv from "dotenv";

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import tasksRoutes from './src/routes/tasks.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;