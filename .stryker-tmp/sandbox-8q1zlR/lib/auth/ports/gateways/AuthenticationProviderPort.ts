// @ts-nocheck
import { Result } from "@/lib/core/result";
import { Email } from "../../domain/value-objects/email.vo";

export interface RegisterParams {
  email: Email;
  password: string;
  displayName: string;
}

export interface RegisterResult {
  userId: string;
  email: string;
  requiresEmailVerification: boolean;
}

export interface LoginParams {
  email: Email;
  password: string;
}

export interface LoginResult {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthenticationProviderPort {
  register(params: RegisterParams): Promise<Result<RegisterResult>>;
  login(params: LoginParams): Promise<Result<LoginResult>>;
  logout(userId: string): Promise<Result<void>>;
  verifyEmail(token: string): Promise<Result<void>>;
  sendPasswordResetEmail(email: Email): Promise<Result<void>>;
  resetPassword(token: string, newPassword: string): Promise<Result<void>>;
}
