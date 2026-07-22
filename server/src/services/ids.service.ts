import type { IdsTokenRequest, IdsTokenResponse } from "../types/ids.types.js";
import { AppError } from "../errors/AppError.js";

// Base URL for the IDS External API.
// Keeping this in one place makes it easy to change environments later
// (development, staging, production).
const IDS_BASE_URL =
  "https://mb3.integrateddealersystems.com/IDSCoreExternalApi/v1";

/**
 * Requests an access token from IDS.
 *
 * Responsibility:
 * - Accept a client ID from our application.
 * - Build the request expected by IDS.
 * - Send the HTTP request.
 * - Return the IDS response.
 *
 * This service DOES NOT:
 * - Know anything about Express.
 * - Know anything about React.
 * - Read data from an HTTP request.
 * - Send HTTP responses.
 *
 * It has one job:
 * Talk to IDS.
 */
export async function getToken(clientId: string): Promise<IdsTokenResponse> {
  // Build the request body exactly how IDS expects it.
  //
  // Notice the property is "ClientId", not "clientId".
  // We keep the IDS naming convention here because this
  // object represents THEIR API contract.
  const requestBody: IdsTokenRequest = {
    ClientId: clientId,
  };

  // Send the POST request to IDS.
  const response = await fetch(`${IDS_BASE_URL}/Token`, {
    method: "POST",

    // Tell IDS we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // Convert our JavaScript object into JSON.
    body: JSON.stringify(requestBody),
  });

  // If IDS returns anything other than a successful response,
  // preserve as much information as possible.
  //
  // The frontend support team currently relies on the helpful
  // IDS error messages shown in Postman. We want to preserve
  // those rather than replacing them with a generic error.
  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);

    throw new AppError(response.status, "IDS token request failed.", errorBody);
  }

  // Parse the successful IDS response into our strongly typed interface.
  const data = (await response.json()) as IdsTokenResponse;

  // Return the token information back to whoever called this service.
  return data;
}
