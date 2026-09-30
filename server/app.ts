import express from "express";
import { router as authRouter } from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/blogs");
// app.use("/api/v1/categories");
// app.use("/api/v1/users");
