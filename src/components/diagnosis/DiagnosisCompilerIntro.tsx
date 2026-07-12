import { Heart, Sparkles } from "lucide-react";
import { extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { BuilderDiagnosisDefinition } from "@/types/builder";
import { isBuilderDiagnosisDefinition } from "@/types/builder";
import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";
import { cn } from "@/lib/utils/cn";
import styles from "./diagnosisCompiler.module.css";

function resolveDisplayTags(
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,
): readonly string[] {
  if (isBuilderDiagnosisDefinition(definition)) {
    return definition.creatorTags;
  }

  const seoBlock = extractSeoBlock(definition);
  return seoBlock?.desireTags ?? [];
}

export const DiagnosisCompilerIntro = ({
  definition,
  onStart,
}: {
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition;
  onStart: () => void;
}) => {
  const { messages } = useI18n();
  const desireTags = resolveDisplayTags(definition);
  const introCopy = messages.compilerIntro;

  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>
        <Sparkles
          className="inline-block h-3.5 w-3.5 align-[-2px] mr-1"
          aria-hidden="true"
        />
        {definition.eyebrow}
      </p>
      <h1 className={cn(styles.title, "font-serif")}>{definition.title}</h1>
      <p className={styles.lead}>{definition.subtitle}</p>
      {desireTags.length > 0 ? (
        <div className={styles.metaPills} role="group" aria-label={introCopy.tagsGroupAria}>
          {desireTags.map((tag) => (
            <span key={tag} className={styles.metaPill}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className={styles.actions}>
        <button
          type="button"
          className={cn(styles.primaryButton, "gap-2")}
          onClick={onStart}
          id="diagnosis-intro-start"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          {introCopy.startLabel(definition.estimatedMinutes)}
        </button>
      </div>
    </header>
  );
};
