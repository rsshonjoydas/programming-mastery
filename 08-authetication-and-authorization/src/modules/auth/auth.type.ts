export interface JwtPayload {
  userId: number;
  email: string;
  artistId?: number;
  iat?: number;
  exp?: number;
}
