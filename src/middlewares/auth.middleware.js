import jwt from "jsonwebtoken";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect().catch(() => {});

const AuthMiddleware = {
  verifyToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) return res.status(401).json({ error: "Token invalidated" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
};

export default AuthMiddleware;