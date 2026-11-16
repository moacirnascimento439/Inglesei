// ===== Recursos do aparelho: voz, microfone e lembretes =====
// No app Android usamos plugins nativos do Capacitor; no navegador, as APIs da Web.
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { LocalNotifications } from "@capacitor/local-notifications";

export const isNative = Capacitor.isNativePlatform();

// ---------------- Voz (texto para fala) ----------------
const speakingListeners = new Set();
let speaking = false;
let speakToken = 0;
function setSpeaking(v) { if (speaking !== v) { speaking = v; speakingListeners.forEach((fn) => fn(v)); } }
export function onSpeakingChange(fn) { speakingListeners.add(fn); return () => speakingListeners.delete(fn); }
export const canSpeak = () => isNative || (typeof window !== "undefined" && "speechSynthesis" in window);

function webVoices() {
  return new Promise((resolve) => {
    const list = speechSynthesis.getVoices();
    if (list.length) return resolve(list);
    const t = setTimeout(() => resolve(speechSynthesis.getVoices()), 1500);
    speechSynthesis.addEventListener("voiceschanged", () => { clearTimeout(t); resolve(speechSynthesis.getVoices()); }, { once: true });
  });
}

/** Lista as vozes em inglês disponíveis no aparelho: [{ index, name, lang, voiceURI }] */
export async function listEnglishVoices() {
  try {
    const all = isNative ? (await TextToSpeech.getSupportedVoices()).voices : await webVoices();
    return all.map((v, index) => ({ index, name: v.name, lang: v.lang, voiceURI: v.voiceURI }))
      .filter((v) => /^en[-_]/i.test(v.lang) || v.lang === "en");
  } catch {
    return [];
  }
}

/**
 * Fala um texto e resolve quando termina.
 * voice: { index, voiceURI } escolhida pelo usuário (usada só para inglês).
 */
export async function speak(text, { lang = "en-US", rate = 1, pitch = 1, voice = null } = {}) {
  if (!text || !canSpeak()) return;
  const english = lang.startsWith("en");
  setSpeaking(true);
  try {
    if (isNative) {
      const opts = { text, lang, rate, pitch, volume: 1, queueStrategy: 0 };
      if (english && voice && Number.isInteger(voice.index)) opts.voice = voice.index;
      await TextToSpeech.speak(opts);
    } else {
      await new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang; u.rate = rate; u.pitch = pitch;
        const voices = speechSynthesis.getVoices();
        const chosen = english && voice ? voices.find((v) => v.voiceURI === voice.voiceURI) : null;
        u.voice = chosen || voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) || null;
        u.onend = u.onerror = () => resolve();
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      });
    }
  } catch {
    /* voz indisponível: o texto continua na tela */
  } finally {
    setSpeaking(false);
  }
}

/** Fala uma sequência de falas [{ text, lang }]; para se stopSpeaking() for chamado. */
export async function speakLines(lines, opts = {}, onLine) {
  const token = ++speakToken;
  for (let i = 0; i < lines.length; i++) {
    if (token !== speakToken) return false;
    onLine?.(i);
    await speak(lines[i].text, { ...opts, lang: lines[i].lang === "pt" ? "pt-BR" : "en-US" });
  }
  return token === speakToken;
}

export async function stopSpeaking() {
  speakToken++;
  try { if (isNative) await TextToSpeech.stop(); else speechSynthesis.cancel(); } catch { /* nada */ }
  setSpeaking(false);
}

// ---------------- Microfone (fala para texto) ----------------
const WebSR = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export async function canListen() {
  if (isNative) {
    try { return (await SpeechRecognition.available()).available; } catch { return false; }
  }
  return !!WebSR;
}

/**
 * Começa a ouvir em inglês. onPartial(texto) durante a fala; onEnd(textoFinal, erro?) ao terminar.
 * Retorna { stop }.
 */
