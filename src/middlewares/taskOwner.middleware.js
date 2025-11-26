import TaskRepository from "../repositories/task.repository.js";
const repo = new TaskRepository();

const TaskOwnerMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === "admin") return next();

  const task = await repo.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const ownerId =
    typeof task.userId === "object" && task.userId._id
      ? task.userId._id.toString()
      : task.userId.toString();

  if (ownerId !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

export default TaskOwnerMiddleware;
