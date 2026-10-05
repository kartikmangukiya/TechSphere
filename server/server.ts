import "dotenv/config";

import { app } from "./app.js";
import { connectDB } from "./src/config/db.js";

const PORT = Number(process.env.PORT) || 2891;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
