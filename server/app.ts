import express from "express";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("api/v1/auth");
app.use("api/v1/blogs");
app.use("api/v1/categories");
app.use("api/v1/users");