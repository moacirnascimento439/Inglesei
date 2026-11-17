// ===== IA do app: Claude (Anthropic) ou Gemini (Google) =====
// A chave de API fica salva só no aparelho do usuário (localStorage).
import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_MODELS = [
  { id: "claude-opus-5-5", label: "Claude Opus 5.5 · melhor qualidade" },
  { id: "claude-haiku-5-5", label: "Claude Haiku 5.5 · mais rápido e econômico" },
];
export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";

let config = { provider: "claude", claudeKey: "", claudeModel: "claude-opus-5-5", geminiKey: "", geminiModel: GEMINI_DEFAULT_MODEL,
  openaiKey: "", geminiTtsModel: "", openaiTtsModel: "" };
export function setAIConfig(c) { config = { ...config, ...c }; }
export function aiReady() {
  return config.provider === "gemini" ? !!config.geminiKey.trim() : !!config.claudeKey.trim();
}
export function aiName() {
  return config.provider === "gemini" ? "Gemini" : "Claude";
}

export class AIError extends Error {
  constructor(code, detail = "") { super(code); this.code = code; this.detail = detail; }
}
export function aiErrorText(e) {
  const code = e && e.code;
  const map = {
    no_key: "Configure a IA em Ajustes para usar este recurso.",
    auth: "A chave de API foi recusada. Confira se você colou a chave certa em Ajustes.",
    permission: "Sua chave não tem permissão para este modelo. Escolha outro modelo em Ajustes.",
    rate_limited: "Muitas solicitações seguidas (ou limite da sua conta atingido). Espere um pouco e tente de novo.",
    offline: "Sem conexão com a internet. Verifique sua rede e tente de novo.",
    refused: "A IA não respondeu a esse pedido. Tente reformular.",
    not_found: "Modelo não encontrado. Confira o nome do modelo em Ajustes.",
    bad_json: "A resposta veio num formato inesperado. Tente de novo.",
    empty: "A IA não gerou resposta. Tente pedir de outro jeito.",
  };
  if (code === "bad_request") return `A IA recusou o pedido: ${e.detail || "verifique sua conta e os créditos da API."}`;
  return map[code] || "A conexão com a IA falhou. Tente de novo em instantes.";
}

/**
 * Pede um texto à IA com streaming.
 * system: instruções fixas · messages: [{ role: "user" | "assistant", content }] (começa com "user")
 * effort: "low" para conversa rápida, "medium" para explicações e correções.
 * onText(textoCompletoAtéAgora) é chamado enquanto a resposta chega.
 */
export async function aiText({ system, messages, effort = "low", maxTokens = 2000, onText, signal }) {
  if (!aiReady()) throw new AIError("no_key");
  const text = config.provider === "gemini"
    ? await geminiText({ system, messages, maxTokens, onText, signal })
    : await claudeText({ system, messages, effort, maxTokens, onText, signal });
  if (!text.trim()) throw new AIError("empty");
  return text;
}

/** Pede JSON à IA e devolve o valor já convertido. */
export async function aiJSON(opts) {
  const text = await aiText({ ...opts, onText: undefined });
  const value = parseLooseJSON(text);
  if (value === undefined) throw new AIError("bad_json");
  return value;
}

export function parseLooseJSON(text) {
  const tries = [text];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) tries.push(fence[1]);
  const first = text.search(/[[{]/);
  const last = Math.max(text.lastIndexOf("]"), text.lastIndexOf("}"));
  if (first >= 0 && last > first) tries.push(text.slice(first, last + 1));
  for (const t of tries) { try { return JSON.parse(t); } catch { /* próxima tentativa */ } }
  return undefined;
}

// ---------------- Claude (SDK oficial da Anthropic) ----------------
async function claudeText({ system, messages, effort, maxTokens, onText, signal }) {
  // dangerouslyAllowBrowser: o app roda no aparelho do próprio usuário, com a chave dele.
  const client = new Anthropic({ apiKey: config.claudeKey.trim(), dangerouslyAllowBrowser: true, maxRetries: 2 });
  const model = config.claudeModel || "claude-opus-5-5";
  const params = { model, max_tokens: maxTokens, system, messages, output_config: { effort } };
  try {
    // No Opus 5.5, se o filtro de segurança recusar por engano, a API tenta de novo
    // automaticamente com outro modelo (server-side fallback).
    const stream = model === "claude-opus-5-5"
      ? client.beta.messages.stream({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }, { signal })
      : client.messages.stream(params, { signal });
    stream.on("text", (_delta, snapshot) => onText?.(snapshot));
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") throw new AIError("refused");
    return msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  } catch (e) {
    if (e instanceof AIError) throw e;
    if (e instanceof Anthropic.APIUserAbortError) throw new AIError("cancelled");
    if (e instanceof Anthropic.AuthenticationError) throw new AIError("auth");
    if (e instanceof Anthropic.PermissionDeniedError) throw new AIError("permission");
    if (e instanceof Anthropic.NotFoundError) throw new AIError("not_found");
    if (e instanceof Anthropic.RateLimitError) throw new AIError("rate_limited");
    if (e instanceof Anthropic.BadRequestError) throw new AIError("bad_request", e.error?.error?.message || e.message);
    if (e instanceof Anthropic.APIConnectionError) throw new AIError("offline");
    if (e instanceof Anthropic.APIError) throw new AIError("server", e.message);
    if (signal && signal.aborted) throw new AIError("cancelled");
    throw new AIError("server", String(e && e.message));
  }
}

// ---------------- Gemini (API REST do Google, tem faixa gratuita) ----------------
async function geminiText({ system, messages, maxTokens, onText, signal }) {
  const model = (config.geminiModel || GEMINI_DEFAULT_MODEL).trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: Math.max(maxTokens, 8192) },
  };
  let res;
  try {
    res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": config.geminiKey.trim() }, body: JSON.stringify(body), signal });
  } catch (e) {
    if (signal && signal.aborted) throw new AIError("cancelled");
    throw new AIError("offline");
  }
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).error?.message || ""; } catch { /* sem corpo */ }
    if (res.status === 400 && /api key/i.test(detail)) throw new AIError("auth");
    if (res.status === 401 || res.status === 403) throw new AIError("auth");
    if (res.status === 404) throw new AIError("not_found");
    if (res.status === 429) throw new AIError("rate_limited");
    if (res.status === 400) throw new AIError("bad_request", detail);
    throw new AIError("server", detail);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "", full = "", blocked = false;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        let data;
        try { data = JSON.parse(line.slice(5)); } catch { continue; }
        if (data.promptFeedback && data.promptFeedback.blockReason) blocked = true;
        const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
        const piece = (parts || []).filter((p) => !p.thought).map((p) => p.text || "").join("");
        if (piece) { full += piece; onText?.(full); }
      }
    }
  } catch (e) {
    if (signal && signal.aborted) throw new AIError("cancelled");
    throw new AIError("offline");
  }
  if (blocked && !full) throw new AIError("refused");
  return full;
}

