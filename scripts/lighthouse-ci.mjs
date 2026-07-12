/**
 * Lighthouse CI — Core Web Vitals gate for LibertyCanvas key routes.
 * Usage: npm run build && npm run start & LIGHTHOUSE_BASE_URL=http://127.0.0.1:3000 node scripts/lighthouse-ci.mjs
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const BASE_URL = process.env.LIGHTHOUSE_BASE_URL ?? "http://127.0.0.1:3000";
const PATHS = ["/", "/diagnosis/play/big-five", "/discover/ja", "/diagnosis"];

const THRESHOLDS = {
  performance: Number(process.env.LH_MIN_PERFORMANCE ?? 0.72),
  accessibility: Number(process.env.LH_MIN_ACCESSIBILITY ?? 0.92),
  "best-practices": Number(process.env.LH_MIN_BP ?? 0.85),
  seo: Number(process.env.LH_MIN_SEO ?? 0.9),
};

async function waitForServer(url, attempts = 30) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok || response.status === 308) {
        return;
      }
    } catch {
      // retry
    }

    await delay(1000);
  }

  throw new Error(`Server not ready at ${url}`);
}

async function runLighthouse(url) {
  const { default: lighthouse } = await import("lighthouse");
  const chromeLauncher = await import("chrome-launcher");

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });

    return result?.lhr?.categories ?? null;
  } finally {
    await chrome.kill();
  }
}

function assertThresholds(path, categories) {
  const failures = [];

  for (const [key, minScore] of Object.entries(THRESHOLDS)) {
    const score = categories[key]?.score;

    if (typeof score !== "number" || score < minScore) {
      failures.push(`${key}: ${score ?? "n/a"} < ${minScore}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Lighthouse thresholds failed for ${path}\n${failures.join("\n")}`);
  }
}

async function main() {
  const healthUrl = `${BASE_URL}/`;
  await waitForServer(healthUrl);

  for (const path of PATHS) {
    const url = `${BASE_URL}${path}`;
    console.log(`[lighthouse-ci] Auditing ${url}`);
    const categories = await runLighthouse(url);

    if (!categories) {
      throw new Error(`No Lighthouse result for ${url}`);
    }

    assertThresholds(path, categories);
    console.log(
      `[lighthouse-ci] OK ${path} — perf ${categories.performance?.score} a11y ${categories.accessibility?.score}`,
    );
  }

  console.log("[lighthouse-ci] All routes passed.");
}

const shouldSpawnServer = process.env.LIGHTHOUSE_SPAWN_SERVER === "1";

if (shouldSpawnServer) {
  const server = spawn("npm", ["run", "start", "--", "-p", "3000"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, PORT: "3000" },
  });

  try {
    await main();
  } finally {
    server.kill("SIGTERM");
  }
} else {
  await main();
}
