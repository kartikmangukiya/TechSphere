import express from "express";
import { router as authRoutes } from "./src/routes/auth.routes.js";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("api/v1/auth", authRoutes);
// app.use("api/v1/blogs");
// app.use("api/v1/categories");
// app.use("api/v1/users");