export async function listen({ lang = "en-US", onPartial, onEnd }) {
  if (isNative) {
    let perm = await SpeechRecognition.checkPermissions();
    if (perm.speechRecognition !== "granted") perm = await SpeechRecognition.requestPermissions();
    if (perm.speechRecognition !== "granted") { onEnd?.("", "not_granted"); return { stop() {} }; }
    let last = "";
    let finished = false;
    const finish = async (err) => {
      if (finished) return;
      finished = true;
      await SpeechRecognition.removeAllListeners();
      onEnd?.(last, err);
    };
    await SpeechRecognition.removeAllListeners();
    await SpeechRecognition.addListener("partialResults", (d) => { last = (d.matches && d.matches[0]) || last; onPartial?.(last); });
    await SpeechRecognition.addListener("listeningState", (d) => { if (d.status === "stopped") finish(); });
    SpeechRecognition.start({ language: lang, maxResults: 1, partialResults: true, popup: false }).catch(() => finish("failed"));
    return { stop: () => SpeechRecognition.stop().catch(() => {}).finally(() => setTimeout(() => finish(), 400)) };
  }
  if (!WebSR) { onEnd?.("", "unavailable"); return { stop() {} }; }
  const rec = new WebSR();
  rec.lang = lang; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
  let finalText = "", error = null;
  rec.onresult = (e) => {
    let interim = "";
    finalText = "";
    for (const r of e.results) { if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript; }
    onPartial?.((finalText + " " + interim).trim());
  };
  rec.onerror = (e) => { error = e.error === "not-allowed" ? "not_granted" : e.error; };
  rec.onend = () => onEnd?.(finalText.trim(), error);
  try { rec.start(); } catch { onEnd?.("", "failed"); }
  return { stop: () => { try { rec.stop(); } catch { /* nada */ } } };
}

// ---------------- Lembretes (notificações agendadas) ----------------
export const remindersSupported = isNative;
const CHANNEL = "lembretes";
const ID_BASE = 1000;
const DAYS_AHEAD = 21;

export async function notificationStatus() {
  if (!isNative) return { display: "unsupported", exact: "unsupported" };
  const p = await LocalNotifications.checkPermissions();
  let exact = "granted";
  try { exact = (await LocalNotifications.checkExactNotificationSetting()).exact_alarm; } catch { /* Android antigo */ }
  return { display: p.display, exact };
}
export async function requestNotificationPermission() {
  if (!isNative) return "unsupported";
  return (await LocalNotifications.requestPermissions()).display;
}
export async function openExactAlarmSettings() {
  if (isNative) { try { await LocalNotifications.changeExactNotificationSetting(); } catch { /* nada */ } }
}

/**
 * Agenda os próximos 21 dias de lembretes, cada um com uma frase diferente.
 * reminders: [{ time: "19:30", days: [0..6] (0 = domingo), on: true }]
 * pickPhrase(n) devolve [inglês, português].
 */
export async function scheduleReminders(reminders, pickPhrase) {
  if (!isNative) return 0;
  const pending = await LocalNotifications.getPending();
  const old = pending.notifications.filter((n) => n.id >= ID_BASE && n.id < ID_BASE + 100000).map((n) => ({ id: n.id }));
  if (old.length) await LocalNotifications.cancel({ notifications: old });
  try {
    await LocalNotifications.createChannel({ id: CHANNEL, name: "Lembretes de estudo", description: "Hora de praticar inglês", importance: 4, vibration: true, visibility: 1 });
  } catch { /* canais só existem no Android 8+ */ }
  const now = new Date();
  const list = [];
  let n = 0;
  reminders.filter((r) => r.on && r.days.length && /^\d{2}:\d{2}$/.test(r.time)).forEach((r, ri) => {
    const [hh, mm] = r.time.split(":").map(Number);
    for (let d = 0; d <= DAYS_AHEAD; d++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, hh, mm, 0);
      if (at <= now || !r.days.includes(at.getDay())) continue;
      const [en, pt] = pickPhrase(n++);
      list.push({
        id: ID_BASE + ri * 1000 + d,
        title: "Inglesei · hora de praticar",
        body: en,
        largeBody: `${en}\n${pt}`,
        schedule: { at, allowWhileIdle: true },
        channelId: CHANNEL,
        smallIcon: "ic_stat_inglesei",
        iconColor: "#D6402B",
        autoCancel: true,
        extra: { en, pt },
      });
    }
  });
  if (list.length) await LocalNotifications.schedule({ notifications: list });
  return list.length;
}

export async function testReminder(en, pt) {
  if (!isNative) return false;
  try { await LocalNotifications.createChannel({ id: CHANNEL, name: "Lembretes de estudo", importance: 4, vibration: true, visibility: 1 }); } catch { /* nada */ }
  await LocalNotifications.schedule({ notifications: [{
    id: 99999, title: "Inglesei · hora de praticar", body: en, largeBody: `${en}\n${pt}`,
    schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true }, channelId: CHANNEL,
    smallIcon: "ic_stat_inglesei", iconColor: "#D6402B", autoCancel: true, extra: { en, pt },
  }] });
  return true;
}

/** Chamado quando o usuário toca numa notificação: cb({ en, pt }) */
export function onReminderOpened(cb) {
  if (!isNative) return;
  LocalNotifications.addListener("localNotificationActionPerformed", (a) => cb(a.notification && a.notification.extra));
}
