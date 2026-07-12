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

4. Set production environment variables:

   | Variable | Purpose |
   |----------|---------|
   | `BLOB_READ_WRITE_TOKEN` | Builder / analytics persistence |
   | `LC_INSIGHTS_SECRET` | Insights dashboard auth |
   | `ANTHROPIC_API_KEY` | AI advice / chat |

## CI (GitHub Actions)

On push/PR to `main` or `master`:

- `npm run lint`
- `npm run test` (85+ tests)
- `npm run build`
- Playwright E2E (optional job)