/** Teste rápido da chave em Ajustes. */
export async function testAI() {
  const t = await aiText({ system: "You are a connection test. Reply with exactly: OK", messages: [{ role: "user", content: "Say OK" }], maxTokens: 1000, effort: "low" });
  return t.trim();
}

// ===================== Voz com IA (texto para fala natural) =====================
// O Claude não gera áudio; para isso usamos o Gemini (mesma chave) ou a OpenAI.
export const GEMINI_TTS_DEFAULT = "gemini-2.5-flash-preview-tts";
export const OPENAI_TTS_DEFAULT = "gpt-4o-mini-tts";
export const AI_VOICES = {
  gemini: [
    { id: "Kore", g: "f", label: "Kore", vibe: "firme e clara" },
    { id: "Aoede", g: "f", label: "Aoede", vibe: "leve e tranquila" },
    { id: "Leda", g: "f", label: "Leda", vibe: "jovem" },
    { id: "Zephyr", g: "f", label: "Zephyr", vibe: "animada" },
    { id: "Puck", g: "m", label: "Puck", vibe: "animado" },
    { id: "Charon", g: "m", label: "Charon", vibe: "calmo e didático" },
    { id: "Fenrir", g: "m", label: "Fenrir", vibe: "empolgado" },
    { id: "Orus", g: "m", label: "Orus", vibe: "firme" },
  ],
  openai: [
    { id: "nova", g: "f", label: "Nova", vibe: "simpática" },
    { id: "shimmer", g: "f", label: "Shimmer", vibe: "suave" },
    { id: "coral", g: "f", label: "Coral", vibe: "calorosa" },
    { id: "sage", g: "f", label: "Sage", vibe: "calma" },
    { id: "echo", g: "m", label: "Echo", vibe: "tranquilo" },
    { id: "onyx", g: "m", label: "Onyx", vibe: "grave" },
    { id: "ash", g: "m", label: "Ash", vibe: "descontraído" },
    { id: "alloy", g: "n", label: "Alloy", vibe: "neutra" },
  ],
};
export function aiSpeechReady(provider) {
  if (provider === "gemini") return !!config.geminiKey.trim();
  if (provider === "openai") return !!config.openaiKey.trim();
  return false;
}

function pcmToWav(bytes, rate) {
  const header = new ArrayBuffer(44);
  const v = new DataView(header);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + bytes.length, true); str(8, "WAVE"); str(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data"); v.setUint32(40, bytes.length, true);
  return new Blob([header, bytes], { type: "audio/wav" });
}
async function speechError(res) {
  let detail = "";
  try { detail = (await res.json()).error?.message || ""; } catch { /* sem corpo */ }
  if (res.status === 401 || res.status === 403 || (res.status === 400 && /api key/i.test(detail))) return new AIError("auth");
  if (res.status === 404) return new AIError("not_found");
  if (res.status === 429) return new AIError("rate_limited", detail);
  if (res.status === 400) return new AIError("bad_request", detail);
  return new AIError("server", detail);
}

/** Gera o áudio de um texto com voz natural. Devolve um Blob de áudio. */
export async function aiSpeech(text, { provider, voice, lang = "en-US", signal } = {}) {
  if (!aiSpeechReady(provider)) throw new AIError("no_key");
  let res;
  try {
    if (provider === "gemini") {
      const model = (config.geminiTtsModel || GEMINI_TTS_DEFAULT).trim();
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": config.geminiKey.trim() },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || "Kore" } } } },
        }),
      });
    } else {
      res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST", signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.openaiKey.trim()}` },
        body: JSON.stringify({
          model: (config.openaiTtsModel || OPENAI_TTS_DEFAULT).trim(), voice: voice || "nova", input: text, response_format: "mp3",
          instructions: lang.startsWith("pt")
            ? "Fale em português do Brasil, de forma natural e simpática, no ritmo de uma conversa normal."
            : "Speak natural, friendly American English at a normal conversational pace, like a real person talking.",
        }),
      });
    }
  } catch {
    if (signal && signal.aborted) throw new AIError("cancelled");
    throw new AIError("offline");
  }
  if (!res.ok) throw await speechError(res);
  if (provider === "openai") return await res.blob();
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData && p.inlineData.data);
  if (!part) throw new AIError("empty");
  const rate = Number((String(part.inlineData.mimeType).match(/rate=(\d+)/) || [])[1]) || 24000;
  const bin = atob(part.inlineData.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return pcmToWav(bytes, rate);
}
