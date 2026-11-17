// ===== Recursos do aparelho: voz do celular, microfone, câmera e lembretes =====
// No app Android usamos plugins nativos do Capacitor; no navegador, as APIs da Web.
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { LocalNotifications } from "@capacitor/local-notifications";

export const isNative = Capacitor.isNativePlatform();

// ---------------- Voz do celular (reserva quando não há voz natural) ----------------
export const canDeviceSpeak = () => isNative || (typeof window !== "undefined" && "speechSynthesis" in window);

function webVoices() {
  return new Promise((resolve) => {
    const list = speechSynthesis.getVoices();
    if (list.length) return resolve(list);
    const t = setTimeout(() => resolve(speechSynthesis.getVoices()), 1500);
    speechSynthesis.addEventListener("voiceschanged", () => { clearTimeout(t); resolve(speechSynthesis.getVoices()); }, { once: true });
  });
}

/** Vozes em inglês instaladas no aparelho: [{ index, name, lang, voiceURI }] */
export async function listEnglishVoices() {
  try {
    const all = isNative ? (await TextToSpeech.getSupportedVoices()).voices : await webVoices();
    return all.map((v, index) => ({ index, name: v.name, lang: v.lang, voiceURI: v.voiceURI }))
      .filter((v) => /^en[-_]/i.test(v.lang) || v.lang === "en");
  } catch {
    return [];
  }
}

/** Fala com a voz do celular e resolve quando termina. voice = { index, voiceURI } (só para inglês). */
export async function deviceSpeak(text, { lang = "en-US", rate = 1, pitch = 1, voice = null } = {}) {
  if (!text || !canDeviceSpeak()) return;
  const english = lang.startsWith("en");
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
  }
}
export async function deviceStop() {
  try { if (isNative) await TextToSpeech.stop(); else if (canDeviceSpeak()) speechSynthesis.cancel(); } catch { /* nada */ }
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

// ---------------- Câmera (sua imagem na chamada de vídeo) ----------------
export async function openCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
  try { return await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 480, height: 640 }, audio: false }); }
  catch { return null; }
}

// ---------------- Lembretes (notificações agendadas) ----------------
export const remindersSupported = isNative;
const ID_BASE = 1000;
const DAYS_AHEAD = 21;
const channelFor = (voiceId, n) => (voiceId ? `lembrete_${voiceId}_${n}` : "lembretes");

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

/** Cria os canais de notificação. Cada canal tem como som uma frase falada em inglês (res/raw). */
async function ensureChannels(voiceId, count) {
  const make = (id, name, sound) => LocalNotifications.createChannel({ id, name, description: "Hora de praticar inglês", importance: 4, vibration: true, visibility: 1, ...(sound ? { sound } : {}) }).catch(() => {});
  await make("lembretes", "Lembretes de estudo");
  if (voiceId) for (let n = 0; n < count; n++) await make(channelFor(voiceId, n), `Lembrete falado (${voiceId}) ${n + 1}`, `lembrete_${voiceId}_${n}.ogg`);
}

function notification(id, at, line, n, voiceId, exact) {
  const [en, pt] = line;
  return {
    id, title: "Inglesei · hora de praticar", body: en, largeBody: `${en}\n${pt}`,
    schedule: { at, allowWhileIdle: true },
    channelId: channelFor(voiceId, n), smallIcon: "ic_stat_inglesei", iconColor: "#6C4CF5", autoCancel: true,
    // Sem a permissão de alarme exato, agenda do jeito normal (pode atrasar alguns minutos)
    // em vez de abrir a tela de configurações de surpresa.
    isExactNotification: exact,
    extra: { en, pt },
  };
}

/**
 * Agenda os próximos 21 dias de lembretes.
 * reminders: [{ time: "19:30", days: [0..6] (0 = domingo), on: true }]
 * lines: [[inglês, português]] — o áudio da frase n é lembrete_<voz>_<n>
 * voiceId: voz natural escolhida (ou null para o som padrão)
 */
export async function scheduleReminders(reminders, lines, voiceId) {
  if (!isNative) return [];
  const st = await notificationStatus();
  const exact = st.exact === "granted";
  const pending = await LocalNotifications.getPending();
  const old = pending.notifications.filter((x) => x.id >= ID_BASE && x.id < ID_BASE + 100000).map((x) => ({ id: x.id }));
  if (old.length) await LocalNotifications.cancel({ notifications: old });
  await ensureChannels(voiceId, lines.length);
  const now = new Date();
  const list = [];
  let k = 0;
  reminders.filter((r) => r.on && r.days.length && /^\d{2}:\d{2}$/.test(r.time)).forEach((r, ri) => {
    const [hh, mm] = r.time.split(":").map(Number);
    for (let d = 0; d <= DAYS_AHEAD; d++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, hh, mm, 0);
      if (at <= now || !r.days.includes(at.getDay())) continue;
      const n = (d + ri + k++) % lines.length;
      list.push(notification(ID_BASE + ri * 1000 + d, at, lines[n], n, voiceId, exact));
    }
  });
  if (list.length) await LocalNotifications.schedule({ notifications: list });
  return list.map((x) => x.schedule.at).sort((a, b) => a - b);
}

/** Próximos lembretes já agendados no aparelho (datas). */
export async function upcomingReminders() {
  if (!isNative) return [];
  const p = await LocalNotifications.getPending();
  return p.notifications.filter((x) => x.id >= ID_BASE && x.schedule && x.schedule.at).map((x) => new Date(x.schedule.at)).sort((a, b) => a - b);
}

export async function testReminder(line, n, voiceId) {
  if (!isNative) return false;
  await ensureChannels(voiceId, n + 1);
  await LocalNotifications.schedule({ notifications: [notification(99999, new Date(Date.now() + 8000), line, n, voiceId, false)] });
  return true;
}

/** Chamado quando o usuário toca numa notificação: cb({ en, pt }) */
export function onReminderOpened(cb) {
  if (!isNative) return;
  LocalNotifications.addListener("localNotificationActionPerformed", (a) => cb(a.notification && a.notification.extra));
}
