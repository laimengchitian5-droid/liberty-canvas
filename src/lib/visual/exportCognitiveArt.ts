/**
 * Export CognitiveArt canvas to PNG — download or Web Share (files).
 * Fail-closed: never throws to UI callers; returns ok flag.
 */
export async function exportCanvasPng(options: {
  canvas: HTMLCanvasElement;
  filename: string;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
}): Promise<{ ok: boolean; mode: "share" | "download" | "none" }> {
  const { canvas, filename, shareTitle, shareText, shareUrl } = options;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), "image/png");
  });

  if (!blob) {
    return { ok: false, mode: "none" };
  }

  const file = new File([blob], filename, { type: "image/png" });

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return { ok: true, mode: "share" };
    }
  } catch {
    // User cancel or share failure → fall through to download
  }

  try {
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = href;
    link.click();
    URL.revokeObjectURL(href);

    const intent = new URL("https://twitter.com/intent/tweet");
    intent.searchParams.set("text", shareText);
    intent.searchParams.set("url", shareUrl);
    window.open(intent.toString(), "_blank", "noopener,noreferrer");

    return { ok: true, mode: "download" };
  } catch {
    return { ok: false, mode: "none" };
  }
}
