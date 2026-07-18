/**
 * Production deploy gate — quality first, deploy only with --prod.
 *
 * Usage:
 *   node scripts/deploy-prod-gate.mjs           # npm run ci:release only
 *   node scripts/deploy-prod-gate.mjs --prod    # ci:release, then npm run deploy:prod
 *
 * Uses `ci:release` (lint + typecheck + test + build), not full `ci`.
 * Repo-wide Prettier debt makes `format:check` a false deploy blocker.
 *
 * Rejected sketch defects:
 * - git add / commit / push origin main
 * - inventing CONDUCTION_TELEMETRY_SECRET + vercel env overwrite
 * - swallowing test output / broken npm run tsc
 * - bash-only Windows-hostile pipeline
 */
import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const deployProd = args.has("--prod");

function runNpm(script) {
  console.log(`[deploy-prod-gate] npm run ${script}`);
  const result = spawnSync("npm", ["run", script], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  if (result.error) {
    console.error(`[deploy-prod-gate] failed to spawn npm: ${result.error.message}`);
    process.exit(1);
  }

  const code = result.status ?? 1;
  if (code !== 0) {
    console.error(`[deploy-prod-gate] npm run ${script} exited with ${code}`);
    process.exit(code);
  }
}

console.log(
  `[deploy-prod-gate] starting (mode=${deployProd ? "ci+prod" : "ci-only"})`,
);

runNpm("ci:release");

if (!deployProd) {
  console.log(
    "[deploy-prod-gate] release gate passed. Re-run with --prod to deploy.",
  );
  process.exit(0);
}

runNpm("deploy:prod");
console.log("[deploy-prod-gate] production deploy finished.");
