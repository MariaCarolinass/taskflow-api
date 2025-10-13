import { readData, writeData } from '../db/fileDatabase.js';
import { createClient } from 'redis';

const DATA_FILE = 'tasks.json';

const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect();

const publishEvent = async (event, data) => {
    await redisClient.publish('tasks.events', JSON.stringify({ event, data }));
};

const TasksController = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = readData(DATA_FILE);
            res.status(200).json(tasks);
        } catch (error) {
            console.error("Failed to get all tasks:", error);
            res.status(500).json({ error: 'Failed to read tasks data.' });
        }
    },
    
    getTaskById: async (req, res) => {
        const { id } = req.params;
        try {
            const tasks = readData(DATA_FILE);
            const task = tasks.find(t => t.id === id);
            if (task) {
                res.status(200).json(task);
            } else {
                res.status(404).json({ error: 'Task not found.' });
            }
        } catch (error) {
            console.error("Failed to get task by ID:", error);
            res.status(500).json({ error: 'Failed to read tasks data.' });
        }
    },
    
    createTask: async (req, res) => {
        try {
            const { title, description, status = "pending" } = req.body;
            
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User ID is required.' });
            }
            
            if (!title || !status) {
                return res.status(400).json({ error: 'Title and status are required.' });
            }

            const tasks = readData(DATA_FILE);
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                status,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            tasks.push(newTask);
            writeData(DATA_FILE, tasks);

            await publishEvent('taskCreated', newTask);

            res.status(201).json({ message: "Task criada com sucesso", task: newTask });
        } catch (error) {
            console.error("Failed to create task:", error);
            res.status(500).json({ error: 'Failed to create task.' });
        }
    },
    
    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, description, status } = req.body;
        
        try {
            const tasks = readData(DATA_FILE);
            const taskIndex = tasks.findIndex(t => t.id === id);
            if (taskIndex === -1) {
                return res.status(404).json({ error: 'Task not found.' });
            }
            
            const updatedTask = {
                ...tasks[taskIndex],
                title: title || tasks[taskIndex].title,
                description: description || tasks[taskIndex].description,
                status: status || tasks[taskIndex].status,
                updatedAt: new Date().toISOString()
            };

            tasks[taskIndex] = updatedTask;
            writeData(DATA_FILE, tasks);
            
            await publishEvent('taskUpdated', updatedTask);

            res.status(200).json({ message: "Task updated successfully", task: updatedTask });
        } catch (error) {
            console.error("Failed to update task:", error);
            res.status(500).json({ error: 'Failed to update task.' });
        }
    },
    
    deleteTask: async (req, res) => {
        const { id } = req.params;
        
        try {
            let tasks = readData(DATA_FILE);
            const taskIndex = tasks.findIndex(t => t.id === id);
            if (taskIndex === -1) {
                return res.status(404).json({ error: 'Task not found.' });
            }

            const deletedTask = tasks.filter(t => t.id !== id);
            writeData(DATA_FILE, deletedTask);

            await publishEvent('taskDeleted', deletedTask);
            
            res.status(200).json({ message: 'Task deleted successfully.' });
        } catch (error) {
            console.error("Failed to delete task:", error);
            res.status(500).json({ error: 'Failed to delete task.' });
        }
    }
};

export default TasksController;