export interface JwtPayload {
  userId: number;
  email: string;
  artistId?: number;
  iat?: number;
  exp?: number;
}

export type Enable2FAType = {
  secret: string;
};
