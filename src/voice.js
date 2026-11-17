// ===== Motor de voz do Inglesei =====
// Para cada frase escolhe a melhor voz disponível:
//   1. Voz natural embutida (Piper): frases fixas do app, offline e grátis
//   2. Voz com IA (Gemini ou OpenAI): qualquer texto, inclusive respostas da conversa
//   3. Voz do celular: reserva
import { deviceSpeak, deviceStop, canDeviceSpeak } from "./platform.js";
import { aiSpeech, aiSpeechReady } from "./ai.js";
import { voiceHash } from "./voicehash.js";

let cfg = { packVoice: "emma", aiProvider: "off", aiVoice: "Kore", deviceVoice: null, rate: 1, pitch: 1 };
export function setVoiceConfig(c) { cfg = { ...cfg, ...c }; }

// ---------- Pacote de vozes naturais embutido ----------
let pack = null; // { voices: [{id,name,gender}], texts: Set<hash>, reminders: n }
export async function loadPack() {
  try {
    const r = await fetch("audio/index.json", { cache: "no-store" });
    if (r.ok) { const d = await r.json(); pack = { voices: d.voices || [], texts: new Set(d.texts || []), reminders: d.reminders || 0 }; }
  } catch { /* sem pacote (ex.: versão web) */ }
  return pack;
}
export const packVoices = () => (pack ? pack.voices : []);
export const hasPack = () => !!(pack && pack.voices.length);
const packHas = (text) => pack && pack.voices.some((v) => v.id === cfg.packVoice) && pack.texts.has(voiceHash(text));
export const reminderClipUrl = (voiceId, n) => `audio/${voiceId}/lembrete_${n}.ogg`;

// ---------- Avisos de "falando" (para animar o avatar) ----------
const listeners = new Set();
let speaking = false;
function setSpeaking(v) { if (speaking !== v) { speaking = v; listeners.forEach((fn) => fn(v)); } }
export function onSpeakingChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const canSpeak = () => hasPack() || aiSpeechReady(cfg.aiProvider) || canDeviceSpeak();
export const usingAIVoice = () => cfg.aiProvider !== "off" && aiSpeechReady(cfg.aiProvider);

// ---------- Cache dos áudios gerados por IA (IndexedDB) ----------
const DB = "inglesei-voz", STORE = "audios";
let dbPromise = null;
function db() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  return dbPromise;
}
async function cacheGet(key) {
  const d = await db(); if (!d) return null;
  return new Promise((r) => { try { const q = d.transaction(STORE).objectStore(STORE).get(key); q.onsuccess = () => r(q.result || null); q.onerror = () => r(null); } catch { r(null); } });
}
async function cachePut(key, blob) {
  const d = await db(); if (!d) return;
  try { d.transaction(STORE, "readwrite").objectStore(STORE).put(blob, key); } catch { /* cache cheio: ignora */ }
}
export async function clearVoiceCache() {
  const d = await db(); if (!d) return;
  try { d.transaction(STORE, "readwrite").objectStore(STORE).clear(); } catch { /* nada */ }
}
let lastAIError = null;
export const lastVoiceError = () => lastAIError;
async function aiBlob(text, lang) {
  const key = `${cfg.aiProvider}|${cfg.aiVoice}|${lang.slice(0, 2)}|${text}`;
  const hit = await cacheGet(key);
  if (hit) return hit;
  const blob = await aiSpeech(text, { provider: cfg.aiProvider, voice: cfg.aiVoice, lang });
  cachePut(key, blob);
  return blob;
}

// ---------- Tocar ----------
const audio = typeof Audio !== "undefined" ? new Audio() : null;
let stopCurrent = null;
function playSrc(src, rate) {
  return new Promise((resolve) => {
    if (!audio) return resolve();
    const done = () => { audio.onended = audio.onerror = null; stopCurrent = null; resolve(); };
    stopCurrent = () => { audio.pause(); done(); };
    audio.onended = done;
    audio.onerror = done;
    audio.src = src;
    audio.playbackRate = rate;
    audio.play().catch(done);
  });
}

/**
 * Prepara a fala (baixa o áudio da IA antes, se for o caso) e devolve uma função que toca.
 * Assim a próxima frase de uma aula já fica pronta enquanto a atual está tocando.
 */
function prepare(text, lang, rate) {
  const en = lang.startsWith("en");
  if (en && packHas(text)) {
    const src = `audio/${cfg.packVoice}/${voiceHash(text)}.ogg`;
    return async () => playSrc(src, rate);
  }
  if (usingAIVoice()) {
    const blobP = aiBlob(text, lang).catch((e) => { lastAIError = e; return null; });
    return async () => {
      const blob = await blobP;
      if (blob) {
        const url = URL.createObjectURL(blob);
        try { await playSrc(url, rate); } finally { URL.revokeObjectURL(url); }
        return;
      }
      await deviceSpeak(text, { lang, rate, pitch: cfg.pitch, voice: en ? cfg.deviceVoice : null });
    };
  }
  return async () => deviceSpeak(text, { lang, rate, pitch: cfg.pitch, voice: en ? cfg.deviceVoice : null });
}

let token = 0;
/** Fala um texto e resolve quando termina. */
export async function speak(text, { lang = "en-US", rate } = {}) {
  if (!text) return;
  const my = ++token;
  setSpeaking(true);
  try { const play = prepare(text, lang, rate || cfg.rate); if (my === token) await play(); }
  finally { if (my === token) setSpeaking(false); }
}

/** Fala uma sequência [{ text, lang: "pt" | "en" }]; para se stopSpeaking() for chamado. */
export async function speakLines(lines, onLine) {
  const my = ++token;
  const langOf = (l) => (l.lang === "pt" ? "pt-BR" : "en-US");
  let next = lines.length ? prepare(lines[0].text, langOf(lines[0]), cfg.rate) : null;
  setSpeaking(true);
  try {
    for (let i = 0; i < lines.length; i++) {
      if (my !== token) return false;
      const play = next;
      next = i + 1 < lines.length ? prepare(lines[i + 1].text, langOf(lines[i + 1]), cfg.rate) : null;
      onLine?.(i);
      await play();
    }
    return my === token;
  } finally { if (my === token) setSpeaking(false); }
}

export async function stopSpeaking() {
  token++;
  if (stopCurrent) stopCurrent();
  await deviceStop();
  setSpeaking(false);
}

/** Toca um arquivo de áudio do app (ex.: prévia do lembrete). */
export async function playClip(src) {
  const my = ++token;
  setSpeaking(true);
  try { await playSrc(src, 1); } finally { if (my === token) setSpeaking(false); }
}
