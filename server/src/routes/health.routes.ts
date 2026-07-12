import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IDS Setup Wizard is running.",
    status: "ok",
  });
});

export default healthRouter;
