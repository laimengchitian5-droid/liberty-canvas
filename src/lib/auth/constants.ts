export const LC_SESSION_COOKIE = "lc_session" as const;

export const LC_SESSION = {
  maxAgeSeconds: 60 * 60 * 24 * 7,
  algorithm: "HS256",
} as const;

export const AUTH_API_BASE_PATH = "/api/auth/session" as const;

export const AUTH_ERROR_CODES = {
  invalidInput: "AUTH_INVALID_INPUT",
  sessionCreateFailed: "AUTH_SESSION_CREATE_FAILED",
  sessionDestroyFailed: "AUTH_SESSION_DESTROY_FAILED",
  network: "AUTH_NETWORK",
  unauthorized: "AUTH_UNAUTHORIZED",
  conflict: "AUTH_CONFLICT",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const AUTH_HTTP = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  unprocessable: 422,
  serverError: 500,
} as const;

export const AUTH_SESSION_MODES = {
  login: "login",
  signup: "signup",
} as const;

export type AuthSessionMode =
  (typeof AUTH_SESSION_MODES)[keyof typeof AUTH_SESSION_MODES];

export const PUBLIC_USER_IDS = ["guest_user"] as const;
