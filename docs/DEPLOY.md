# LibertyCanvas — Deploy & CI/CD

## Production URL

https://liberty-canvas.vercel.app

## Local quality gate

```bash
npm run ci
```

## Vercel CLI (manual production deploy)

```bash
npm run build
npx vercel deploy --prod --yes
```

## Git + GitHub + Vercel auto-deploy

1. Initialize repository (once):

   ```bash
   git init
   git add .
   git commit -m "feat: LibertyCanvas Phase 1 — i18n, SEO v2, Discover funnel"
   ```

2. Create GitHub repo and push:

   ```bash
   gh repo create liberty-canvas --private --source=. --push
   ```

3. Vercel Dashboard → Project **liberty-canvas** → Settings → Git → Connect repository.

4. Set production environment variables (same names as `.env.example` — never commit `.env.local`):

   | Variable                  | Purpose                                      |
   | ------------------------- | -------------------------------------------- |
   | `ANTHROPIC_API_KEY`       | AI advice / chat (preferred)                 |
   | `OPENAI_API_KEY`          | AI fallback                                  |
   | `AI_INFERENCE_API_KEY`    | Optional alias → OpenAI-compatible fallback  |
   | `LC_SESSION_SECRET`       | Cookie / session HMAC (required in prod)     |
   | `ENCRYPTION_SECRET_KEY`   | Optional alias for `LC_SESSION_SECRET`       |
   | `LC_INSIGHTS_SECRET`      | Insights dashboard auth                      |
   | `BLOB_READ_WRITE_TOKEN`   | Builder / analytics persistence              |
   | `NEXT_PUBLIC_SITE_URL`    | Canonical / OG origin (public, not a secret) |

   Local: `cp .env.example .env.local` then fill real values. `.env.local` is gitignored.

## CI (GitHub Actions)

On push/PR to `main`, `master`, or `develop` (`.github/workflows/ci.yml`):

1. **quality** — `lint` → `typecheck` → `format:check` → `test` → `build` (uploads `.next` artifact)
2. **lighthouse** — CWV/SEO gate via `npm run lighthouse:ci` on `/`, `/diagnosis`, `/discover/ja`, …
3. **e2e** — Playwright against the same build artifact

Lighthouse thresholds are runner-realistic (`LH_MIN_*` in the workflow), not fantasy `1.00` scores. Discover locale paths use `/discover/[locale]`, not `/{locale}`.
