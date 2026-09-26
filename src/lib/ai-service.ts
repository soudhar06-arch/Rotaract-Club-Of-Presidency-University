import "server-only";
import { configuredValue } from "./google-auth";

export function aiConfiguration() {
  return { apiKey: configuredValue(process.env.OPENAI_API_KEY), model: configuredValue(process.env.OPENAI_MODEL) };
}
export async function generateAIText(instructions: string, input: string, schema?: Record<string, unknown>) {
  const { apiKey, model } = aiConfiguration();
  if (!apiKey || !model) throw new Error("Set OPENAI_API_KEY and OPENAI_MODEL for Leviathan Bot and event descriptions.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, instructions, input, store: false, max_output_tokens: 1200,
      ...(schema ? { text: { format: { type: "json_schema", name: "event_summary", strict: true, schema } } } : {}) }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}. Verify OPENAI_API_KEY, OPENAI_MODEL and account quota.`);
  const result = await response.json() as { status?: string; output?: { type: string; content?: { type: string; text?: string }[] }[] };
  const text = (result.output || []).flatMap((item) => item.content || []).filter((item) => item.type === "output_text").map((item) => item.text || "").join("\n").trim();
  if (!text || result.status === "incomplete") throw new Error("AI provider returned an incomplete response.");
  return text;
}
