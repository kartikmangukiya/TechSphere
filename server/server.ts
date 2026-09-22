import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 1000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connect error : ", err);
    process.exit(1);
  });
