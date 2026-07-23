import { Router } from "express";
import { startSetupSessionController } from "../controllers/setup.controller.js";

// Create a router dedicated to IDS setup-related endpoints.
//
// This router will eventually contain routes for:
// - starting a setup session
// - retrieving or updating session data
// - password generation
// - subscription creation
// - subscription verification
const setupRouter = Router();

/**
 * POST /api/setup/start
 *
 * This route receives the dealership name and Client ID from the frontend
 * and begins a new IDS Setup Wizard session.
 *
 * The route itself does not contain business logic.
 * It only connects the URL to the appropriate controller.
 *
 * Full request flow:
 *
 * Frontend
 *   ↓
 * POST /api/setup/start
 *   ↓
 * setupRouter
 *   ↓
 * startSetupSessionController
 *   ↓
 * startSetupSession()
 *   ↓
 * getToken()
 *   ↓
 * getLocations()
 *   ↓
 * identify the main location
 *   ↓
 * create and store the setup session
 *   ↓
 * return safe session data to the frontend
 */
setupRouter.post("/start", startSetupSessionController);

export default setupRouter;
