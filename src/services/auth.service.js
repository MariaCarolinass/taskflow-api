import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRepository from "../repositories/user.repository.js";

dotenv.config();
const repo = new UserRepository();

class AuthService {
  async register({ name, email, password, role }) {
    const existing = await repo.findByEmail(email);
    if (existing) throw new Error("EMAIL_IN_USE");

    const hashed = await bcrypt.hash(password, 10);
    const user = await repo.create({ name, email, password: hashed, role });
    return { id: user._id, email: user.email, role: user.role, name: user.name };
  }

  async login({ email, password }) {
    const user = await repo.findByEmail(email);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
    return { token, user: { id: user._id, email: user.email, role: user.role, name: user.name } };
  }
}

export default AuthService;