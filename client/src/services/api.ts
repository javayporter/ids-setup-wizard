import type {
  GenerateSetupCredentialsResponse,
  HealthResponse,
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
 */
export async function getHealthCheck(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(
      `Health check failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const data = (await response.json()) as HealthResponse;

  return data;
}

/**
 * Starts a new IDS Setup Wizard session.
 *
 * The frontend supplies:
 * - dealershipName
 * - clientId
 *
 * The backend authenticates with IDS, retrieves locations,
 * identifies the main location, and creates a temporary
 * setup session.
 */
export async function startSetup(
  request: StartSetupRequest,
): Promise<StartSetupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/setup/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as StartSetupResponse;

  if (!response.ok) {
    throw data;
  }

  return data;
}

/**
 * Generates the credentials required to configure the IDS API feed in iCC.
 *
 * The backend:
 * - validates that the setup session exists
 * - generates a secure 16-character password
 * - stores that password in the backend session
 * - returns only the generated password to React
 */
export async function generateSetupCredentials(
  sessionId: string,
): Promise<GenerateSetupCredentialsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/setup/${encodeURIComponent(
      sessionId,
    )}/generate-credentials`,
    {
      method: "POST",
    },
  );

  const data = (await response.json()) as GenerateSetupCredentialsResponse;

  if (!response.ok) {
    throw data;
  }

  return data;
}
