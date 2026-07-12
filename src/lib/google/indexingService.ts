import {
  buildQuizPublicUrl,
  publishUrlToGoogleIndexing,
} from "@/lib/google/indexingClient";
import {
  enqueueIndexingFailure,
  listRetryableIndexingEntries,
  markIndexingSuccess,
  recordIndexingQueued,
} from "@/lib/google/indexingAuditLog";

async function processIndexingRequest(params: {
  quizId: string;
  url: string;
}): Promise<{ ok: boolean; retryable: boolean; error?: string }> {
  await recordIndexingQueued(params);

  const result = await publishUrlToGoogleIndexing({
    url: params.url,
    type: "URL_UPDATED",
  });

  if (result.ok) {
    await markIndexingSuccess(params);
    return { ok: true, retryable: false };
  }

  await enqueueIndexingFailure({
    quizId: params.quizId,
    url: params.url,
    error: result.error ?? "Indexing request failed",
  });

  return {
    ok: false,
    retryable: result.retryable,
    error: result.error,
  };
}

export async function triggerQuizIndexing(params: {
  quizId: string;
}): Promise<{ ok: boolean; retryable: boolean; error?: string; url: string }> {
  const url = buildQuizPublicUrl(params.quizId);
  const result = await processIndexingRequest({ quizId: params.quizId, url });
  return { ...result, url };
}

export async function retryFailedIndexingEntries(): Promise<
  Array<{ quizId: string; ok: boolean; retryable: boolean; error?: string; url: string }>
> {
  const retryableEntries = await listRetryableIndexingEntries();
  const results = [];

  for (const entry of retryableEntries) {
    const result = await processIndexingRequest({
      quizId: entry.quizId,
      url: entry.url,
    });

    results.push({
      quizId: entry.quizId,
      url: entry.url,
      ...result,
    });
  }

  return results;
}
