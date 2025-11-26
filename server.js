import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectMongo } from "./src/db/mongo.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
