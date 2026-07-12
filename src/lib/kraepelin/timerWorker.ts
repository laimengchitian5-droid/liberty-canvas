export type KraepelinTimerWorkerMessage =
  | { type: "START"; durationMs: number }
  | { type: "STOP" };

export type KraepelinTimerWorkerEvent =
  | { type: "TICK"; elapsedMs: number; remainingMs: number }
  | { type: "COMPLETE"; elapsedMs: number };

const WORKER_SOURCE = `
self.onmessage = (event) => {
  const payload = event.data;

  if (!payload || typeof payload.type !== "string") {
    return;
  }

  if (payload.type === "START") {
    if (self.__kraepelinTimerId) {
      clearInterval(self.__kraepelinTimerId);
      self.__kraepelinTimerId = null;
    }

    const durationMs = typeof payload.durationMs === "number" ? payload.durationMs : 60000;
    const startedAt = Date.now();

    self.__kraepelinTimerId = setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      const remainingMs = Math.max(0, durationMs - elapsedMs);

      self.postMessage({
        type: "TICK",
        elapsedMs,
        remainingMs,
      });

      if (elapsedMs >= durationMs) {
        clearInterval(self.__kraepelinTimerId);
        self.__kraepelinTimerId = null;
        self.postMessage({
          type: "COMPLETE",
          elapsedMs,
        });
      }
    }, 50);
  }

  if (payload.type === "STOP") {
    if (self.__kraepelinTimerId) {
      clearInterval(self.__kraepelinTimerId);
      self.__kraepelinTimerId = null;
    }
  }
};
`;

export function createKraepelinTimerWorker(): Worker {
  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  worker.addEventListener("message", () => {
    // URL revocation happens on terminate to avoid race conditions.
  });

  const originalTerminate = worker.terminate.bind(worker);
  worker.terminate = () => {
    URL.revokeObjectURL(workerUrl);
    originalTerminate();
  };

  return worker;
}
