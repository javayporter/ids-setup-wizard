import healthRouter from "./routes/health.routes.js";
import express from "express";

const app = express();

app.use;

app.use("/api/health", healthRouter);

export default app;
