import TaskRepository from "../repositories/task.repository.js";
import publishEvent from "../../worker/producer.js";

const repo = new TaskRepository();

class TaskService {
  async createTask(dto) {
    const created = await repo.create(dto);
    publishEvent("taskCreated", created);
    return created;
  }

  async listTasks(userId) {
    return repo.findAll({ userId });
  }

  async getTask(id) {
    const task = await repo.findById(id);
    if (!task) throw new Error("NOT_FOUND");
    return task;
  }

  async updateTask(id, dto, currentUser) {
    const task = await repo.findById(id);
    if (!task) throw new Error("NOT_FOUND");

    if (currentUser.role !== "admin" && task.userId._id.toString() !== currentUser.id) throw new Error("FORBIDDEN");

    const updated = await repo.update(id, dto);
    publishEvent("taskUpdated", updated);
    return updated;
  }

  async deleteTask(id, currentUser) {
    const task = await repo.findById(id);
    if (!task) throw new Error("NOT_FOUND");

    if (currentUser.role !== "admin" && task.userId._id.toString() !== currentUser.id) throw new Error("FORBIDDEN");

    await repo.delete(id);
    publishEvent("taskDeleted", { id });
    return true;
  }
}

export default TaskService;