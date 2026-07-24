import { Router } from "express";

import {
  generateSetupCredentialsController,
  startSetupSessionController,
} from "../controllers/setup.controller.js";

// Create a router dedicated to IDS setup-related endpoints.
//
// This router will eventually contain routes for:
// - starting a setup session
// - retrieving or updating session data
// - credential generation
// - subscription creation
// - subscription verification
const setupRouter = Router();

/**
 * POST /api/setup/start
 *
 * Begins a brand-new IDS Setup Wizard session.
 *
 * The frontend provides:
 * - dealership name
 * - IDS Client ID
 *
 * The workflow:
 *
 * Frontend
 *   ↓
 * POST /api/setup/start
 *   ↓
 * startSetupSessionController
 *   ↓
 * startSetupSession()
 *   ↓
 * Authenticate with IDS
 *   ↓
 * Retrieve dealer locations
 *   ↓
 * Identify the main location
 *   ↓
 * Create a backend setup session
 *   ↓
 * Return safe session data
 */
setupRouter.post("/start", startSetupSessionController);

/**
 * POST /api/setup/:sessionId/generate-credentials
 *
 * Generates the credentials needed for the iCC inventory feed.
 *
 * The setup session already contains the authenticated IDS context.
 * This endpoint generates a secure password, stores it in the backend
 * session, and returns only the generated credential required by the
 * frontend.
 *
 * Workflow:
 *
 * Frontend
 *   ↓
 * POST /api/setup/{sessionId}/generate-credentials
 *   ↓
 * generateSetupCredentialsController
 *   ↓
 * generateSetupCredentials()
 *   ↓
 * Generate secure password
 *   ↓
 * Update backend session
 *   ↓
 * Return generated password
 */
setupRouter.post(
  "/:sessionId/generate-credentials",
  generateSetupCredentialsController,
);

export default setupRouter;
