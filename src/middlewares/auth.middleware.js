import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect();

const AuthMiddleware = {
    verifyToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!authHeader) return res.status(401).json({ error: 'Authorization header is missing.' });
        if (!token) return res.status(401).json({ error: 'Access token is missing or invalid.' });

        try {
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) return res.status(401).json({ error: 'Token is blacklisted.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
        }
    }
};

export default AuthMiddleware;