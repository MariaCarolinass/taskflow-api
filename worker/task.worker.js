import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

async function start() {
  const client = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  await client.connect();
  const sub = client.duplicate();
  await sub.connect();

  console.log("[WORKER] Listening for task events...");
  await sub.subscribe("taskCreated", (message) => {
    const ev = JSON.parse(message);
    console.log("[WORKER] taskCreated", ev);
    // enviar email, registrar métricas, etc.
  });

  await sub.subscribe("taskUpdated", (message) => {
    console.log("[WORKER] taskUpdated", JSON.parse(message));
  });

  await sub.subscribe("taskDeleted", (message) => {
    console.log("[WORKER] taskDeleted", JSON.parse(message));
  });
}

start().catch(err => console.error(err));
