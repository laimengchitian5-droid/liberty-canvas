const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  // Next.js injects inline bootstrap/hydration scripts; nonce wiring is not enabled app-wide.
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  connectSrc: [
    "'self'",
    "https://groq.com",
    "https://*.groq.com",
    "https://api.groq.com",
    "https://*.vercel-storage.com",
    "wss://*.vercel.com",
  ],
  imgSrc: ["'self'", "data:", "https://*.vercel-storage.com"],
  fontSrc: ["'self'"],
  workerSrc: ["'self'"],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
} as const;

function joinDirective(name: string, values: readonly string[]): string {
  return `${name} ${values.join(" ")}`;
}

export function buildContentSecurityPolicy(): string {
  return [
    joinDirective("default-src", CSP_DIRECTIVES.defaultSrc),
    joinDirective("script-src", CSP_DIRECTIVES.scriptSrc),
    joinDirective("style-src", CSP_DIRECTIVES.styleSrc),
    joinDirective("connect-src", CSP_DIRECTIVES.connectSrc),
    joinDirective("img-src", CSP_DIRECTIVES.imgSrc),
    joinDirective("font-src", CSP_DIRECTIVES.fontSrc),
    joinDirective("worker-src", CSP_DIRECTIVES.workerSrc),
    joinDirective("frame-ancestors", CSP_DIRECTIVES.frameAncestors),
    joinDirective("object-src", CSP_DIRECTIVES.objectSrc),
    joinDirective("base-uri", CSP_DIRECTIVES.baseUri),
    joinDirective("form-action", CSP_DIRECTIVES.formAction),
  ].join("; ");
}

export const STATIC_CONTENT_SECURITY_POLICY = buildContentSecurityPolicy();
