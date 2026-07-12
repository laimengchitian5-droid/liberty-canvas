"use client";

import { useEffect } from "react";
import { AdaptiveChat } from "@/components/ai/AdaptiveChat";
import { usePlatform } from "@/store/PlatformContext";
import { FULL_INCLUSIVE_AI_GUARDRAILS } from "@/lib/i18n/culturalGuardrails";
import type { AIAgentConfig } from "@/types/platform";

interface ForgeAgentChatProps {
  appTitle: string;
  aiAgent: AIAgentConfig;
}

function buildForgeSystemPrompt(aiAgent: AIAgentConfig, appTitle: string): string {
  return [
    aiAgent.systemPromptOverride,
    `You are "${appTitle}", a user-forged LibertyCanvas AI agent.`,
    "Response guidelines:",
    aiAgent.responseGuidelines,
    FULL_INCLUSIVE_AI_GUARDRAILS,
  ].join("\n\n");
}

export function ForgeAgentChat({ appTitle, aiAgent }: ForgeAgentChatProps) {
  const { syncAIContext } = usePlatform();
  const systemPrompt = buildForgeSystemPrompt(aiAgent, appTitle);

  useEffect(() => {
    syncAIContext({
      activePersona: `forge-${appTitle.toLowerCase().replace(/\s+/g, "-")}`,
      systemPromptOverride: systemPrompt,
    });
  }, [appTitle, syncAIContext, systemPrompt]);

  return <AdaptiveChat forgeSystemPrompt={systemPrompt} forgePersonaLabel={appTitle} />;
}
