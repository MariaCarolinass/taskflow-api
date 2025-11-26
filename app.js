import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

import LoggerMiddleware from "./src/middlewares/logger.middleware.js";
import ErrorMiddleware from "./src/middlewares/error.middleware.js";
import viewUserMiddleware from "./src/middlewares/views/viewUser.middleware.js";

import authRoutes from './src/routes/auth.route.js';
import userRoutes from './src/routes/user.route.js';
import tasksRoutes from './src/routes/task.route.js';

import viewRoutes from "./src/routes/view.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET || "taskflow-secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "taskflow",
        collectionName: "sessions",
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
    })
);  

app.use(LoggerMiddleware);
app.use(viewUserMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', tasksRoutes);

app.use("/", viewRoutes);

app.use(ErrorMiddleware);

export default app;