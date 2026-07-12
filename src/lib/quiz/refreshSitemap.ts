import { revalidatePath } from "next/cache";

export function refreshPublishedAppDiscovery(): void {
  revalidatePath("/sitemap.xml");
}

/** @deprecated Use refreshPublishedAppDiscovery */
export const refreshPublishedQuizDiscovery = refreshPublishedAppDiscovery;