import type {
  GenerateSetupCredentialsResponse,
  HealthResponse,
  StartSetupRequest,
  StartSetupResponse,
} from "../../../shared/types/api.types";

import { ApiError } from "../errors/ApiError";

/**
 * Base URL for the backend API.
 *
 * Vite loads this value from the client's environment files,
 * such as client/.env.local.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fail immediately with a clear configuration error instead of
// allowing requests to be sent to an undefined URL.
if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Create client/.env.local (or update it) and define VITE_API_BASE_URL.",
  );
}

/**
 * Represents the general shape of an error response returned
 * by the backend.
 *
 * All properties are optional because an API error response
 * may not always contain every field.
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  details?: unknown;
}

/**
 * Attempts to read a response body as JSON.
 *
 * Some failed responses may have an empty body or return
 * non-JSON content. In those cases, this returns undefined
 * instead of causing response.json() to throw another error.
 */
async function parseJsonResponse<T>(
  response: Response,
): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

/**
 * Converts a failed fetch response into a consistent ApiError.
 *
 * This gives the rest of the frontend a predictable error type
 * containing:
 * - a readable message
 * - the HTTP status
 * - an optional machine-readable code
 * - optional additional error details
 */
async function createApiError(response: Response): Promise<ApiError> {
  const data = await parseJsonResponse<ApiErrorResponse>(response);

  const message =
    data?.message ||
    data?.error ||
    response.statusText ||
    `Request failed with status ${response.status}`;

  return new ApiError(
    message,
    response.status,
    data?.code,
    data?.details ?? data,
  );
}

/**
 * Checks whether the backend API is running.
 *
 * This was the first frontend-to-backend integration and is
 * primarily used during development.
 *
 * Request flow:
 *
 * React
 *    ↓
 * getHealthCheck()
 *    ↓
 * GET /api/health
 *    ↓
 * Express
 *    ↓
 * Health route
 *    ↓
 * Health controller
 *    ↓
 * JSON response
 */
export async function getHealthCheck(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw await createApiError(response);
  }

  const data = await parseJsonResponse<HealthResponse>(response);

  if (!data) {
    throw new ApiError(
      "The health check returned an invalid or empty response.",
      response.status,
    );
  }

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

  if (!response.ok) {
    throw await createApiError(response);
  }

  const data = await parseJsonResponse<StartSetupResponse>(response);

  if (!data) {
    throw new ApiError(
      "The setup request returned an invalid or empty response.",
      response.status,
    );
  }

  return data;
}

/**
 * Generates the credentials required to configure the IDS API
 * feed in iCC.
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

  if (!response.ok) {
    throw await createApiError(response);
  }

  const data =
    await parseJsonResponse<GenerateSetupCredentialsResponse>(response);

  if (!data) {
    throw new ApiError(
      "The credential request returned an invalid or empty response.",
      response.status,
    );
  }

  return data;
}
