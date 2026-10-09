import express from "express";
import { router as authRouter } from "./src/routes/auth.routes.js";
import { router as blogRouter } from "./src/routes/blog.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);