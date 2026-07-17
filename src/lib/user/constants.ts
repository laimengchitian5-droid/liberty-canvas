export const USER_API_BASE_PATH = "/api/users" as const;

export const DEFAULT_GUEST_USER_ID = "guest_user" as const;

export const USER_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export const USER_DATA_REQUEST = {
  timeoutMs: 8_000,
  cacheTtlMs: 30_000,
  maxRecentApps: 5,
} as const;

export const USER_DATA_HTTP = {
  okMin: 200,
  okMax: 299,
  notFound: 404,
  unprocessable: 422,
  serverError: 500,
} as const;

export const USER_ERROR_CODES = {
  invalidInput: "USER_INVALID_INPUT",
  network: "USER_NETWORK",
  timeout: "USER_TIMEOUT",
  http: "USER_HTTP",
  parse: "USER_PARSE",
  validation: "USER_VALIDATION",
  notFound: "USER_NOT_FOUND",
  aborted: "USER_ABORTED",
} as const;

export type UserErrorCode = (typeof USER_ERROR_CODES)[keyof typeof USER_ERROR_CODES];
