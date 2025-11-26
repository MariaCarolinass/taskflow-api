import UserService from "../services/user.service.js";
const service = new UserService();

const UsersController = {
    getAllUsers: async (req, res) => {
        const users = await service.getAll();
        res.json(users);
    },
    
    getUserById: async (req, res) => {
        const user = await service.getById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    },

    updateUser: async (req, res) => {
        try {
            const updated = await service.update(req.params.id, req.body, req.user);
            res.json({ message: "User updated", user: updated });
        } catch (err) {
            if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
            res.status(500).json({ error: "Failed to update user" });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await service.delete(req.params.id, req.user);
            res.json({ message: "User deleted" });
        } catch (err) {
            if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
};

export default UsersController;