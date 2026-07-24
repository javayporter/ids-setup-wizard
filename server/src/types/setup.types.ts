import type { IdsLocationResponse } from "./ids.types.js";

export interface CreateSetupSession {
  dealershipName: string;
  clientId: string;
  accessToken: string;
  tokenExpiryTime: string;
  expiresInSeconds: number;
  mainLocation: IdsLocationResponse;
  locations: IdsLocationResponse[];
}

export interface SetupSession {
  sessionId: string;
  createdAt: Date;
  dealershipName: string;
  clientId: string;
  accessToken: string;
  tokenExpiryTime: string;
  expiresInSeconds: number;
  mainLocation: IdsLocationResponse;
  locations: IdsLocationResponse[];
  generatedPassword: string | null;
}

export interface StartSetupResult {
  sessionId: string;
  dealershipName: string;
  mainLocation: IdsLocationResponse;
  locations: IdsLocationResponse[];
}
