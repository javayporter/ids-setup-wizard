import type { IdsTokenResponse } from "../types/ids.types.js";
import { getToken } from "./ids.service.js";
/**
 * Authenticates a dealer with IDS.
 *
 * Think of the Workflow Service as the "project manager" of the application.
 *
 * It does NOT know how to make HTTP requests.
 * It does NOT know anything about Express.
 * It does NOT know anything about React.
 *
 * Instead, its responsibility is to coordinate the application's
 * business process.
 *
 * In this case, the business process is:
 *
 *   Authenticate Dealer
 *        ↓
 *   Validate the input
 *        ↓
 *   Ask the IDS Service for a token
 *        ↓
 *   Return the token
 *
 * Today this workflow is very small.
 *
 * As the application grows, this function may eventually:
 *
 *   Authenticate Dealer
 *        ↓
 *   Get Token
 *        ↓
 *   Retrieve Locations
 *        ↓
 *   Find the Master Location
 *        ↓
 *   Return everything the frontend needs
 *
 * Notice that none of that belongs inside the IDS Service.
 *
 * The IDS Service should ONLY know how to communicate with IDS.
 *
 * The Workflow Service decides WHAT should happen.
 *
 * The IDS Service knows HOW to communicate with IDS.
 */
export async function authenticateDealer(
  clientId: string,
): Promise<IdsTokenResponse> {
  // Clean up the input before doing anything else.
  //
  // Example:
  // "   ABC123   "
  //
  // becomes
  //
  // "ABC123"
  //
  // We do this here because input validation is application logic,
  // not IDS API logic.
  const trimmedClientId = clientId.trim();

  // Validate the input.
  //
  // IDS requires a Client ID.
  //
  // Rather than sending an unnecessary request to IDS,
  // we stop immediately and return a meaningful error.
  //
  // This saves a network request and gives the user faster feedback.
  if (!trimmedClientId) {
    throw {
      statusCode: 400,
      message: "Client ID is required.",
      rawResponse: null,
    };
  }

  // Delegate the actual HTTP request to the IDS Service.
  //
  // Notice something important...
  //
  // This function never calls fetch().
  //
  // It simply asks another service to do the work.
  //
  // This keeps responsibilities separated and makes each file
  // easier to test and maintain.
  return getToken(trimmedClientId);
}
