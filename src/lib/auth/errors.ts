import type { z } from "zod";
import {
  AUTH_ERROR_CODES,
  type AuthErrorCode,
} from "@/lib/auth/constants";

interface AuthErrorInit {
  message: string;
  code: AuthErrorCode;
  cause?: unknown;
}

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(init: AuthErrorInit) {
    super(init.message, init.cause !== undefined ? { cause: init.cause } : undefined);
    this.name = "AuthError";
    this.code = init.code;
  }
}

export class AuthInputError extends AuthError {
  readonly issues: z.ZodIssue[];

  constructor(message: string, issues: z.ZodIssue[]) {
    super({
      message,
      code: AUTH_ERROR_CODES.invalidInput,
    });
    this.name = "AuthInputError";
    this.issues = issues;
  }
}

export class AuthNetworkError extends AuthError {
  constructor(message: string, cause?: unknown) {
    super({
      message,
      code: AUTH_ERROR_CODES.network,
      cause,
    });
    this.name = "AuthNetworkError";
  }
}

export class AuthSessionCreateError extends AuthError {
  readonly status: number;

  constructor(status: number, message: string) {
    super({
      message,
      code: AUTH_ERROR_CODES.sessionCreateFailed,
    });
    this.name = "AuthSessionCreateError";
    this.status = status;
  }
}

export class AuthSessionDestroyError extends AuthError {
  readonly status: number;

  constructor(status: number, message: string) {
    super({
      message,
      code: AUTH_ERROR_CODES.sessionDestroyFailed,
    });
    this.name = "AuthSessionDestroyError";
    this.status = status;
  }
}

export function isAuthError(value: unknown): value is AuthError {
  return value instanceof AuthError;
}

export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "認証処理に失敗しました。";
}
