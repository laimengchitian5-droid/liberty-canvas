import type { BuilderDiagnosisDefinition } from "@/types/builder";
import { BUILDER_CREATOR_TAGS } from "@/types/builder";

const DRAFT_INDEX_KEY = "lc-builder-draft-index";
const DRAFT_PREFIX = "lc-builder-draft:";

export interface BuilderDraftRecord {
  id: string;
  title: string;
  slug: string;
  updatedAt: number;
  definition: BuilderDiagnosisDefinition;
}

function readIndex(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(DRAFT_INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(ids: readonly string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(ids));
  } catch {
    // quota exceeded
  }
}

export function createDefaultBuilderDraft(): BuilderDiagnosisDefinition {
  const id = `builder-${crypto.randomUUID().slice(0, 8)}`;

  return {
    id,
    slug: `draft-${id.slice(-6)}`,
    eyebrow: "No-Code Builder",
    title: "新しい診断",
    subtitle: "会話型フローでつくるオリジナル性格診断",
    estimatedMinutes: 5,
    themeColor: "#8B5CF6",
    creatorTags: [BUILDER_CREATOR_TAGS[0]!],
    startBlockId: "q-1",
    blocks: [
      {
        type: "CONVERSATIONAL_QUESTION",
        id: "q-1",
        prompt: "最初の質問をここに入力してください",
        choices: [
          {
            id: "q-1-a",
            label: "選択肢A",
            scores: { openness: 0.4, extraversion: 0.2 },
          },
          {
            id: "q-1-b",
            label: "選択肢B",
            scores: { conscientiousness: 0.4, agreeableness: 0.2 },
          },
        ],
      },
      {
        type: "AI_INTERMEDIATE_FEEDBACK",
        id: "fb-1",
        triggerAfterBlockId: "q-1",
        affirmationTemplate: "「{choice}」— 素敵な選択ですね ✨",
        autoAdvanceMs: 2400,
      },
    ],
    resultConfig: {
      layout: "character_archetype_card",
      results: [
        {
          id: "lc-draft-alpha",
          title: "タイプA",
          subtitle: "LibertyCanvas 認定・あなたらしい軌道",
          analysis: "あなたは自分らしいペースで関係性を育てやすいタイプです。",
          themeColor: "#8B5CF6",
          traitProfile: {
            trait_openness: 0.7,
            trait_extraversion: 0.5,
            trait_agreeableness: 0.5,
            trait_conscientiousness: 0.4,
            trait_empathy: 0.5,
            trait_neuroticism: 0.3,
          },
          affirmationLine: "あなたの星は、今この瞬間も十分に美しく輝いています。",
        },
      ],
    },
  };
}

export function listBuilderDrafts(): BuilderDraftRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  return readIndex()
    .map((id) => loadBuilderDraft(id))
    .filter((entry): entry is BuilderDraftRecord => entry !== null)
    .sort((left, right) => right.updatedAt - left.updatedAt);
}

export function loadBuilderDraft(id: string): BuilderDraftRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${id}`);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as BuilderDraftRecord;

    if (!parsed.definition?.blocks?.length) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveBuilderDraft(
  definition: BuilderDiagnosisDefinition,
): BuilderDraftRecord {
  const record: BuilderDraftRecord = {
    id: definition.id,
    title: definition.title,
    slug: definition.slug,
    updatedAt: Date.now(),
    definition,
  };

  if (typeof window === "undefined") {
    return record;
  }

  try {
    localStorage.setItem(
      `${DRAFT_PREFIX}${definition.id}`,
      JSON.stringify(record),
    );

    const index = readIndex();

    if (!index.includes(definition.id)) {
      writeIndex([definition.id, ...index]);
    }
  } catch {
    // ignore quota errors
  }

  return record;
}

export function deleteBuilderDraft(id: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
    writeIndex(readIndex().filter((entry) => entry !== id));
  } catch {
    // ignore
  }
}
