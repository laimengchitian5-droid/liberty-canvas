import type { z } from "zod";
import { USER_ERROR_CODES, type UserErrorCode } from "@/lib/user/constants";

interface UserDataErrorInit {
  message: string;
  code: UserErrorCode;
  cause?: unknown;
}

export class UserDataError extends Error {
  readonly code: UserErrorCode;

  constructor(init: UserDataErrorInit) {
    super(init.message, init.cause !== undefined ? { cause: init.cause } : undefined);
    this.name = "UserDataError";
    this.code = init.code;
  }
}

export class UserDataInputError extends UserDataError {
  constructor(message: string, cause?: unknown) {
    super({
      message,
      code: USER_ERROR_CODES.invalidInput,
      cause,
    });
    this.name = "UserDataInputError";
  }
}

export class UserDataNetworkError extends UserDataError {
  constructor(message: string, cause?: unknown) {
    super({
      message,
      code: USER_ERROR_CODES.network,
      cause,
    });
    this.name = "UserDataNetworkError";
  }
}

export class UserDataTimeoutError extends UserDataError {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super({
      message: `ユーザーデータの取得がタイムアウトしました（${timeoutMs}ms）。`,
      code: USER_ERROR_CODES.timeout,
    });
    this.name = "UserDataTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export class UserDataHttpError extends UserDataError {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super({
      message: message ?? `ユーザーデータ API が ${status} を返しました。`,
      code: status === 404 ? USER_ERROR_CODES.notFound : USER_ERROR_CODES.http,
    });
    this.name = "UserDataHttpError";
    this.status = status;
    this.statusText = statusText;
  }
}

export class UserDataParseError extends UserDataError {
  readonly rawBody: string;

  constructor(message: string, rawBody: string, cause?: unknown) {
    super({
      message,
      code: USER_ERROR_CODES.parse,
      cause,
    });
    this.name = "UserDataParseError";
    this.rawBody = rawBody;
  }
}

export class UserDataValidationError extends UserDataError {
  readonly issues: z.ZodIssue[];

  constructor(message: string, issues: z.ZodIssue[]) {
    super({
      message,
      code: USER_ERROR_CODES.validation,
    });
    this.name = "UserDataValidationError";
    this.issues = issues;
  }
}

export class UserDataAbortedError extends UserDataError {
  constructor() {
    super({
      message: "ユーザーデータの取得がキャンセルされました。",
      code: USER_ERROR_CODES.aborted,
    });
    this.name = "UserDataAbortedError";
  }
}

export function isUserDataError(value: unknown): value is UserDataError {
  return value instanceof UserDataError;
}
