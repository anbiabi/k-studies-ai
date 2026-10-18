import { defineHandler } from "nitro";
import { getOfflineGksAnswer } from "../server/gks-assets.js";
import { K_STUDIES_SYSTEM_PROMPT } from "../server/k-studies-system.js";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

const isChatMessage = (message: unknown): message is ChatMessage => {
  if (!message || typeof message !== "object") return false;
  const candidate = message as Record<string, unknown>;
  return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string" && candidate.content.trim().length > 0 && candidate.content.length <= MAX_MESSAGE_LENGTH;
};

export default defineHandler(async (event) => {
  if (event.req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  let body: unknown;
  try {
    body = await event.req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body && typeof body === "object" && Array.isArray((body as Record<string, unknown>).messages)
    ? (body as { messages: unknown[] }).messages
    : [];
  if (messages.length === 0 || messages.length > MAX_MESSAGES || !messages.every(isChatMessage)) {
    return Response.json({ error: "Please provide a valid conversation." }, { status: 400 });
  }

  if (!apiKey || !model) {
    return Response.json({ answer: getOfflineGksAnswer(messages as ChatMessage[]), source: "offline" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_SITE_URL ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL } : {}),
        "X-Title": process.env.OPENROUTER_SITE_NAME || "K-Studies AI",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: K_STUDIES_SYSTEM_PROMPT }, ...messages],
        temperature: 0.2,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      return Response.json({ answer: getOfflineGksAnswer(messages as ChatMessage[]), source: "offline" });
    }

    const result = await response.json() as { choices?: Array<{ message?: { content?: unknown; tool_calls?: unknown[] } }> };
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return Response.json({ answer: getOfflineGksAnswer(messages as ChatMessage[]), source: "offline" });
    }

    return Response.json({ answer: answer.trim(), source: "openrouter" });
  } catch {
    return Response.json({ answer: getOfflineGksAnswer(messages as ChatMessage[]), source: "offline" });
  }
});
