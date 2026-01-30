import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(`>>> Request: ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  console.log("Health check hit!");
  res.json({ status: "ok" });
});

export default app;
