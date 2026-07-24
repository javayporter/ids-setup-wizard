import { AppError } from "../errors/AppError.js";

import { createSession, updateSession } from "../stores/setupSession.store.js";

import type { StartSetupResult } from "../types/setup.types.js";

import { generateCredentialPassword } from "../utils/credential.util.js";

import { getLocations, getToken } from "./ids.service.js";

/**
 * Safe result returned after credentials are generated.
 *
 * The complete backend session is not returned because it contains
 * sensitive values such as the IDS access token and Client ID.
 */
interface GenerateCredentialsResult {
  generatedPassword: string;
}

/**
 * Starts a new IDS Setup Wizard session.
 *
 * This function represents the complete business action that happens
 * when the user enters a dealership name and Client ID, then clicks Next.
 *
 * Workflow:
 *
 * Dealership Name + Client ID
 *        ↓
 * Validate and clean the inputs
 *        ↓
 * Request an IDS access token
 *        ↓
 * Use the access token to retrieve all dealer locations
 *        ↓
 * Identify the location marked as the main location
 *        ↓
 * Store the setup information in a temporary backend session
 *        ↓
 * Return only safe information to the frontend
 *
 * The workflow service decides WHAT must happen and in what order.
 *
 * It does not:
 * - Make HTTP requests directly
 * - Know anything about Express
 * - Know anything about React
 * - Know how sessions are physically stored
 *
 * Those responsibilities belong to other layers.
 */
export async function startSetupSession(
  dealershipName: string,
  clientId: string,
): Promise<StartSetupResult> {
  // Clean user input before validating or using it.
  const trimmedDealershipName = dealershipName.trim();
  const trimmedClientId = clientId.trim();

  // Stop early if the dealership name was not provided.
  if (!trimmedDealershipName) {
    throw new AppError(400, "Dealership name is required.");
  }

  // Stop early if the Client ID was not provided.
  if (!trimmedClientId) {
    throw new AppError(400, "Client ID is required.");
  }

  // Ask the IDS service to authenticate the dealer.
  //
  // The IDS service owns the actual HTTP request to IDS.
  const tokenResponse = await getToken(trimmedClientId);

  // Use the returned access token to retrieve all IDS locations.
  //
  // The token remains on the backend and is never sent to React.
  const locations = await getLocations(tokenResponse.AccessToken);

  // Identify the single location IDS marks as the main location.
  //
  // This is application workflow logic, so it belongs here rather
  // than inside ids.service.ts.
  const mainLocation = locations.find((location) => location.IsMainLocation);

  // The wizard cannot continue without a main location because its
  // location code will be required during later setup steps.
  if (!mainLocation) {
    throw new AppError(
      422,
      "IDS returned locations, but no main location was identified.",
      locations,
    );
  }

  // Create the temporary backend session.
  //
  // createSession() generates system-owned fields such as:
  // - sessionId
  // - createdAt
  //
  // The session keeps sensitive information, including the access
  // token, on the backend for use during later wizard steps.
  const session = createSession({
    dealershipName: trimmedDealershipName,
    clientId: trimmedClientId,
    accessToken: tokenResponse.AccessToken,
    tokenExpiryTime: tokenResponse.ExpiryTime,
    expiresInSeconds: tokenResponse.ExpiresInSeconds,
    mainLocation,
    locations,
  });

  // Return only the information the frontend needs for the next screen.
  //
  // Notice that the Client ID and access token are not returned.
  return {
    sessionId: session.sessionId,
    dealershipName: session.dealershipName,
    mainLocation: session.mainLocation,
    locations: session.locations,
  };
}

/**
 * Generates the password used to connect the iCC feed with IDS.
 *
 * Workflow:
 *
 * Session ID
 *      ↓
 * Generate a secure 16-character alphanumeric password
 *      ↓
 * Store the password in the existing backend session
 *      ↓
 * Return only the generated password to the frontend
 *
 * updateSession() also validates that the session exists. If the session
 * cannot be found, the store throws the appropriate AppError.
 */
export function generateSetupCredentials(
  sessionId: string,
): GenerateCredentialsResult {
  const trimmedSessionId = sessionId.trim();

  if (!trimmedSessionId) {
    throw new AppError(400, "Setup session ID is required.");
  }

  const generatedPassword = generateCredentialPassword();

  updateSession(trimmedSessionId, {
    generatedPassword,
  });

  return {
    generatedPassword,
  };
}
