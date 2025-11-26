import AuthService from "../services/auth.service.js";
import { CreateUserDTO } from "../dtos/user.dto.js";
import { createClient } from "redis";

const service = new AuthService();
const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect().catch(() => {});

const AuthController = {
    register: async (req, res) => {
        try {
          const dto = new CreateUserDTO(req.body);
          const user = await service.register(dto);
          res.status(201).json({ message: "User registered", user });
        } catch (err) {
          if (err.message === "EMAIL_IN_USE") return res.status(409).json({ error: "Email already in use" });
          console.error(err);
          res.status(500).json({ error: "Failed to register" });
        }
    },
    
    login: async (req, res) => {
        try {
            const { token, user } = await service.login(req.body);
            res.json({ message: "Login successful", token, user });
        } catch (err) {
            if (err.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Invalid credentials" });
            console.error(err);
            res.status(500).json({ error: "Failed to login" });
        }
    },

    logout: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];
            if (!token) return res.status(400).json({ error: "Token required" });

            const decoded = await import("jsonwebtoken").then(m => m.default.verify(token, process.env.JWT_SECRET));
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
            await redisClient.setEx(`blacklist:${token}`, ttl, "1");
            }
            res.json({ message: "Logout successful" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to logout" });
        }
    }
};

export default AuthController;