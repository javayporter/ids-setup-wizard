import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import express from "express";
import setupRouter from "./routes/setup.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/setup", setupRouter);

export default app;
