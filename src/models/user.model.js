import { readData, writeData } from "../db/fileDatabase.js";
import { v4 as uuidv4 } from 'uuid';

const USERS_FILE = 'users.json';

class USER {
    constructor({ name, email, password, role = "user", createdAt }) {
        this.id = uuidv4();
        this.name = name;
        this.email = email;
        this.password = password; // hashed password
        this.role = role; // 'user', 'admin'
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static all() {
        return readData(USERS_FILE);
    }

    static findById(id) {
        const users = readData(USERS_FILE);
        return users.find(user => user.id === id);
    }

    static findByEmail(email) {
        const users = readData(USERS_FILE);
        return users.find(user => user.email === email);
    }

    save() {
        const users = readData(USERS_FILE);
        users.push(this);
        writeData(USERS_FILE, users);
        return this;
    }

    update(updates) {
        const users = readData(USERS_FILE);
        const userIndex = users.findIndex(user => user.id === this.id);
        if (userIndex === -1) return null;

        const updatedUser = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
        users[userIndex] = updatedUser;
        writeData(USERS_FILE, users);
        return updatedUser;
    }

    delete() {
        let users = readData(USERS_FILE);
        const newUsers = users.filter(user => user.id !== this.id);
        if (users.length === newUsers.length) return false;

        writeData(USERS_FILE, newUsers);
        return true;
    }
}

export default USER;