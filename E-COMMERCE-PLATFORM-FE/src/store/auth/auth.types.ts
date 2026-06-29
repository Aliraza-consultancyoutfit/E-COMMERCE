export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Profile {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

/** Shape of the JWT payload signed by the backend. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
