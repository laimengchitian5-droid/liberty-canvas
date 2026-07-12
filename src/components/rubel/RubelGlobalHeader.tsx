"use client";

import Link from "next/link";
import { PlusCircle, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { cn } from "@/lib/utils/cn";

interface RubelGlobalHeaderProps {
  showCreateLink?: boolean;
  subtitle?: string;
  midnight?: boolean;
}

const RubelGlobalHeader = ({
  showCreateLink = true,
  subtitle,
  midnight = false,
}: RubelGlobalHeaderProps) => {
  const { messages } = useI18n();
  const header = messages.header;

  if (!midnight) {
    return null;
  }

  return (
    <header className="border-b border-slate-800 bg-slate-955/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-slate-200" aria-hidden="true" />
          <span className={rubelDs.header}>{header.brandTitle}</span>
        </Link>
        {subtitle ? (
          <p className={cn(rubelDs.muted, "w-full truncate sm:w-auto")}>{subtitle}</p>
        ) : null}

        {showCreateLink ? (
          <Link
            href="/create"
            className={cn(rubelDs.primary, "inline-flex min-h-10 items-center gap-1.5 px-3")}
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{header.create}</span>
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export { RubelGlobalHeader };
