import { readData, writeData } from '../db/fileDatabase.js';

const USERS_FILE = 'users.json';

const UsersController = {
    getAllUsers: async (req, res) => {
        try {
            const users = readData(USERS_FILE);
            res.status(200).json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
        } catch (error) {
            console.error("Failed to get all users:", error);
            res.status(500).json({ error: 'Failed to read users data.' });
        }
    },
    
    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const users = readData(USERS_FILE);
            const user = users.find(u => u.id === id);
            if (user) {
                res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error("Failed to get user by ID:", error);
            res.status(500).json({ error: 'Failed to read users data.' });
        }
    },
    
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;
        
        try {
            const users = readData(USERS_FILE);
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            const updatedUser = {
                ...users[userIndex],
                name: name || users[userIndex].name,
                email: email || users[userIndex].email,
                updatedAt: new Date().toISOString()
            };

            users[userIndex] = updatedUser;
            writeData(USERS_FILE, users);
            
            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error("Failed to update user:", error);
            res.status(500).json({ error: 'Failed to update user.' });
        }
    },
    
    deleteUser: async (req, res) => {
        const { id } = req.params;
        
        try {
            let users = readData(USERS_FILE);
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const updatedUsers = users.filter(u => u.id !== id);
            writeData(USERS_FILE, updatedUsers);

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Failed to delete user:", error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }
};

export default UsersController;