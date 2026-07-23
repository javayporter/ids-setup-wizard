import type { NextFunction, Request, Response } from "express";
import { startSetupSession } from "../services/setupWorkflow.service.js";

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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { dealershipName, clientId } = req.body as {
    dealershipName?: string;
    clientId?: string;
  };

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
