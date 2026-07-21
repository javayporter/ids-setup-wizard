import type { Request, Response } from "express";
import { authenticateDealer } from "../services/setupWorkflow.service.js";

/**
 * Handles requests from the frontend to begin the IDS
 * authentication workflow.
 *
 * Why is this endpoint POST?
 *
 * Although the workflow eventually requests a token from IDS,
 * the frontend is not asking IDS for a token directly.
 *
 * The frontend is asking OUR application to perform the
 * "Authenticate Dealer" business action.
 *
 * Flow:
 *
 * React
 *   ↓
 * POST /api/setup/authenticate
 *   ↓
 * Controller
 *   ↓
 * Workflow Service
 *   ↓
 * IDS Service
 *   ↓
 * POST https://.../Token
 *   ↓
 * IDS API
 *
 * Responsibilities:
 * - Read data from the incoming HTTP request.
 * - Call the workflow service.
 * - Return an HTTP response to the frontend.
 *
 * The controller should NOT:
 * - Know how to communicate with IDS.
 * - Contain business logic.
 * - Validate IDS-specific rules.
 */

export async function authenticateDealerController(
  req: Request,
  res: Response,
): Promise<void> {
  const { clientId } = req.body as { clientId?: string };

  try {
    const tokenResponse = await authenticateDealer(clientId ?? "");

    res.status(200).json({
      success: true,
      data: tokenResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to authenticate dealer.",
      error,
    });
  }
}
