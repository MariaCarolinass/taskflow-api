import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_DIR = process.env.BASE_DIR || './data';

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

export const readData = (filename) => {
    const dataPath = path.join(BASE_DIR, filename);
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, '[]', 'utf-8');
    }
    const raw = fs.readFileSync(dataPath, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error(`Erro ao parsear ${filename}:`, err);
        return [];
    }
};

export const writeData = (filename, data) => {
    const dataPath = path.join(BASE_DIR, filename);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

export const deleteData = (filename) => {
    const dataPath = path.join(BASE_DIR, filename);
    if (fs.existsSync(dataPath)) {
        fs.unlinkSync(dataPath);
    } else {
        throw new Error(`File ${filename} does not exist.`);
    }
};

export const listData = () => {
    return fs.readdirSync(BASE_DIR);
};

export default { readData, writeData, deleteData, listData };
