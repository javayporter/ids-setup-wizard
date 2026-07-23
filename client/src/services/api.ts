import type { HealthResponse } from "../../../shared/types/api.types";
import type {
  StartSetupRequest,
  StartSetupResponse,
} from "../../../shared/types/api.types";

/**
 * Base URL for our backend API.
 *
 * During development, React runs on one port (ex: 5173)
 * while the Express backend runs on another (3000).
 *
 * By keeping the base URL in one place, every API request
 * can reuse it. Later we'll likely move this into an
 * environment variable for different environments.
 */
const API_BASE_URL = "http://localhost:3000";

/**
 * Checks whether the backend API is running.
 *
 * This was our first frontend ↔ backend integration and is
 * primarily used during development.
 *
 * Request Flow:
 *
 * React
 *    ↓
 * getHealthCheck()
 *    ↓
 * GET /api/health
 *    ↓
 * Express
 *    ↓
 * Health Route
 *    ↓
 * Health Controller
 *    ↓
 * JSON Response
 *
 * If the request succeeds, we return a strongly typed
 * HealthResponse object.
 *
 * If it fails, we throw an Error so the calling component
 * can decide how to inform the user.
 */
export async function getHealthCheck(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  // A successful network request does not always mean the
  // server completed the request successfully.
  //
  // Example:
  // 404
  // 500
  // 403
  //
  // These all produce a Response object, but response.ok
  // will be false.
  if (!response.ok) {
    throw new Error(
      `Health check failed with status ${response.status}: ${response.statusText}`,
    );
  }

  // Parse the JSON response into our shared type.
  //
  // Because both the frontend and backend reference the same
  // interface, TypeScript helps ensure they stay in sync.
  const data = (await response.json()) as HealthResponse;

  return data;
}

/**
 * Starts a new IDS Setup Wizard session.
 *
 * The frontend only supplies:
 * - dealershipName
 * - clientId
 *
 * Everything else happens on the backend:
 *
 * Validate input
 *      ↓
 * Authenticate with IDS
 *      ↓
 * Retrieve dealer locations
 *      ↓
 * Identify the main location
 *      ↓
 * Create a temporary setup session
 *      ↓
 * Return safe data to React
 *
 * Notice that React never receives the IDS access token.
 * The backend stores it inside the session so future wizard
 * steps can continue without exposing sensitive credentials.
 */
export async function startSetup(
  request: StartSetupRequest,
): Promise<StartSetupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/setup/start`, {
    method: "POST",

    // Tell the backend we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // Convert our JavaScript object into a JSON string so it
    // can be sent in the HTTP request body.
    body: JSON.stringify(request),
  });

  // Convert the backend response into our shared response type.
  //
  // At this point the request has completed, regardless of
  // whether it succeeded or failed.
  const data = (await response.json()) as StartSetupResponse;

  // If the backend returned an error status (400, 403, 500, etc.),
  // throw the response so the React page can decide how to
  // present the error to the user.
  //
  // Later we'll likely replace this with a dedicated ApiError
  // class, similar to AppError on the backend.
  if (!response.ok) {
    throw data;
  }

  // Return the successful setup response to the calling page.
  return data;
}
