# OpenRouter Deployment Protocol

This app is prepared to use OpenRouter through a server-side proxy when deployed to Vercel. The browser must never call OpenRouter directly and must never receive `OPENROUTER_API_KEY`.

## Runtime flow

1. The browser sends the user question and conversation messages to the app’s same-origin `/api/chat` endpoint.
2. The Vercel server function validates the request shape and applies the K-Studies AI system instructions from `system-instructions.md`.
3. The server function calls OpenRouter with the selected model and the private `OPENROUTER_API_KEY`.
4. The server returns only the assistant message and safe request metadata to the browser.
5. Each request is stateless. Vercel can invoke the function at any time, and OpenRouter handles model availability. This provides continuous availability without keeping an expensive process or socket alive 24/7.

## Required Vercel environment variables

```text
OPENROUTER_API_KEY=your_private_key
OPENROUTER_MODEL=your_provider/model-name
OPENROUTER_SITE_URL=https://your-production-domain.example
OPENROUTER_SITE_NAME=K-Studies AI
```

Never use `VITE_OPENROUTER_API_KEY`. Any `VITE_` variable is exposed to the browser.

## Request contract

`POST /api/chat`

```json
{
  "messages": [
    { "role": "user", "content": "What documents are needed for GKS?" }
  ]
}
```

The server should accept only `user` and `assistant` message roles, cap message length and history size, and reject empty requests. The system message must be server-owned and prepended on every request so a model switch cannot remove the K-Studies AI scope.

## OpenRouter request

```ts
await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "",
    "X-Title": process.env.OPENROUTER_SITE_NAME ?? "K-Studies AI",
  },
  body: JSON.stringify({
    model: process.env.OPENROUTER_MODEL,
    messages: [systemMessage, ...validatedMessages],
    temperature: 0.2,
    max_tokens: 900,
  }),
});
```

Use a short server timeout, handle non-2xx responses without exposing provider details, and return a generic retry message to the client. Do not log prompts, API keys, or full provider responses in production.

## Model switching

Change only `OPENROUTER_MODEL` in Vercel. Do not change the UI or client contract. The server-owned system instructions, scope refusal, Cameroon-first nationality behavior, and source-discipline rules remain constant across models.

## Availability and operations

- Vercel functions are on-demand and may cold-start; do not implement a permanent client connection.
- OpenRouter availability is provider/model dependent, so select a production model with a suitable context window and uptime.
- Add rate limiting at the `/api/chat` boundary before public launch.
- Set Vercel function duration and region according to the selected plan and audience.
- Monitor provider errors and latency using Vercel logs without storing user content.
- Keep the local official GKS source library available in production as a safe fallback. If OpenRouter is unavailable, unconfigured, times out, or returns only tool calls without usable text, `/api/chat` answers from the offline context instead of exposing provider details.
- Review `assets/gks/manifest.json` and `assets/gks/official-sources.md` annually so the offline fallback does not become stale.
