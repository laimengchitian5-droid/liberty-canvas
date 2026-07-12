import { readJsonStore, writeJsonStore } from "@/lib/storage/jsonStore";
import { DEFAULT_APP_TYPE } from "@/types/platform";
import type {
  AIAgentConfig,
  AppType,
  CreateUniversalAppInput,
  StoredUniversalApp,
} from "@/types/platform";
import type { CreateUniversalAppPayload } from "@/lib/validation/appSchema";

const APPS_KEY = "quizzes";

function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || "app";
}

function createAppId(title: string): string {
  const slug = slugifyTitle(title);
  const suffix = crypto.randomUUID().split("-")[0];
  return `${slug}-${suffix}`;
}

async function readAllApps(): Promise<StoredUniversalApp[]> {
  return readJsonStore<StoredUniversalApp[]>(APPS_KEY, []);
}

async function writeAllApps(apps: StoredUniversalApp[]): Promise<void> {
  await writeJsonStore(APPS_KEY, apps);
}

function buildAiAgentConfig(
  input: CreateUniversalAppInput,
): AIAgentConfig | undefined {
  if (input.appType !== "ai_agent") {
    return undefined;
  }

  if (!input.systemPromptOverride || !input.responseGuidelines) {
    return undefined;
  }

  return {
    systemPromptOverride: input.systemPromptOverride,
    responseGuidelines: input.responseGuidelines,
  };
}

export function mapValidatedPayloadToInput(
  payload: CreateUniversalAppPayload,
): CreateUniversalAppInput {
  if (payload.appType === "assessment") {
    return {
      title: payload.title,
      description: payload.description,
      authorId: payload.authorId,
      appType: payload.appType,
      questions: payload.questions,
      resultsMapping: payload.resultsMapping,
    };
  }

  if (payload.appType === "ai_agent") {
    return {
      title: payload.title,
      description: payload.description,
      authorId: payload.authorId,
      appType: payload.appType,
      systemPromptOverride: payload.systemPromptOverride,
      responseGuidelines: payload.responseGuidelines,
      questions: [],
      resultsMapping: [],
    };
  }

  if (payload.appType === "interactive_media") {
    return {
      title: payload.title,
      description: payload.description,
      authorId: payload.authorId,
      appType: "interactive_media",
      questions: [],
      resultsMapping: [],
    };
  }

  return {
    title: payload.title,
    description: payload.description,
    authorId: payload.authorId,
    appType: "custom_tool",
    questions: [],
    resultsMapping: [],
  };
}

export async function saveUniversalApp(
  input: CreateUniversalAppInput,
): Promise<StoredUniversalApp> {
  const apps = await readAllApps();
  const now = new Date().toISOString();

  const app: StoredUniversalApp = {
    id: createAppId(input.title),
    title: input.title,
    description: input.description,
    authorId: input.authorId,
    appType: input.appType ?? DEFAULT_APP_TYPE,
    questions: input.questions ?? [],
    resultsMapping: input.resultsMapping ?? [],
    aiAgent: buildAiAgentConfig(input),
    createdAt: now,
    updatedAt: now,
  };

  apps.push(app);
  await writeAllApps(apps);

  return app;
}

export async function getAppById(id: string): Promise<StoredUniversalApp | null> {
  const apps = await readAllApps();
  return apps.find((app) => app.id === id) ?? null;
}

export async function listApps(): Promise<StoredUniversalApp[]> {
  const apps = await readAllApps();
  return [...apps].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function listAppIds(): Promise<string[]> {
  const apps = await readAllApps();
  return apps.map((app) => app.id);
}

export async function listAppsByType(
  appType: AppType,
): Promise<StoredUniversalApp[]> {
  const apps = await listApps();
  return apps.filter((app) => app.appType === appType);
}

// Backward-compatible quiz aliases
export const saveCustomQuiz = saveUniversalApp;
export const getCustomQuizById = getAppById;
export const listCustomQuizzes = listApps;
export const listCustomQuizIds = listAppIds;
