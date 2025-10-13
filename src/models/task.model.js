import { readData, writeData } from "../db/fileDatabase.js";
import { v4 as uuidv4 } from 'uuid';

const TASKS_FILE = 'tasks.json';

class Task {
    constructor({ title, description, status = "todo", userId, createdAt }) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.status = status; // todo | doing | done
        this.userId = userId;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static all() {
        return readData(TASKS_FILE);
    }

    static findById(id) {
        const tasks = readData(TASKS_FILE);
        return tasks.find(task => task.id === id);
    }

    save() {
        const tasks = readData(TASKS_FILE);
        tasks.push(this);
        writeData(TASKS_FILE, tasks);
        return this;
    }

    update(updates) {
        const tasks = readData(TASKS_FILE);
        const taskIndex = tasks.findIndex(task => task.id === this.id);
        if (taskIndex === -1) return null;

        const updatedTask = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
        tasks[taskIndex] = updatedTask;
        writeData(TASKS_FILE, tasks);
        return updatedTask;
    }

    delete() {
        const tasks = readData(TASKS_FILE);
        const newTasks = tasks.filter(task => task.id !== this.id);
        if (tasks.length === newTasks.length) return false;

        writeData(TASKS_FILE, newTasks);
        return true;
    }
}

export default Task;