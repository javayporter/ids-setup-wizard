import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRouter);

export default app;
