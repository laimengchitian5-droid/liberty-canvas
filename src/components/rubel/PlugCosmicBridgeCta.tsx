import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buildPlugPlayHref, suggestPlugDiagnosisSlug } from "@/lib/rubel/suggestPlugDiagnosisSlug";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";
import type { TraitVector } from "@/types/rubel";

interface PlugCosmicBridgeCtaProps {
  profile: TraitVector;
  className?: string;
}

export const PlugCosmicBridgeCta = ({ profile, className }: PlugCosmicBridgeCtaProps) => {
  const { messages } = useI18n();
  const bridge = messages.plugBridge;
  const slug = suggestPlugDiagnosisSlug(profile);
  const href = buildPlugPlayHref(slug);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-indigo-400/30 bg-indigo-950/40 p-4",
        className,
      )}
      aria-label={bridge.ariaLabel}
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-300">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {bridge.eyebrow}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-50">{bridge.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">{bridge.lead}</p>
      <Link
        href={href}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
      >
        {bridge.cta}
      </Link>
    </aside>
  );
};
