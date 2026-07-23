/**
 * Public API contract shared between the frontend and backend.
 *
 * These types describe the data exchanged over HTTP and intentionally
 * exclude backend-only session state and authentication details.
 */

export interface HealthResponse {
  success: boolean;
  message: string;
  status: string;
}

export interface IdsLocation {
  IsMainLocation: boolean;
  Location: string;
  Name: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  BusinessPhone: string;
  MasterLocations: IdsLocation[] | null;
}

export interface StartSetupRequest {
  dealershipName: string;
  clientId: string;
}

export interface StartSetupResult {
  sessionId: string;
  dealershipName: string;
  mainLocation: IdsLocation;
  locations: IdsLocation[];
}

export interface StartSetupResponse {
  success: boolean;
  data: StartSetupResult;
}
