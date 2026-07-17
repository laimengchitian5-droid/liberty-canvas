"use client";

import { AdaptiveChat } from "@/components/ai/AdaptiveChat";
import {
  GLOBAL_FREE_CHAT_PERSONA,
  GLOBAL_FREE_CHAT_SYSTEM_PROMPT,
  getGlobalChatCopy,
} from "@/lib/chat/globalFreeChat";
import { useI18n } from "@/lib/i18n/I18nProvider";
import styles from "./GlobalFreeChat.module.css";

export const GlobalFreeChat = () => {
  const { locale } = useI18n();
  const copy = getGlobalChatCopy(locale);

  return (
    <div className={styles.wrap}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{copy.badge}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.lead}>{copy.lead}</p>
      </header>

      <AdaptiveChat
        forgeSystemPrompt={GLOBAL_FREE_CHAT_SYSTEM_PROMPT}
        forgePersonaLabel={GLOBAL_FREE_CHAT_PERSONA}
        title={copy.badge}
        emptyStateText={copy.empty}
        ariaLabel={copy.title}
      />
    </div>
  );
};
