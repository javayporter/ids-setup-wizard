import type { NextFunction, Request, Response } from "express";

import {
  generateSetupCredentials,
  startSetupSession,
} from "../services/setupWorkflow.service.js";

interface StartSetupBody {
  dealershipName?: string;
  clientId?: string;
}

interface GenerateCredentialsParams {
  sessionId: string;
}

/**
 * Handles the request that starts a new IDS Setup Wizard session.
 *
 * The frontend sends:
 * - dealershipName
 * - clientId
 *
 * The controller:
 * 1. Reads those values from the HTTP request body.
 * 2. Calls the workflow service.
 * 3. Returns the safe setup-session result.
 * 4. Passes any errors to the global error middleware.
 *
 * The controller does not:
 * - Call IDS directly
 * - Retrieve locations itself
 * - Identify the main location
 * - Create or store the session itself
 *
 * Those responsibilities belong to the workflow and service layers.
 */
export async function startSetupSessionController(
  req: Request<Record<string, never>, unknown, StartSetupBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { dealershipName, clientId } = req.body;

  try {
    const setupResult = await startSetupSession(
      dealershipName ?? "",
      clientId ?? "",
    );

    res.status(201).json({
      success: true,
      data: setupResult,
    });
  } catch (error: unknown) {
    next(error);
  }
}

/**
 * Handles the request that generates credentials for an existing setup
 * session.
 *
 * The session ID is provided in the URL:
 *
 * POST /api/setup/:sessionId/generate-credentials
 *
 * The controller:
 * 1. Reads the session ID from the request parameters.
 * 2. Calls the setup workflow.
 * 3. Returns only the generated credentials needed by the frontend.
 * 4. Passes any errors to the global error middleware.
 *
 * The controller does not:
 * - Generate the password itself
 * - Retrieve or update the session directly
 * - Expose the complete backend session
 */
export function generateSetupCredentialsController(
  req: Request<GenerateCredentialsParams>,
  res: Response,
  next: NextFunction,
): void {
  const { sessionId } = req.params;

  try {
    const credentialsResult = generateSetupCredentials(sessionId);

    res.status(200).json({
      success: true,
      data: credentialsResult,
    });
  } catch (error: unknown) {
    next(error);
  }
}
