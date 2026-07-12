import { head, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function localFilePath(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

async function readLocalJson<T>(key: string, fallback: T): Promise<T> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = localFilePath(key);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalJson<T>(key: string, value: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(localFilePath(key), JSON.stringify(value, null, 2), "utf-8");
}

async function readBlobJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const metadata = await head(`personality-quiz/${key}.json`);
    const response = await fetch(metadata.url, { cache: "no-store" });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function writeBlobJson<T>(key: string, value: T): Promise<void> {
  await put(`personality-quiz/${key}.json`, JSON.stringify(value), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readJsonStore<T>(key: string, fallback: T): Promise<T> {
  if (isBlobStorageEnabled()) {
    return readBlobJson(key, fallback);
  }

  return readLocalJson(key, fallback);
}

export async function writeJsonStore<T>(key: string, value: T): Promise<void> {
  if (isBlobStorageEnabled()) {
    await writeBlobJson(key, value);
    return;
  }

  await writeLocalJson(key, value);
}

export function getActiveStorageMode(): "blob" | "local" {
  return isBlobStorageEnabled() ? "blob" : "local";
}
