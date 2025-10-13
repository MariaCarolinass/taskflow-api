import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readData, writeData } from "../db/fileDatabase.js";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const USERS_FILE = 'users.json';

const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect();

const AuthController = {
    register: async (req, res) => {
        const { name, email, password, role = "user" } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }
        
        try {
            const users = readData(USERS_FILE);
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use.' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: hashedPassword,
                role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            users.push(newUser);
            writeData(USERS_FILE, users);

            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.error("Failed to register user:", error);
            res.status(500).json({ error: 'Failed to register user.' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            const users = readData(USERS_FILE);
            const user = users.find(u => u.email === email);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            console.error("Failed to login:", error);
            res.status(500).json({ error: 'Failed to login.' });
        }
    }, 

    logout: async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: 'Token is required for logout.' });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const exp = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            const ttl = exp - currentTime;
            await redisClient.setEx(token, ttl, 'blacklisted');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error("Failed to logout:", error);
            res.status(500).json({ error: 'Failed to logout.' });
        }
    }
};

export default AuthController;