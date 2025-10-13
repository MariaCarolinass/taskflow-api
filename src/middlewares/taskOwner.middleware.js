import { readData } from "../db/fileDatabase.js";

const DATA_FILE = "tasks.json";

export const TaskOwnerMiddleware = async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;

    if (user.role === "admin") {
        return next();
    }

    const tasks = readData(DATA_FILE);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found." });
    }

    if (task.userId !== user.id) {
        return res.status(403).json({ error: "Forbidden: you can only modify your own tasks." });
    }

    next();
};
