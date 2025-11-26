import TaskService from "../services/task.service.js";
import { CreateTaskDTO, UpdateTaskDTO } from "../dtos/task.dto.js";

const service = new TaskService();

const TasksController = {
    createTask: async (req, res) => {
        try {
            const dto = new CreateTaskDTO({ ...req.body, userId: req.user.id });
            const task = await service.createTask(dto);
            res.status(201).json({ message: "Task created", task });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message || "Failed to create task" });
        }
    },

    getAllTasks: async (req, res) => {
        try {
            const tasks = await service.listTasks(req.user.id);
            res.json(tasks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to list tasks" });
        }
    },
    
    getTaskById: async (req, res) => {
        try {
            const task = await service.getTask(req.params.id);
            res.json(task);
        } catch (err) {
            if (err.message === "NOT_FOUND") return res.status(404).json({ error: "Task not found" });
            res.status(500).json({ error: "Failed to get task" });
        }
    },

    updateTask: async (req, res) => {
        try {
            const updated = await service.updateTask(req.params.id, new UpdateTaskDTO(req.body), req.user);
            res.json(updated);
        } catch (err) {
            if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
            if (err.message === "NOT_FOUND") return res.status(404).json({ error: "Task not found" });
            res.status(500).json({ error: "Failed to update task" });
        }
    },

    deleteTask: async (req, res) => {
        try {
            await service.deleteTask(req.params.id, req.user);
            res.json({ message: "Task deleted" });
        } catch (err) {
            if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
            if (err.message === "NOT_FOUND") return res.status(404).json({ error: "Task not found" });
            res.status(500).json({ error: "Failed to delete task" });
        }
    }
};

export default TasksController;