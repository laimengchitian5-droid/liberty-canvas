/**
 * Generates PNG favicons from public/icons/icon.svg
 * Run: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "icons", "icon.svg");
const iconsDir = join(root, "public", "icons");

const svg = readFileSync(svgPath);

mkdirSync(iconsDir, { recursive: true });

const sizes = [
  { name: "favicon-48.png", size: 48 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  const buffer = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(iconsDir, name), buffer);
  console.log(`Wrote ${name} (${size}x${size})`);
}

const favicon48 = await sharp(svg).resize(48, 48).png().toBuffer();
writeFileSync(join(root, "public", "favicon.ico"), favicon48);
console.log("Wrote favicon.ico (48x48 PNG payload)");
