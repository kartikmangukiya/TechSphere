import express from "express";
import { router as authRouter } from "./src/routes/auth.routes.js";

import { router as blogRouter } from "./src/routes/blog.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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
// app.use("/api/v1/users");

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://techsphere.com",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests without an Origin header
//       // e.g. Postman/server-to-server requests
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   }),
// );
