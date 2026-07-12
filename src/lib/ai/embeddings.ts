import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";
import {
  buildCatalogEmbeddingText,
  buildLocalEmbedding,
} from "@/lib/catalog/localEmbedding";

const DEFAULT_MODEL = "text-embedding-3-small";

export async function embedCatalogTexts(
  texts: readonly string[],
): Promise<number[][]> {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (!openAiKey || texts.length === 0) {
    return texts.map((text) => buildLocalEmbedding(text));
  }

  try {
    const openai = createOpenAI({ apiKey: openAiKey });
    const model = openai.embedding(
      process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_MODEL,
    );
    const { embeddings } = await embedMany({
      model,
      values: [...texts],
    });

    return embeddings.map((entry) => [...entry]);
  } catch {
    return texts.map((text) => buildLocalEmbedding(text));
  }
}

export async function embedCatalogEntry(input: {
  title: string;
  subtitle: string;
  eyebrow: string;
  slug: string;
  searchTags?: readonly string[];
}): Promise<number[]> {
  const text = buildCatalogEmbeddingText(input);
  const [embedding] = await embedCatalogTexts([text]);
  return embedding ?? buildLocalEmbedding(text);
}

export async function embedSearchQuery(query: string): Promise<number[]> {
  const [embedding] = await embedCatalogTexts([query.trim()]);
  return embedding ?? buildLocalEmbedding(query);
}
