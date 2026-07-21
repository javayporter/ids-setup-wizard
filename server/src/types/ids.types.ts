export interface IdsTokenRequest {
  ClientId: string;
}

export interface IdsTokenResponse {
  ClientId: string;
  AccessToken: string;
  ExpiryTime: string;
  ExpiresInSeconds: number;
}
