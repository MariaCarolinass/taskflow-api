import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "taskflow",
        });

        console.log("MongoDB Atlas conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar no MongoDB:", error);
        process.exit(1);
    }
};
