import express from "express";
import TasksController from "../controllers/tasks.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import { TaskOwnerMiddleware } from "../middlewares/taskOwner.middleware.js";
import { createTaskSchema, updateTaskSchema, validateBody } from "../validators/task.validator.js";

const router = express.Router();

router.get("/", AuthMiddleware.verifyToken, TasksController.getAllTasks);
router.post("/", AuthMiddleware.verifyToken, validateBody(createTaskSchema), TasksController.createTask);
router.get("/:id", AuthMiddleware.verifyToken, TasksController.getTaskById);
router.put("/:id", AuthMiddleware.verifyToken, TaskOwnerMiddleware, validateBody(updateTaskSchema), TasksController.updateTask);
router.delete("/:id", AuthMiddleware.verifyToken, TaskOwnerMiddleware, TasksController.deleteTask);

export default router;