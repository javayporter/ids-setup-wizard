import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import express from "express";
import setupRouter from "./routes/setup.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/setup", setupRouter);

// Register the global error handler LAST.
app.use(errorHandler);

export default app;
