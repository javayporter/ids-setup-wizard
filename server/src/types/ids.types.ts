export interface IdsTokenRequest {
  ClientId: string;
}

export interface IdsTokenResponse {
  ClientId: string;
  AccessToken: string;
  ExpiryTime: string;
  ExpiresInSeconds: number;
}

export interface IdsLocationResponse {
  IsMainLocation: boolean;
  Location: string;
  Name: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  BusinessPhone: string;
  MasterLocations: IdsLocationResponse[];
}
