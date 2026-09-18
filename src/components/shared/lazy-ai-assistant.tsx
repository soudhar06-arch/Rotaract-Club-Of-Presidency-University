"use client";

import dynamic from "next/dynamic";

const AIAssistantComponent = dynamic(
  () => import("@/components/shared/ai-assistant").then((m) => m.AIAssistant),
  { ssr: false }
);

export function LazyAIAssistant() {
  return <AIAssistantComponent />;
}

export default LazyAIAssistant;
