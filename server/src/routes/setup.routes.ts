import { Router } from "express";
import { authenticateDealerController } from "../controllers/setup.controller.js";

// Create a router dedicated to IDS setup-related endpoints.
//
// This router will eventually contain routes for:
// - dealer authentication
// - location retrieval
// - subscription creation
// - subscription verification
const setupRouter = Router();

/**
 * POST /api/setup/authenticate
 *
 * This route receives a Client ID from the frontend and begins
 * the dealer authentication workflow.
 *
 * The route itself does not contain business logic.
 * It only connects the URL to the appropriate controller.
 *
 * Full request flow:
 *
 * Frontend
 *   ↓
 * POST /api/setup/authenticate
 *   ↓
 * setupRouter
 *   ↓
 * authenticateDealerController
 *   ↓
 * setupWorkflow.service.ts
 *   ↓
 * ids.service.ts
 *   ↓
 * IDS POST /Token
 */
setupRouter.post("/authenticate", authenticateDealerController);

export default setupRouter;
