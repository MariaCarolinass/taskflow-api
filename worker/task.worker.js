import { createClient } from "redis";

async function startWorker() {
  const client = createClient({ url: "redis://localhost:6379" });
  await client.connect();

  const subscriber = client.duplicate();
  await subscriber.connect();

  await subscriber.subscribe("tasks.events", (message) => {
    const event = JSON.parse(message);
    console.log(`[WORKER] Evento recebido: ${event.action}`, event.task);
  });

  console.log("[WORKER] Listening to task events...");
}

startWorker();
