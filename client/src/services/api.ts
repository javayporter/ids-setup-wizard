import type { HealthResponse } from "../../../shared/types/api.types";

const API_BASE_URL = "http://localhost:3000";

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
