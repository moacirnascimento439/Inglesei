// ===================== Inglesei — app principal =====================
import { App as CapApp } from "@capacitor/app";
import { LEVELS, LESSONS } from "./content/lessons.js";
import { REGISTERS, SLANG_CATS, SLANG, PHRASAL, IDIOMS } from "./content/expressions.js";
import { SCENARIOS, SCENARIO_GROUPS, CONV_LEVELS, WRITING_TOPICS, MOTIVATION, REMINDER_LINES, PACK_VOICES } from "./content/scenarios.js";
import { SLANG_EMOJI, PHRASAL_EMOJI, IDIOM_EMOJI } from "./content/emojis.js";
import {
  isNative, listEnglishVoices, canListen, listen, openCamera,
  remindersSupported, notificationStatus, requestNotificationPermission, openExactAlarmSettings,
  scheduleReminders, upcomingReminders, testReminder, onReminderOpened,
} from "./platform.js";
import { setAIConfig, aiReady, aiName, aiText, aiJSON, aiErrorText, testAI, CLAUDE_MODELS, GEMINI_DEFAULT_MODEL,
  AI_VOICES, aiSpeech, aiSpeechReady, GEMINI_TTS_DEFAULT, OPENAI_TTS_DEFAULT } from "./ai.js";
import { setVoiceConfig, loadPack, packVoices, hasPack, canSpeak, speak, stopSpeaking, onSpeakingChange, playClip,
  reminderClipUrl, usingAIVoice, lastVoiceError, clearVoiceCache } from "./voice.js";
import { lessonToSlides, aiLessonToSlides, createPlayer } from "./tutor.js";
import { AVATARS, avatarById, avatarSVG, photoAvatarHTML, tutorRef, tutorTitle } from "./avatars.js";

// ---------- Utilidades ----------
/** Troca o conteúdo de um elemento ignorando itens vazios (null/false), que senão viram o texto "null". */
function put(node, ...kids) { node.replaceChildren(...kids.flat().filter((k) => k != null && k !== false)); }
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v; // somente conteúdo escrito por nós
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c)));
  return n;
}
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
  book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h13"/><path d="M8 7h7M8 11h5"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.4A8 8 0 1 1 21 12z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="3"/><path d="M16 10l6-3v10l-6-3z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
};
function icon(name) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", "2"); s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("aria-hidden", "true"); s.innerHTML = ICONS[name] || "";
  return s;
}
const norm = (s) => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"“”]/g, "").replace(/\s+/g, " ").trim();
function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => fmtDate(new Date());
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmtDate(d); };
const dayNum = () => Math.floor(Date.parse(today() + "T00:00:00Z") / 864e5);
const plain = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent.replace(/\s+/g, " ").trim(); };
let toastTimer;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200); }
const readJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* armazenamento cheio ou bloqueado */ } };

// ---------- Configurações ----------
const S_KEY = "inglesei:settings";
const defaultSettings = () => ({
  provider: "claude", claudeKey: "", claudeModel: "claude-opus-5-5", geminiKey: "", geminiModel: GEMINI_DEFAULT_MODEL,
  deviceVoice: null, rate: 1, pitch: 1, voiceMode: false, speakOnOpen: true, onboarded: false,
  reminders: [{ id: 1, time: "19:00", days: [1, 2, 3, 4, 5], on: true }],
  // Novidades: tema, professor(a), vozes naturais
  palette: "vibrante", themeMode: "auto", avatar: "liz", photo: null, photoName: "", photoGender: "f",
  packVoice: "emma", aiVoiceProvider: "off", aiVoice: "Kore", openaiKey: "", geminiTtsModel: "", openaiTtsModel: "",
});
let S = { ...defaultSettings(), ...(readJSON(S_KEY) || {}) };
if (S.voice && !S.deviceVoice) { S.deviceVoice = S.voice; delete S.voice; } // versão anterior
function applySettings() {
  setAIConfig(S);
  setVoiceConfig({ packVoice: S.packVoice, aiProvider: S.aiVoiceProvider, aiVoice: S.aiVoice, deviceVoice: S.deviceVoice, rate: S.rate, pitch: S.pitch });
  const root = document.documentElement;
  root.dataset.palette = S.palette || "vibrante";
  if (S.themeMode === "light" || S.themeMode === "dark") root.dataset.theme = S.themeMode; else delete root.dataset.theme;
}
function saveSettings() { writeJSON(S_KEY, S); applySettings(); }
applySettings();
const say = (text, lang = "en-US", rate) => speak(text, { lang, rate });

// ---------- Professor(a) escolhido(a) ----------
function tutor() {
  if (S.avatar === "foto" && S.photo) return { id: "foto", name: S.photoName || "Teacher", g: S.photoGender === "m" ? "m" : "f", photo: S.photo };
  return avatarById(S.avatar);
}
function faceHTML(size, t = tutor()) {
  return t.photo ? photoAvatarHTML(t.photo, size, t.name) : avatarSVG(t, size);
}
/** Elemento com o rosto do professor que "fala" (anima) enquanto há áudio tocando. */
function talkingFace(size, cls = "face") {
  const node = el("div", { class: cls, html: faceHTML(size) });
  const off = onSpeakingChange((on) => node.classList.toggle("talking", on));
  node._off = off;
  return node;
}

// ---------- Progresso ----------
const P_KEY = "inglesei:progress";
const fresh = () => ({ v: 1, xp: 0, daily: { date: "", xp: 0 }, streak: { count: 0, last: "" }, lessons: {}, cards: {}, favs: [], stats: { msgs: 0, listen: 0, speak: 0, quiz: 0, writing: 0, aulas: 0 }, goal: 50 });
function normalizeP(d) {
  const f = fresh();
  if (!d || typeof d !== "object") return f;
  return { ...f, ...d, xp: Number(d.xp) || 0, daily: { ...f.daily, ...(d.daily || {}) }, streak: { ...f.streak, ...(d.streak || {}) },
    lessons: d.lessons && typeof d.lessons === "object" ? d.lessons : {}, cards: d.cards && typeof d.cards === "object" ? d.cards : {},
    favs: Array.isArray(d.favs) ? d.favs.filter((x) => typeof x === "string") : [], stats: { ...f.stats, ...(d.stats || {}) } };
}
let P = normalizeP(readJSON(P_KEY));
const save = () => writeJSON(P_KEY, P);
const streakNow = () => (P.streak.last === today() || P.streak.last === addDays(-1) ? P.streak.count : 0);
const dailyXP = () => (P.daily.date === today() ? P.daily.xp : 0);
function addXP(n, quiet) {
  if (!n) return;
  const t = today();
  P.xp += n;
  if (P.daily.date !== t) P.daily = { date: t, xp: 0 };
  P.daily.xp += n;
  if (P.streak.last !== t) { P.streak.count = P.streak.last === addDays(-1) ? P.streak.count + 1 : 1; P.streak.last = t; }
  save(); updateChrome();
  if (!quiet) toast(`+${n} XP`);
}
const LEVEL_SIZE = 150;
const playerLevel = () => Math.floor(P.xp / LEVEL_SIZE) + 1;
const lessonsDone = () => LESSONS.filter((l) => P.lessons[l.id]).length;
const mastered = () => Object.values(P.cards).filter((c) => c && c.box >= 4).length;

// ---------- Componentes comuns ----------
function speakBtn(text, label = "Ouvir em inglês") {
  return el("button", { class: "icon-btn", type: "button", "aria-label": label, title: label, hidden: !canSpeak(), onclick: () => say(text) }, icon("speaker"));
}
/** Aviso quando a IA ainda não foi configurada. */
function aiGate() {
  return el("div", { class: "note warn stack" },
    el("strong", {}, "Configure a IA para usar este recurso"),
    el("span", {}, "Leva 2 minutos: crie uma chave de API do Claude (ou do Gemini, que tem faixa gratuita) e cole em Ajustes. A chave fica salva só no seu celular."),
    el("a", { class: "btn dark", href: "#ajustes", style: "justify-self:start" }, icon("gear"), "Configurar IA"));
}
function md(text) {
  const root = el("div", { class: "ai-out" });
  let list = null, listType = null;
  const inline = (s, parent) => {
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
    let last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) parent.append(s.slice(last, m.index));
      const t = m[0];
      if (t.startsWith("**")) parent.append(el("strong", {}, t.slice(2, -2)));
      else if (t.startsWith("`")) parent.append(el("code", {}, t.slice(1, -1)));
      else parent.append(el("em", {}, t.slice(1, -1)));
      last = m.index + t.length;
    }
    if (last < s.length) parent.append(s.slice(last));
    return parent;
  };
  for (const raw of String(text).split("\n")) {
    const line = raw.trimEnd();
    const b = line.match(/^\s*[-*•]\s+(.*)/), n = line.match(/^\s*\d+[.)]\s+(.*)/), h = line.match(/^#{1,4}\s+(.*)/);
    if (b || n) {
      const type = b ? "ul" : "ol";
      if (!list || listType !== type) { list = el(type); listType = type; root.append(list); }
      list.append(inline((b || n)[1], el("li")));
      continue;
    }
    list = null; listType = null;
    if (!line.trim()) continue;
    root.append(inline(h ? h[1] : line, el(h ? "h4" : "p")));
  }
  return root;
}
/** Mostra a resposta da IA aparecendo aos poucos dentro de `box`. */
async function streamInto(box, { system, prompt, effort = "medium", maxTokens = 3000 }) {
  const ctl = new AbortController();
  const stop = el("button", { class: "btn small ghost", type: "button", onclick: () => ctl.abort() }, "Parar");
  put(box, el("span", { class: "thinking" }, `${aiName()} está pensando...`), stop);
  try {
    const text = await aiText({ system, messages: [{ role: "user", content: prompt }], effort, maxTokens, signal: ctl.signal, onText: (t) => put(box, md(t), stop) });
    put(box, md(text));
    return text;
  } catch (e) {
    if (e.code === "cancelled") { box.lastChild === stop && stop.remove(); return null; }
    put(box, el("p", { class: "note warn" }, aiErrorText(e)));
    return null;
  }
}

// ---------- Exercícios ----------
function fb(ok, text) { return el("div", { class: `fb ${ok ? "ok" : "no"}` }, el("b", {}, ok ? "Correto! " : "Quase. "), text || ""); }
function renderExercise(q, idx, onDone) {
  const type = q[0];
  const box = el("div", { class: "card flat ex" }, el("div", { class: "ex-num" }, `Exercício ${idx + 1}`));
  let answered = false;
  const finish = (ok, node) => { if (answered) return; answered = true; box.append(node); onDone?.(ok); };
  if (type === "mc") {
    const [, question, opts, ans, expl] = q;
    box.append(el("div", { class: "ex-q" }, question));
    const wrap = el("div", { class: "opts" });
    shuffle(opts.map((_, i) => i)).forEach((i) => {
      const b = el("button", { class: "opt", type: "button", "data-i": i, onclick: () => {
        if (answered) return;
        $$(".opt", wrap).forEach((x) => (x.disabled = true));
        const ok = i === ans;
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) wrap.querySelector(`[data-i="${ans}"]`).classList.add("right");
        finish(ok, fb(ok, ok ? expl : `Resposta: ${opts[ans]}. ${expl || ""}`));
      } }, opts[i]);
      wrap.append(b);
    });
    box.append(wrap);
  } else if (type === "fill") {
    const [, question, answers, expl] = q;
    box.append(el("div", { class: "ex-q" }, question));
    const input = el("input", { type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Sua resposta", placeholder: "Digite a resposta" });
    const btn = el("button", { class: "btn", type: "button" }, "Verificar");
    const check = () => {
      if (answered || !input.value.trim()) return;
      const ok = answers.some((a) => norm(a) === norm(input.value));
      input.disabled = true; btn.disabled = true;
      finish(ok, fb(ok, ok ? expl : `Resposta: ${answers[0]}. ${expl || ""}`));
    };
    btn.addEventListener("click", check);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    box.append(el("div", { class: "fill-row" }, input, btn));
  } else if (type === "order") {
    const [, sentence, trans] = q;
    const words = sentence.split(" ");
    box.append(el("div", { class: "ex-q" }, "Monte a frase: ", el("span", { class: "muted" }, trans)));
    const line = el("div", { class: "order-line", "aria-label": "Sua frase" });
    const pool = el("div", { class: "order-pool" });
    let order = shuffle(words.map((_, i) => i));
    for (let t = 0; t < 5 && order.every((v, i) => v === i) && words.length > 2; t++) order = shuffle(order);
    order.forEach((i) => {
      const w = words[i];
      const b = el("button", { class: "word", type: "button" }, w);
      b.addEventListener("click", () => {
        if (answered) return;
        b.remove();
        const chip = el("button", { class: "word", type: "button", onclick: () => { if (answered) return; chip.remove(); pool.append(b); } }, w);
        line.append(chip);
      });
      pool.append(b);
    });
    const btn = el("button", { class: "btn", type: "button", onclick: () => {
      if (answered) return;
      const built = $$(".word", line).map((x) => x.textContent).join(" ");
      if (!built) return;
      const ok = norm(built) === norm(sentence);
      btn.disabled = true;
      finish(ok, fb(ok, ok ? "Isso mesmo!" : `Ordem certa: ${sentence}`));
    } }, "Verificar");
    box.append(line, pool, el("div", {}, btn));
  }
  return box;
}
function validMC(arr, max = 6) {
  return (Array.isArray(arr) ? arr : []).filter((x) => x && typeof x.q === "string" && Array.isArray(x.options) && x.options.length >= 2 &&
    x.options.every((o) => typeof o === "string") && Number.isInteger(x.answer) && x.answer >= 0 && x.answer < x.options.length).slice(0, max);
}

// ---------- Navegação ----------
const SIDE_NAV = [["inicio", "Início", "home"], ["trilha", "Trilha", "route"], ["chamada", "Chamada de vídeo", "video"], ["conversa", "Conversa com IA", "chat"],
  ["aulas", "Vídeo-aulas", "play"], ["treino", "Treino", "target"], ["expressoes", "Gírias e expressões", "book"], ["professores", "Professores", "user"],
  ["vozes", "Vozes", "speaker"], ["lembretes", "Lembretes", "bell"], ["ajustes", "Ajustes", "gear"]];
const TAB_NAV = [["inicio", "Início", "home"], ["trilha", "Trilha", "route"], ["chamada", "Chamada", "video"], ["conversa", "Conversa", "chat"], ["mais", "Mais", "grid"]];
function buildNav() {
  put($("#side-nav"), ...SIDE_NAV.map(([id, label, ic]) => el("a", { class: "navlink", href: "#" + id, "data-nav": id }, icon(ic), label)));
  put($("#tab-nav"), ...TAB_NAV.map(([id, label, ic]) => el("a", { href: "#" + id, "data-nav": id }, icon(ic), label)));
}
function updateChrome() {
  $("#side-xp").textContent = P.xp;
  $("#side-streak").textContent = streakNow();
}
const VIEWS = ["inicio", "trilha", "licao", "aula", "aulas", "expressoes", "conversa", "treino", "lembretes", "ajustes", "mais", "motivacao", "professores", "vozes", "chamada"];
const MORE_VIEWS = ["mais", "aulas", "aula", "expressoes", "lembretes", "ajustes", "treino", "professores", "vozes"];
let currentCleanup = null;
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || "inicio";
  let view = h, arg = null;
  if (h.startsWith("licao-")) { view = "licao"; arg = h.slice(6); }
  if (h.startsWith("aula-")) { view = "aula"; arg = h.slice(5); }
  if (!VIEWS.includes(view)) view = "inicio";
  if (currentCleanup) { currentCleanup(); currentCleanup = null; }
  VIEWS.forEach((v) => ($("#view-" + v).hidden = v !== view));
  const sideId = view === "licao" ? "trilha" : view === "aula" ? "aulas" : view;
  const tabId = view === "licao" ? "trilha" : MORE_VIEWS.includes(view) ? "mais" : view;
  $$("#side-nav [data-nav]").forEach((a) => (a.dataset.nav === sideId ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  $$("#tab-nav [data-nav]").forEach((a) => (a.dataset.nav === tabId ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  ({ inicio: renderInicio, trilha: renderTrilha, licao: () => renderLicao(arg), aula: () => renderAula(arg), aulas: renderAulas, expressoes: renderExpressoes,
    conversa: renderConversa, treino: renderTreino, lembretes: renderLembretes, ajustes: renderAjustes, mais: renderMais, motivacao: renderMotivacao,
    professores: renderProfessores, vozes: renderVozes, chamada: renderChamada })[view]();
}
let lastView = "";
window.addEventListener("hashchange", () => {
  route();
  const v = location.hash.slice(1) || "inicio";
  if (v !== lastView) window.scrollTo({ top: 0 });
  lastView = v;
});

// ---------- Tela: Início ----------
const nextLesson = () => LESSONS.find((l) => !P.lessons[l.id]) || LESSONS[LESSONS.length - 1];
const slangOfDay = () => { const safe = SLANG.filter((s) => s[5] < 3); return safe[dayNum() % safe.length]; };
function action(href, ic, title, desc, before) {
  return el("a", { class: "action", href, onclick: () => before?.() }, icon(ic), el("b", {}, title), el("span", {}, desc));
}
function renderInicio() {
  const v = $("#view-inicio");
  const nl = nextLesson(), nlIndex = LESSONS.indexOf(nl);
  const goal = P.goal || 50, dx = dailyXP(), sd = slangOfDay();
  const xpIn = P.xp % LEVEL_SIZE;
  const motiv = MOTIVATION[dayNum() % MOTIVATION.length];
  put(v, 
    !S.onboarded ? el("section", { class: "card welcome stack" },
      el("div", { class: "welcome-row" }, el("div", { class: "welcome-face", html: faceHTML(84) }),
        el("div", { class: "stack", style: "gap:4px" }, el("h2", {}, `Bem-vindo ao Inglesei! Eu sou ${tutorRef(tutor())}.`),
          el("p", {}, "A trilha, as gírias, as vídeo-aulas e o treino já funcionam. Para conversar comigo, configure a IA em 2 minutos."))),
      el("div", { class: "row" },
        el("a", { class: "btn primary", href: "#ajustes", onclick: () => { S.onboarded = true; saveSettings(); } }, icon("gear"), "Configurar IA"),
        el("a", { class: "btn", href: "#lembretes", onclick: () => { S.onboarded = true; saveSettings(); } }, icon("bell"), "Criar lembrete"),
        el("button", { class: "btn ghost", type: "button", onclick: () => { S.onboarded = true; saveSettings(); renderInicio(); } }, "Agora não"))) : null,
    el("header", { class: "hello" },
      el("span", { class: "eyebrow" }, new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })),
      el("h1", {}, "Hey! Bora praticar seu inglês?"),
      el("p", { class: "quote" }, el("span", { class: "en" }, `“${motiv[0]}”`), speakBtn(motiv[0]), el("span", { class: "muted" }, motiv[1]))),
    el("div", { class: "stats" },
      el("div", { class: "stat" }, el("b", {}, `${dx}/${goal}`), el("span", {}, "XP hoje (meta diária)"), el("div", { class: "bar", style: "margin-top:8px" }, el("i", { style: `width:${Math.min(100, (dx / goal) * 100)}%` }))),
      el("div", { class: "stat" }, el("b", {}, `Nível ${playerLevel()}`), el("span", {}, `${xpIn}/${LEVEL_SIZE} XP para o próximo`), el("div", { class: "bar blue", style: "margin-top:8px" }, el("i", { style: `width:${(xpIn / LEVEL_SIZE) * 100}%` }))),
      el("div", { class: "stat" }, el("b", {}, streakNow()), el("span", {}, streakNow() === 1 ? "dia seguido" : "dias seguidos")),
      el("div", { class: "stat" }, el("b", {}, `${lessonsDone()}/${LESSONS.length}`), el("span", {}, `lições · ${mastered()} expressões dominadas`))),
    el("section", { class: "card continue" },
      el("div", {}, el("span", { class: "eyebrow" }, `${lessonsDone() ? "Continue de onde parou" : "Comece por aqui"} · ${nl.lvl} · lição ${nlIndex + 1}`), el("h2", {}, nl.title)),
      el("div", { class: "row" },
        el("a", { class: "btn light", href: "#aula-" + nl.id }, icon("play"), "Vídeo-aula"),
        el("a", { class: "btn primary", href: "#licao-" + nl.id }, "Abrir lição", icon("arrowR")))),
    el("section", { class: "actions" },
      action("#conversa", "chat", "Conversar com a IA", `${SCENARIOS.length} situações reais, com correção e voz`),
      action("#aulas", "play", "Vídeo-aulas", `${cap(tutorRef(tutor()))} explica com voz e legenda`),
      action("#treino", "target", "Revisar flashcards", "Repetição espaçada de gírias e expressões", () => (train.mode = "flash")),
      action("#expressoes", "book", "Gírias americanas", `${SLANG.length} gírias, ${PHRASAL.length} phrasal verbs e ${IDIOMS.length} idioms`)),
    el("section", { class: "card slang-day stack" },
      el("div", { class: "row spread" }, el("span", { class: "eyebrow" }, "Gíria do dia"), el("span", { class: `reg reg-${sd[5]}` }, REGISTERS[sd[5]].label)),
      el("div", { class: "row" }, el("span", { class: "term" }, sd[0]), speakBtn(sd[0])),
      el("p", {}, el("strong", {}, sd[1])),
      el("div", { class: "row", style: "flex-wrap:nowrap;align-items:flex-start" }, speakBtn(sd[2]), el("div", {}, el("em", {}, sd[2]), el("div", { class: "muted" }, sd[3])))),
  );
}

// ---------- Tela: Trilha ----------
function renderTrilha() {
  const v = $("#view-trilha");
  const done = lessonsDone();
  put(v, 
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Teoria + prática"), el("h1", {}, "Sua trilha do A1 ao C1"),
      el("p", { class: "muted" }, "Os níveis seguem o Quadro Europeu (CEFR). Cada lição tem vídeo-aula, teoria, exemplos com áudio, erros comuns de brasileiros e exercícios.")),
    el("div", { class: "card stack" }, el("div", { class: "row spread" }, el("b", {}, "Progresso geral"), el("span", { class: "mono" }, `${done}/${LESSONS.length}`)),
      el("div", { class: "bar" }, el("i", { style: `width:${(done / LESSONS.length) * 100}%` }))),
    ...LEVELS.map((lv) => {
      const items = LESSONS.filter((l) => l.lvl === lv.id);
      const d = items.filter((l) => P.lessons[l.id]).length;
      return el("section", { class: "level-block" },
        el("div", { class: "level-head" }, el("span", { class: "level-badge" }, lv.id),
          el("div", {}, el("h2", {}, lv.name), el("p", { class: "muted" }, lv.desc)), el("span", { class: "mono muted" }, `${d}/${items.length}`)),
        el("div", { class: "lesson-list" }, ...items.map((l) => {
          const r = P.lessons[l.id];
          return el("a", { class: "lesson-item", href: "#licao-" + l.id },
            el("span", { class: "lesson-num" }, String(LESSONS.indexOf(l) + 1).padStart(2, "0")),
            el("span", {}, el("span", { class: "t" }, l.title), r ? el("div", { class: "muted small" }, `Acertos: ${r.score}/${r.total}`) : null),
            el("span", { class: "done-dot" + (r ? " done" : ""), "aria-label": r ? "Concluída" : "Não concluída" }, r ? icon("check") : null));
        })));
    }),
  );
}

// ---------- Tela: Lição ----------
function renderLicao(id) {
  const idx = LESSONS.findIndex((l) => l.id === id);
  if (idx < 0) { location.hash = "#trilha"; return; }
  const L = LESSONS[idx], lv = LEVELS.find((x) => x.id === L.lvl);
  const v = $("#view-licao");
  const theory = el("div", { class: "theory", html: L.theory });
  $$("table", theory).forEach((t) => { const w = el("div", { class: "table-scroll" }); t.replaceWith(w); w.append(t); });
  const total = L.q.length; let answered = 0, correct = 0;
  const scoreBox = el("div", { class: "card", hidden: true });
  const list = el("div", { class: "ex-list" }, ...L.q.map((q, k) => renderExercise(q, k, (ok) => {
    answered++; if (ok) correct++;
    if (answered === total) completeLesson(L, correct, total, scoreBox);
  })));
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  put(v, 
    el("div", { class: "row" }, el("a", { class: "btn ghost small", href: "#trilha" }, icon("arrowL"), "Trilha")),
    el("header", { class: "lesson-head" }, el("div", { class: "row" }, el("span", { class: "lvl" }, L.lvl), el("span", { class: "eyebrow" }, `${lv.name} · lição ${idx + 1} de ${LESSONS.length}`)), el("h1", {}, L.title),
      el("a", { class: "btn dark", href: "#aula-" + L.id, style: "justify-self:start" }, icon("play"), `Assistir vídeo-aula com ${tutorRef(tutor())}`)),
    el("section", { class: "card stack" }, el("span", { class: "eyebrow" }, "Teoria"), theory),
    el("section", { class: "card stack" }, el("span", { class: "eyebrow" }, "Exemplos · toque para ouvir"),
      el("div", { class: "examples" }, ...L.ex.map(([en, pt]) => el("div", { class: "example" }, speakBtn(en), el("div", {}, el("div", { class: "en" }, en), el("div", { class: "pt" }, pt)))))),
    L.tips.length ? el("section", { class: "note tip tips" }, el("b", {}, "Erros comuns de brasileiros"), el("ul", {}, ...L.tips.map((t) => el("li", { html: t })))) : null,
    el("section", { class: "stack" }, el("h2", {}, "Pratique"), list, scoreBox),
    teacherCard(L),
    el("nav", { class: "row spread", "aria-label": "Outras lições" },
      prev ? el("a", { class: "btn", href: "#licao-" + prev.id }, icon("arrowL"), "Anterior") : el("span"),
      next ? el("a", { class: "btn dark", href: "#licao-" + next.id }, "Próxima lição", icon("arrowR")) : el("a", { class: "btn dark", href: "#trilha" }, "Ver trilha")),
  );
}
function completeLesson(L, correct, total, box) {
  const prev = P.lessons[L.id];
  let gain = 0;
  if (!prev) gain = 10 + correct * 5;
  else if (correct > prev.score) gain = (correct - prev.score) * 5;
  P.lessons[L.id] = { score: Math.max(correct, prev ? prev.score : 0), total, date: today() };
  if (gain) addXP(gain); else save();
  const next = LESSONS[LESSONS.indexOf(L) + 1];
  const pct = Math.round((correct / total) * 100);
  box.hidden = false;
  put(box, el("div", { class: "score" }, el("b", {}, `${correct}/${total}`),
    el("div", {}, el("strong", {}, pct === 100 ? "Perfeito! Lição concluída." : pct >= 60 ? "Boa! Lição concluída." : "Lição concluída. Vale rever a vídeo-aula."),
      el("div", { class: "muted" }, gain ? `Você ganhou ${gain} XP.` : "Refaça para melhorar sua pontuação."))),
    el("div", { class: "row", style: "margin-top:12px" },
      el("button", { class: "btn", type: "button", onclick: () => renderLicao(L.id) }, icon("refresh"), "Refazer"),
      next ? el("a", { class: "btn primary", href: "#licao-" + next.id }, "Próxima lição", icon("arrowR")) : null));
}
function teacherCard(L) {
  const out = el("div", { class: "stack" });
  const card = el("section", { class: "card stack" },
    el("div", { class: "row spread" }, el("h2", {}, `Pergunte ${tutor().g === "f" ? "à" : "ao"} ${tutor().name}`), el("span", { class: "ai-tag" }, "IA")),
    el("p", { class: "muted" }, "Tire dúvidas sobre esta lição ou peça exercícios novos, quantas vezes quiser."));
  if (!aiReady()) { card.append(aiGate()); return card; }
  const ta = el("textarea", { id: "teacher-q", placeholder: "Ex.: Qual a diferença entre for e since? Pode dar mais exemplos?", rows: "2", "aria-label": "Sua dúvida" });
  const system = `Você é ${tutorRef(tutor())}, de inglês americano, paciente e direto(a), ensinando um aluno brasileiro pelo app Inglesei.`;
  const ask = (q) => {
    if (!q.trim()) return;
    streamInto(out, { system, prompt: `Lição atual: "${L.title}" (nível ${L.lvl}).
Conteúdo da lição: ${plain(L.theory)}
Pedido do aluno: ${q}
Responda em português do Brasil, de forma clara e curta (até 200 palavras), com exemplos em inglês americano natural e a tradução de cada um. Use listas com "-" quando ajudar. Não use tabelas.` });
  };
  const gen = async () => {
    put(out, el("span", { class: "thinking" }, "Criando exercícios novos..."));
    try {
      const arr = await aiJSON({ system, effort: "medium", maxTokens: 4000, messages: [{ role: "user", content: `Crie 5 exercícios de múltipla escolha NOVOS sobre "${L.title}" (nível ${L.lvl}) para um brasileiro aprendendo inglês americano. Varie as situações (trabalho, viagem, amigos, compras). Cada exercício tem exatamente 3 opções e só uma correta. A explicação é curta, em português.
Responda apenas com um array JSON neste formato:
[{"q":"frase em inglês com ___","options":["a","b","c"],"answer":0,"explain":"explicação"}]` }] });
      const items = validMC(arr);
      if (!items.length) throw { code: "bad_json" };
      let got = 0, n = 0;
      put(out, el("span", { class: "eyebrow" }, "Exercícios criados pela IA"),
        ...items.map((x, i) => renderExercise(["mc", x.q, x.options, x.answer, String(x.explain || "")], i, (ok) => { n++; if (ok) got++; if (n === items.length && got) addXP(got * 3); })));
    } catch (e) { put(out, el("p", { class: "note warn" }, aiErrorText(e))); }
  };
  card.append(ta, el("div", { class: "row" },
    el("button", { class: "btn primary", type: "button", onclick: () => ask(ta.value) }, icon("spark"), "Perguntar"),
    el("button", { class: "chip", type: "button", onclick: () => ask("Explique esta lição de outro jeito, mais simples.") }, "Explique de outro jeito"),
    el("button", { class: "chip", type: "button", onclick: () => ask("Dê mais exemplos do dia a dia nos EUA.") }, "Mais exemplos"),
    el("button", { class: "chip", type: "button", onclick: gen }, "Gerar exercícios novos")), out);
  return card;
}

// ---------- Vídeo-aulas ----------
function renderAula(id) {
  const L = LESSONS.find((l) => l.id === id);
  if (!L) { location.hash = "#aulas"; return; }
  const v = $("#view-aula");
  const stage = el("div", { class: "card tutor" });
  put(v, 
    el("div", { class: "row" }, el("a", { class: "btn ghost small", href: "#aulas" }, icon("arrowL"), "Vídeo-aulas")),
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, `${L.lvl} · vídeo-aula`), el("h1", {}, L.title)),
    canSpeak() ? null : el("p", { class: "note warn" }, "A voz não está disponível neste aparelho. A aula aparece com legendas."),
    el("div", { class: "row" }, el("a", { class: "chip", href: "#professores" }, "Trocar professor(a)"), el("a", { class: "chip", href: "#vozes" }, "Trocar voz")),
    stage,
    el("div", { class: "row" }, el("a", { class: "btn primary", href: "#licao-" + L.id }, "Ir para os exercícios", icon("arrowR"))));
  const player = createPlayer(stage, lessonToSlides(L, tutor()), { html: faceHTML(150), title: tutorTitle(tutor()) }, { onEnd: () => { P.stats.aulas = (P.stats.aulas || 0) + 1; addXP(5); } });
  currentCleanup = () => player.destroy();
}
const AI_TOPICS = ["Pedir comida no drive-thru", "Phrasal verbs com GET", "Gírias da Gen Z", "Inglês para entrevista de emprego em TI", "Make x do", "Como fazer small talk", "Falar de preços e dinheiro", "Inglês para viagem à Disney"];
function renderAulas() {
  const v = $("#view-aulas");
  const out = el("div", { class: "stack" });
  const topic = el("input", { type: "text", id: "aula-topic", placeholder: "Ex.: como pedir desconto numa loja", "aria-label": "Tema da aula" });
  const level = el("select", { id: "aula-level", "aria-label": "Nível" }, ...Object.entries(CONV_LEVELS).map(([k, o]) => el("option", { value: k, selected: k === "mid" }, o.label)));
  let player = null;
  const generate = async (t) => {
    const theme = (t || topic.value).trim();
    if (!theme) { toast("Escreva um tema para a aula."); return; }
    topic.value = theme;
    if (player) { player.destroy(); player = null; }
    put(out, el("p", { class: "thinking" }, `${cap(tutorRef(tutor()))} está preparando sua aula sobre "${theme}"...`));
    try {
      const data = await aiJSON({ effort: "medium", maxTokens: 6000,
        system: `Você é ${tutorRef(tutor())}, de inglês americano para brasileiros no app Inglesei. Suas aulas são curtas, animadas e práticas.`,
        messages: [{ role: "user", content: `Crie uma mini-aula narrada sobre: "${theme}", para um aluno de nível ${CONV_LEVELS[level.value].label}.
Regras: de 4 a 6 slides; cada slide com 2 a 5 falas curtas (até 25 palavras cada). Explicações em português do Brasil ("lang":"pt"); frases e exemplos em inglês americano ("lang":"en"), cada exemplo seguido da tradução em português. Inclua o que um americano realmente diria. O último slide é uma revisão.
Depois crie 3 exercícios de múltipla escolha sobre a aula.
Responda apenas com JSON neste formato:
{"title":"...","slides":[{"title":"...","lines":[{"lang":"pt","text":"..."},{"lang":"en","text":"..."}]}],"quiz":[{"q":"...","options":["a","b","c"],"answer":0,"explain":"..."}]}` }] });
      const slides = (data && Array.isArray(data.slides) ? data.slides : []).filter((s) => s && typeof s.title === "string" && Array.isArray(s.lines))
        .map((s) => ({ title: s.title, lines: s.lines.filter((l) => l && typeof l.text === "string" && l.text.trim()).slice(0, 8) })).filter((s) => s.lines.length).slice(0, 8);
      if (!slides.length) throw { code: "bad_json" };
      const stage = el("div", { class: "card tutor" });
      const quiz = validMC(data.quiz, 5);
      let n = 0, got = 0;
      put(out, el("h2", {}, String(data.title || theme)), stage,
        quiz.length ? el("section", { class: "stack" }, el("h2", {}, "Teste rápido"), ...quiz.map((x, i) => renderExercise(["mc", x.q, x.options, x.answer, String(x.explain || "")], i, (ok) => { n++; if (ok) got++; if (n === quiz.length && got) addXP(got * 3); }))) : null);
      player = createPlayer(stage, aiLessonToSlides({ slides }), { html: faceHTML(150), title: tutorTitle(tutor()) }, { onEnd: () => addXP(5) });
      currentCleanup = () => player && player.destroy();
    } catch (e) { put(out, el("p", { class: "note warn" }, aiErrorText(e))); }
  };
  const lessonsByLevel = LEVELS.map((lv) => el("details", { class: "card flat" },
    el("summary", {}, el("span", { class: "lvl" }, lv.id), " ", lv.name),
    el("div", { class: "lesson-list", style: "margin-top:10px" }, ...LESSONS.filter((l) => l.lvl === lv.id).map((l) =>
      el("a", { class: "lesson-item", href: "#aula-" + l.id }, el("span", { class: "lesson-num" }, String(LESSONS.indexOf(l) + 1).padStart(2, "0")), el("span", { class: "t" }, l.title), icon("play"))))));
  put(v, 
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Aulas com voz e legenda"), el("h1", {}, `Vídeo-aulas com ${tutorRef(tutor())}`),
      el("p", { class: "muted" }, `${cap(tutorRef(tutor()))} explica cada lição falando, com legenda e slides. Ou peça uma aula sob medida sobre qualquer assunto.`)),
    el("section", { class: "card stack" },
      el("div", { class: "row spread" }, el("h2", {}, "Aula sob medida com IA"), el("span", { class: "ai-tag" }, "IA")),
      aiReady() ? el("div", { class: "stack" },
        el("div", { class: "fill-row" }, topic, level),
        el("div", { class: "row" }, el("button", { class: "btn primary", type: "button", onclick: () => generate() }, icon("spark"), "Criar aula"),
          ...AI_TOPICS.map((t) => el("button", { class: "chip", type: "button", onclick: () => generate(t) }, t))),
        out) : aiGate()),
    el("h2", {}, "Aulas da trilha"),
    ...lessonsByLevel);
  topic.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });
  currentCleanup = () => player && player.destroy();
}

// ---------- Gírias e expressões ----------
const DECKS = { s: { name: "Gírias", list: SLANG }, p: { name: "Phrasal verbs", list: PHRASAL }, i: { name: "Idioms", list: IDIOMS } };
const EMOJI = { s: SLANG_EMOJI, p: PHRASAL_EMOJI, i: IDIOM_EMOJI };
const emojiFor = (key) => (EMOJI[key[0]] || [])[Number(key.slice(1))] || "💬";
// Cores dos cartões: uma por tema de gíria, e uma para phrasal verbs e idioms.
const CARD_GRADS = ["#6c4cf5,#b245e8", "#ff4f7b,#ff8a5b", "#00a3a3,#1f6feb", "#15913f,#84cc16", "#f59e0b,#ef4444", "#0ea5e9,#6366f1", "#d946ef,#f43f5e", "#14b8a6,#22c55e"];
function cardGrad(key) {
  const item = DECKS[key[0]].list[Number(key.slice(1))];
  const i = key[0] === "s" ? item[4] : key[0] === "p" ? 5 : 2;
  return `linear-gradient(145deg,${CARD_GRADS[i % CARD_GRADS.length]})`;
}
const expr = { tab: "s", q: "", cat: -1, reg: -1 };
const isFav = (k) => P.favs.includes(k);
function toggleFav(k, btn) {
  P.favs = isFav(k) ? P.favs.filter((x) => x !== k) : [...P.favs, k];
  save();
  btn.classList.toggle("on", isFav(k));
  btn.setAttribute("aria-pressed", String(isFav(k)));
  toast(isFav(k) ? "Adicionado aos favoritos" : "Removido dos favoritos");
}
function exprCard(key) {
  const deck = key[0], item = DECKS[deck].list[Number(key.slice(1))];
  if (!item) return null;
  const [term, mean, en, pt] = item;
  const reg = deck === "s" ? item[5] : null;
  const aiBox = el("div", { class: "stack" });
  const favBtn = el("button", { class: "icon-btn" + (isFav(key) ? " on" : ""), type: "button", "aria-label": "Favoritar", "aria-pressed": String(isFav(key)), title: "Favoritar" }, icon("star"));
  favBtn.addEventListener("click", () => toggleFav(key, favBtn));
  return el("article", { class: "card expr" },
    el("div", { class: "expr-top" }, el("div", { class: "expr-head" }, el("span", { class: "expr-emoji", style: `background:${cardGrad(key)}`, "aria-hidden": "true" }, emojiFor(key)), el("div", { class: "term" }, term)),
      el("div", { class: "expr-tools" }, speakBtn(term), favBtn)),
    el("div", { class: "row" }, reg != null ? el("span", { class: `reg reg-${reg}`, title: REGISTERS[reg].hint }, REGISTERS[reg].label) : el("span", { class: "chip" }, DECKS[deck].name),
      deck === "s" ? el("span", { class: "chip" }, SLANG_CATS[item[4]]) : null),
    el("div", { class: "mean" }, mean),
    el("div", { class: "row", style: "align-items:flex-start;flex-wrap:nowrap" }, speakBtn(en, "Ouvir exemplo"), el("div", { style: "min-width:0" }, el("div", { class: "exen" }, en), el("div", { class: "expt" }, pt))),
    aiReady() ? el("button", { class: "btn small ghost", type: "button", style: "justify-self:start", onclick: () => streamInto(aiBox, {
      system: `Você é ${tutorRef(tutor())}, de inglês americano para brasileiros.`, effort: "low",
      prompt: `Explique a expressão do inglês americano "${term}" (significado: ${mean}).
Dê: 1) quando usar e com quem (tom e registro); 2) três exemplos novos e naturais em inglês, cada um com tradução; 3) uma alternativa mais neutra, se for muito informal ou vulgar.
Responda em português, curto, usando listas com "-".` }) }, icon("spark"), "Mais exemplos com IA") : null,
    aiBox);
}
function renderExpressoes() {
  const v = $("#view-expressoes");
  if (!v.dataset.built) {
    v.dataset.built = "1";
    const tabs = el("div", { class: "seg", role: "group", "aria-label": "Tipo de expressão" },
      ...[["s", "Gírias"], ["p", "Phrasal verbs"], ["i", "Idioms"], ["f", "Favoritos"]].map(([k, l]) =>
        el("button", { type: "button", "data-tab": k, onclick: () => { expr.tab = k; expr.cat = -1; expr.reg = -1; drawExpr(); } }, l)));
    const search = el("input", { type: "search", id: "expr-search", placeholder: "Buscar em inglês ou português...", "aria-label": "Buscar expressão" });
    search.addEventListener("input", () => { expr.q = search.value; drawExpr(); });
    v.append(
      el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Como os americanos falam de verdade"), el("h1", {}, "Gírias e expressões"),
        el("p", { class: "muted" }, "Cada gíria mostra o registro: onde dá para usar sem passar vergonha. As marcadas como \"Cuidado\" são vulgares: entenda, mas evite usar.")),
      el("div", { class: "toolbar" }, tabs, search, el("div", { class: "filters", id: "expr-filters" })),
      el("p", { class: "muted", id: "expr-count" }),
      el("div", { class: "expr-list", id: "expr-list" }));
  }
  drawExpr();
}
function drawExpr() {
  $$("[data-tab]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tab === expr.tab)));
  const filters = $("#expr-filters");
  put(filters, );
  if (expr.tab === "s") {
    const chip = (label, active, fn) => el("button", { class: "chip", type: "button", "aria-pressed": String(active), onclick: fn }, label);
    filters.append(chip("Todas", expr.cat === -1, () => { expr.cat = -1; drawExpr(); }),
      ...SLANG_CATS.map((c, i) => chip(c, expr.cat === i, () => { expr.cat = i; drawExpr(); })),
      el("span", { style: "width:100%" }),
      chip("Qualquer registro", expr.reg === -1, () => { expr.reg = -1; drawExpr(); }),
      ...REGISTERS.map((r, i) => chip(r.label, expr.reg === i, () => { expr.reg = i; drawExpr(); })));
  }
  let keys = expr.tab === "f" ? P.favs.slice() : DECKS[expr.tab].list.map((_, i) => expr.tab + i);
  const q = norm(expr.q);
  keys = keys.filter((k) => {
    const item = DECKS[k[0]] && DECKS[k[0]].list[Number(k.slice(1))];
    if (!item) return false;
    if (k[0] === "s" && expr.tab === "s") {
      if (expr.cat >= 0 && item[4] !== expr.cat) return false;
      if (expr.reg >= 0 && item[5] !== expr.reg) return false;
    }
    return !q || norm(item.slice(0, 4).join(" ")).includes(q);
  });
  $("#expr-count").textContent = keys.length === 1 ? "1 expressão" : `${keys.length} expressões`;
  const list = $("#expr-list");
  put(list, ...keys.map(exprCard).filter(Boolean));
  if (!keys.length) list.append(el("p", { class: "empty" }, expr.tab === "f" ? "Toque na estrela de uma expressão para guardá-la aqui e revisar nos flashcards." : "Nada encontrado. Tente outra palavra."));
}

// ---------- Conversa com IA ----------
const conv = { scen: SCENARIOS.find((s) => s.id === "free"), level: "mid", correct: true, turns: [], busy: false, ctl: null, mic: null };
function convSystem() {
  const s = conv.scen;
  return `You are role-playing to help a Brazilian learner practice American English conversation in the app Inglesei.
Your role: ${s.role}.
Learner level: ${CONV_LEVELS[conv.level].txt}.
Rules:
- Stay in character. Reply with 1 to 3 short sentences in natural American English and usually end with a question to keep the conversation going.
- Your in-character reply is always in English, even if the learner writes in Portuguese.
${conv.correct
    ? `- Before your reply, give feedback in Brazilian Portuguese about the learner's LAST message only. If it has mistakes, write the corrected sentence and a very short explanation (2 lines max). If it is correct but could sound more natural to an American, show the more natural version. If it is perfect, write only "Perfeito!". If the learner wrote in Portuguese, show how to say it in English. The learner may use voice dictation, so ignore missing punctuation and capitalization.`
    : `- Do not correct the learner. Write "FEEDBACK: -".`}
Output format, exactly:
FEEDBACK: <feedback in Portuguese>
===
<your in-character reply in English>`;
}
function parseReply(t) {
  const i = t.indexOf("===");
  if (i < 0) {
    if (/^\s*FEEDBACK:/i.test(t)) return { fb: t.replace(/^\s*FEEDBACK:\s*/i, "").trim(), reply: "" };
    return { fb: "", reply: t.trim() };
  }
  return { fb: t.slice(0, i).replace(/^\s*FEEDBACK:\s*/i, "").trim(), reply: t.slice(i).replace(/^=+/, "").trim() };
}
function aiMsg(text) {
  const bubble = el("div", { class: "bubble" }, text);
  const trans = el("div", { class: "translation", hidden: true });
  const tools = el("div", { class: "msg-tools" },
    canSpeak() ? el("button", { class: "btn ghost", type: "button", onclick: () => say(bubble.textContent) }, icon("speaker"), "Ouvir") : null,
    el("button", { class: "btn ghost", type: "button", onclick: async () => {
      if (!trans.hidden) { trans.hidden = true; return; }
      trans.hidden = false; trans.textContent = "Traduzindo...";
      try {
        trans.textContent = (await aiText({ system: "Você traduz do inglês para o português do Brasil, de forma natural. Responda só com a tradução.", messages: [{ role: "user", content: bubble.textContent }], effort: "low", maxTokens: 1000 })).trim();
      } catch (err) { trans.textContent = aiErrorText(err); }
    } }, "Traduzir"));
  const m = el("div", { class: "msg ai" }, bubble, tools, trans);
  m._bubble = bubble; m._tools = tools;
  return m;
}
function meMsg(text) {
  const f = el("div", { class: "feedback", hidden: true });
  const m = el("div", { class: "msg me" }, el("div", { class: "bubble" }, text), f);
  m._fb = f;
  return m;
}
function showFb(m, text) {
  if (!text || text === "-") { m._fb.hidden = true; return; }
  m._fb.hidden = false;
  m._fb.classList.toggle("perfect", /^perfeito!?$/i.test(text.trim()));
  m._fb.textContent = text;
}
function resetConv() {
  if (conv.ctl) conv.ctl.abort();
  stopSpeaking();
  conv.turns = [{ role: "assistant", content: conv.scen.opener }];
  put($("#msgs"), aiMsg(conv.scen.opener));
  put($("#suggests"), );
  $("#chat-title").textContent = conv.scen.title;
  $("#scen-desc").textContent = conv.scen.desc;
  if (S.voiceMode) say(conv.scen.opener);
}
async function sendConv(textArg) {
  const input = $("#conv-input"), sendBtn = $("#conv-send");
  const text = (textArg ?? input.value).trim();
  if (!text || conv.busy) return;
  input.value = ""; input.style.height = "";
  put($("#suggests"), );
  stopSpeaking();
  const box = $("#msgs");
  const me = meMsg(text);
  const ai = aiMsg("");
  put(ai._bubble, el("span", { class: "thinking" }, "digitando..."));
  ai._tools.hidden = true;
  box.append(me, ai);
  box.scrollTop = box.scrollHeight;
  conv.turns.push({ role: "user", content: text });
  conv.busy = true; sendBtn.disabled = true;
  const ctl = new AbortController(); conv.ctl = ctl;
  // A API exige que a conversa comece com uma mensagem do usuário.
  const messages = [{ role: "user", content: "(Start the role-play.)" }, ...conv.turns.slice(-24)];
  try {
    const full = await aiText({ system: convSystem(), messages, effort: "low", maxTokens: 1500, signal: ctl.signal, onText: (t) => {
      const p = parseReply(t);
      showFb(me, p.fb);
      if (p.reply) ai._bubble.textContent = p.reply;
      box.scrollTop = box.scrollHeight;
    } });
    const p = parseReply(full);
    showFb(me, p.fb);
    const reply = p.reply || "Sorry, could you say that again?";
    ai._bubble.textContent = reply;
    ai._tools.hidden = false;
    conv.turns.push({ role: "assistant", content: reply });
    P.stats.msgs = (P.stats.msgs || 0) + 1;
    addXP(5, true);
    if (S.voiceMode) say(reply);
  } catch (e) {
    ai.remove();
    conv.turns.pop();
    if (e.code !== "cancelled") { me.append(el("div", { class: "fb no" }, aiErrorText(e))); input.value = text; }
  } finally {
    conv.busy = false; sendBtn.disabled = false;
    box.scrollTop = box.scrollHeight;
  }
}
async function suggestReplies() {
  if (conv.busy) return;
  const box = $("#suggests");
  put(box, el("span", { class: "thinking" }, "Pensando em respostas..."));
  const history = conv.turns.slice(-8).map((t) => `${t.role === "user" ? "Learner" : "Partner"}: ${t.content}`).join("\n");
  try {
    const arr = await aiJSON({ system: "You help a Brazilian learner answer in an English role-play.", effort: "low", maxTokens: 1500, messages: [{ role: "user", content: `Learner level: ${CONV_LEVELS[conv.level].txt}.
Scenario: ${conv.scen.role}.
Conversation so far:
${history}
Suggest 3 different short replies the learner could say next, in natural American English at their level.
Reply only with a JSON array: [{"en":"reply in English","pt":"tradução em português"}]` }] });
    const items = (Array.isArray(arr) ? arr : []).filter((x) => x && typeof x.en === "string").slice(0, 4);
    if (!items.length) throw { code: "bad_json" };
    put(box, ...items.map((x) => el("button", { class: "suggest", type: "button", onclick: () => { const i = $("#conv-input"); i.value = x.en; i.focus(); } }, x.en, el("small", {}, String(x.pt || "")))));
  } catch (e) { put(box, el("span", { class: "muted" }, aiErrorText(e))); }
}
function renderConversa() {
  const v = $("#view-conversa");
  if (!aiReady()) {
    delete v.dataset.built;
    put(v, el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Conversação com IA"), el("h1", {}, "Converse como nos EUA")), aiGate());
    return;
  }
  if (v.dataset.built) return;
  v.dataset.built = "1";
  const scenSel = el("select", { id: "conv-scen", "aria-label": "Situação" }, ...SCENARIO_GROUPS.map((g, gi) =>
    el("optgroup", { label: g }, ...SCENARIOS.filter((s) => s.group === gi).map((s) => el("option", { value: s.id, selected: s.id === conv.scen.id }, s.title)))));
  scenSel.addEventListener("change", () => { conv.scen = SCENARIOS.find((s) => s.id === scenSel.value); resetConv(); });
  const levelSel = el("select", { id: "conv-level", "aria-label": "Seu nível" }, ...Object.entries(CONV_LEVELS).map(([k, o]) => el("option", { value: k, selected: k === conv.level }, o.label)));
  levelSel.addEventListener("change", () => { conv.level = levelSel.value; toast(`Nível: ${CONV_LEVELS[conv.level].label}`); });
  const corrBtn = el("button", { class: "chip", type: "button", "aria-pressed": "true" }, "Correções ligadas");
  corrBtn.addEventListener("click", () => { conv.correct = !conv.correct; corrBtn.setAttribute("aria-pressed", String(conv.correct)); corrBtn.textContent = conv.correct ? "Correções ligadas" : "Correções desligadas"; });
  const voiceBtn = el("button", { class: "chip", type: "button", "aria-pressed": String(S.voiceMode), hidden: !canSpeak() }, "Modo voz");
  voiceBtn.addEventListener("click", () => { S.voiceMode = !S.voiceMode; saveSettings(); voiceBtn.setAttribute("aria-pressed", String(S.voiceMode)); toast(S.voiceMode ? `${cap(tutorRef(tutor()))} vai falar as respostas` : "Modo voz desligado"); if (!S.voiceMode) stopSpeaking(); });
  const input = el("textarea", { id: "conv-input", rows: "1", placeholder: "Escreva em inglês (ou em português, se travar)...", "aria-label": "Sua mensagem" });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(160, input.scrollHeight) + "px"; });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendConv(); } });
  const partial = el("div", { class: "partial", "aria-live": "polite" });
  const mic = el("button", { class: "icon-btn mic", type: "button", "aria-label": "Falar em inglês", title: "Falar em inglês", hidden: true }, icon("mic"));
  canListen().then((ok) => (mic.hidden = !ok));
  mic.addEventListener("click", async () => {
    if (conv.mic) { conv.mic.stop(); return; }
    await stopSpeaking();
    mic.classList.add("listening");
    conv.mic = await listen({
      onPartial: (t) => (partial.textContent = t),
      onEnd: (t, err) => {
        conv.mic = null; mic.classList.remove("listening"); partial.textContent = "";
        if (err === "not_granted") { toast("Permita o uso do microfone para falar com a IA."); return; }
        if (!t) return;
        if (S.voiceMode) sendConv(t);
        else { input.value = (input.value + " " + t).trim(); input.dispatchEvent(new Event("input")); }
      },
    });
  });
  const face = talkingFace(46, "chat-face");
  put(v, 
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, `Conversação com IA · ${SCENARIOS.length} situações`), el("h1", {}, "Converse como nos EUA"),
      el("p", { class: "muted" }, "Escolha a situação e responda como se fosse real. A correção de cada frase aparece em amarelo. No modo voz, você fala pelo microfone e a professora responde em voz alta.")),
    el("div", { class: "conv-controls" },
      el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Situação"), scenSel),
      el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Seu nível"), levelSel),
      el("div", { class: "row" }, corrBtn, voiceBtn)),
    el("section", { class: "card chat" },
      el("div", { class: "chat-head" }, face, el("div", { style: "min-width:0;flex:1" }, el("h2", { id: "chat-title" }, conv.scen.title), el("span", { class: "muted small", id: "scen-desc" }, conv.scen.desc)),
        el("button", { class: "btn small", type: "button", onclick: resetConv }, icon("refresh"), "Recomeçar")),
      el("div", { class: "msgs", id: "msgs", "aria-live": "polite" }),
      el("div", { class: "composer" },
        el("div", { class: "suggests", id: "suggests" }),
        partial,
        el("div", { class: "composer-row" }, mic, input, el("button", { class: "btn primary", id: "conv-send", type: "button", "aria-label": "Enviar", onclick: () => sendConv() }, icon("send"))),
        el("div", { class: "row" }, el("button", { class: "chip", type: "button", onclick: suggestReplies }, "Me ajuda a responder"),
          el("span", { class: "muted small" }, `IA: ${aiName()}`)))),
  );
  resetConv();
}

// ---------- Treino ----------
const train = { mode: null, deck: "s" };
const SENTENCES = [
  ...LESSONS.flatMap((l) => l.ex).filter(([en]) => en.split(" ").length >= 3 && !en.includes("/")),
  ...SLANG.filter((s) => s[5] < 3).map((s) => [s[2], s[3]]),
  ...PHRASAL.map((p) => [p[2], p[3]]),
  ...IDIOMS.map((p) => [p[2], p[3]]),
];
function wordDiff(target, said) {
  const tw = target.split(/\s+/).filter(Boolean);
  const pool = norm(said).split(" ").filter(Boolean);
  let hit = 0;
  const out = el("p", { class: "diff" });
  tw.forEach((w, i) => {
    const k = norm(w), j = pool.indexOf(k);
    if (i) out.append(" ");
    if (k && j >= 0) { pool.splice(j, 1); hit++; out.append(el("span", { class: "w-ok" }, w)); } else out.append(el("span", { class: "w-miss" }, w));
  });
  return { score: tw.length ? Math.round((hit / tw.length) * 100) : 0, node: out };
}
function renderTreino() {
  const v = $("#view-treino");
  if (!train.mode) {
    const card = (mode, ic, title, desc) => el("button", { class: "action", type: "button", onclick: () => { train.mode = mode; renderTreino(); } }, icon(ic), el("b", {}, title), el("span", {}, desc));
    put(v, 
      el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Prática diária"), el("h1", {}, "Treino"),
        el("p", { class: "muted" }, "Atividades curtas para fixar vocabulário, treinar o ouvido e destravar a fala.")),
      el("div", { class: "actions" },
        card("flash", "star", "Flashcards", `Revisão espaçada · ${mastered()} expressões dominadas`),
        card("listen", "speaker", "Treino de ouvido", "Ouça uma frase e escreva o que entendeu"),
        card("speak", "mic", "Treino de fala", "Leia em voz alta e veja o quanto foi entendido"),
        card("write", "spark", "Redação corrigida", "Escreva um texto e a IA corrige e explica"),
        card("quiz", "check", "Quiz rápido", "10 perguntas sorteadas da trilha")));
    return;
  }
  const back = el("button", { class: "btn ghost small", type: "button", onclick: () => { stopSpeaking(); train.mode = null; renderTreino(); } }, icon("arrowL"), "Treino");
  const body = el("div", { class: "stack" });
  put(v, el("div", { class: "row" }, back), body);
  ({ flash: trainFlash, listen: trainListen, speak: trainSpeak, write: trainWrite, quiz: trainQuiz })[train.mode](body);
}
function trainFlash(body) {
  const deck = train.deck;
  const pickDeck = el("div", { class: "seg", role: "group", "aria-label": "Baralho" },
    ...[["s", "Gírias"], ["p", "Phrasal verbs"], ["i", "Idioms"], ["f", "Favoritos"]].map(([k, l]) =>
      el("button", { type: "button", "aria-pressed": String(k === deck), onclick: () => { train.deck = k; renderTreino(); } }, l)));
  const area = el("div", { class: "stack" });
  body.append(el("h1", {}, "Flashcards"), el("p", { class: "muted" }, "Tente lembrar o significado antes de virar. Quanto mais você acerta, mais tempo o cartão demora para voltar."), pickDeck, area);
  const keys = deck === "f" ? P.favs.slice() : DECKS[deck].list.map((_, i) => deck + i);
  const t = today();
  const due = keys.filter((k) => P.cards[k] && P.cards[k].due <= t);
  const novos = keys.filter((k) => !P.cards[k]);
  const queue = [...shuffle(due), ...shuffle(novos).slice(0, Math.max(0, 10 - due.length))].slice(0, 20);
  const total = queue.length;
  let done = 0, right = 0, wrong = 0;
  const bar = el("div", { class: "fc-progress" }, el("i"));
  const score = el("div", { class: "fc-score" });
  const drawScore = () => {
    bar.firstChild.style.width = `${total ? (done / total) * 100 : 0}%`;
    put(score, el("span", { class: "fc-ok" }, `✓ ${right}`), el("span", { class: "muted" }, `${Math.max(0, total - done)} restantes`), el("span", { class: "fc-no" }, `✗ ${wrong}`));
  };
  area.before(bar, score);
  drawScore();
  const grade = (key, g) => {
    const c = P.cards[key] || { box: 0, due: t };
    if (g === 0) { c.box = 1; c.due = t; wrong++; }
    else if (g === 1) { c.box = Math.max(1, c.box); c.due = addDays(1); right++; }
    else { c.box = Math.min(5, c.box + 1); c.due = addDays([0, 1, 3, 7, 14, 30][c.box]); right++; }
    P.cards[key] = c; done++;
    addXP(2, true);
    drawScore();
    show();
  };
  const show = () => {
    const key = queue.shift();
    if (!key) {
      put(area, el("div", { class: "card fc-end" },
        el("div", { class: "fc-burst" }, done ? (right >= wrong ? "🎉" : "💪") : "😴"),
        el("h2", {}, done ? `Rodada concluída: ${right} de ${done}` : "Nada para revisar agora"),
        el("p", { class: "muted" }, deck === "f" && !keys.length ? "Você ainda não tem favoritos. Marque a estrela nas expressões." : done ? `+${done * 2} XP. Os cartões que você errou voltam antes.` : "Volte amanhã para revisar o que está agendado."),
        el("div", { class: "row center" },
          done ? el("button", { class: "btn primary", type: "button", onclick: () => renderTreino() }, icon("refresh"), "Nova rodada") : null,
          el("a", { class: "btn", href: "#expressoes" }, "Ver expressões"))));
      return;
    }
    const item = DECKS[key[0]].list[Number(key.slice(1))];
    const reg = key[0] === "s" ? item[5] : null;
    const front = el("div", { class: "fc-face fc-front", style: `background:${cardGrad(key)}` },
      el("span", { class: "fc-deck" }, key[0] === "s" ? SLANG_CATS[item[4]] : DECKS[key[0]].name),
      el("div", { class: "fc-emoji" }, emojiFor(key)),
      el("div", { class: "fc-term" }, item[0]),
      el("span", { class: "fc-hint" }, "Toque para virar · arraste para responder"));
    const back = el("div", { class: "fc-face fc-back" },
      el("div", { class: "fc-emoji small" }, emojiFor(key)),
      el("div", { class: "fc-mean" }, item[1]),
      el("div", { class: "fc-example" }, el("em", {}, item[2]), el("span", { class: "muted" }, item[3])),
      reg != null ? el("span", { class: `reg reg-${reg}` }, REGISTERS[reg].label) : null);
    const inner = el("div", { class: "fc-inner" }, front, back);
    const card = el("div", { class: "fc", role: "button", tabindex: "0", "aria-label": `Cartão: ${item[0]}. Toque para virar.` }, inner);
    const sayBtn = el("button", { class: "icon-btn fc-say", type: "button", "aria-label": "Ouvir" }, icon("speaker"));
    sayBtn.addEventListener("click", (e) => { e.stopPropagation(); say(card.classList.contains("flipped") ? item[2] : item[0]); });
    card.append(sayBtn);
    const flip = () => { card.classList.toggle("flipped"); if (card.classList.contains("flipped")) say(item[2]); };
    // Arrastar para os lados (direita = acertei, esquerda = errei)
    let x0 = null, dx = 0, moved = false;
    card.addEventListener("pointerdown", (e) => { x0 = e.clientX; dx = 0; moved = false; card.setPointerCapture(e.pointerId); card.classList.add("dragging"); });
    card.addEventListener("pointermove", (e) => {
      if (x0 == null) return;
      dx = e.clientX - x0; if (Math.abs(dx) > 6) moved = true;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      card.dataset.swipe = dx > 60 ? "ok" : dx < -60 ? "no" : "";
    });
    const release = () => {
      if (x0 == null) return;
      x0 = null; card.classList.remove("dragging");
      if (Math.abs(dx) > 90) {
        card.style.transition = "transform .25s ease, opacity .25s";
        card.style.transform = `translateX(${dx > 0 ? 500 : -500}px) rotate(${dx > 0 ? 25 : -25}deg)`;
        card.style.opacity = "0";
        setTimeout(() => grade(key, dx > 0 ? 2 : 0), 220);
      } else {
        card.style.transform = ""; card.dataset.swipe = "";
        if (!moved) flip();
      }
    };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    put(area, card,
      el("div", { class: "fc-actions" },
        el("button", { class: "fc-act no", type: "button", "aria-label": "Errei", onclick: () => grade(key, 0) }, "✗", el("span", {}, "Errei")),
        el("button", { class: "fc-act mid", type: "button", "aria-label": "Difícil", onclick: () => grade(key, 1) }, "😐", el("span", {}, "Difícil")),
        el("button", { class: "fc-act ok", type: "button", "aria-label": "Acertei", onclick: () => grade(key, 2) }, "✓", el("span", {}, "Acertei"))));
    say(item[0]);
  };
  show();
}
function trainListen(body) {
  body.append(el("h1", {}, "Treino de ouvido"), el("p", { class: "muted" }, "Ouça a frase (quantas vezes quiser) e escreva exatamente o que entendeu."));
  if (!canSpeak()) { body.append(el("p", { class: "note warn" }, "A voz não está disponível neste aparelho.")); return; }
  const area = el("div", { class: "card stack" });
  body.append(area);
  const next = () => {
    const [en, pt] = pick(SENTENCES);
    const input = el("input", { type: "text", id: "listen-input", autocomplete: "off", spellcheck: "false", placeholder: "Escreva o que ouviu", "aria-label": "O que você ouviu" });
    const result = el("div", { class: "stack" });
    const checkBtn = el("button", { class: "btn primary", type: "button" }, "Verificar");
    const check = () => {
      if (!input.value.trim() || input.disabled) return;
      input.disabled = true; checkBtn.disabled = true;
      const d = wordDiff(en, input.value);
      put(result, el("div", { class: `fb ${d.score >= 80 ? "ok" : "no"}` }, el("b", {}, `${d.score}% de acerto. `), d.score >= 80 ? "Mandou bem!" : "Ouça de novo e compare."), d.node, el("p", { class: "muted" }, pt),
        el("button", { class: "btn dark", type: "button", onclick: next, style: "justify-self:start" }, "Próxima frase", icon("arrowR")));
      if (d.score >= 80) { P.stats.listen = (P.stats.listen || 0) + 1; addXP(5); }
    };
    checkBtn.addEventListener("click", check);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    put(area, 
      el("div", { class: "row" }, el("button", { class: "btn dark", type: "button", onclick: () => say(en) }, icon("speaker"), "Ouvir"),
        el("button", { class: "btn", type: "button", onclick: () => say(en, "en-US", 0.7) }, "Ouvir bem devagar")),
      el("div", { class: "fill-row" }, input, checkBtn), result);
  };
  next();
}
function trainSpeak(body) {
  body.append(el("h1", {}, "Treino de fala"), el("p", { class: "muted" }, "Ouça o modelo, toque no microfone e leia a frase em voz alta. Depois veja quais palavras foram entendidas."));
  const area = el("div", { class: "card stack" });
  const noMic = el("p", { class: "note warn", hidden: true }, "O microfone não está disponível aqui. No Android, instale o app Inglesei; no computador, use o Chrome ou o Edge.");
  body.append(noMic, area);
  canListen().then((ok) => { noMic.hidden = ok; $$(".mic", area).forEach((b) => (b.hidden = !ok)); });
  let rec = null;
  const next = () => {
    const [en, pt] = pick(SENTENCES);
    const partial = el("div", { class: "partial" });
    const result = el("div", { class: "stack" });
    const mic = el("button", { class: "btn primary mic", type: "button" }, icon("mic"), el("span", {}, "Falar"));
    mic.addEventListener("click", async () => {
      if (rec) { rec.stop(); return; }
      await stopSpeaking();
      put(result, );
      mic.classList.add("listening"); mic.lastChild.textContent = "Parar";
      rec = await listen({
        onPartial: (t) => (partial.textContent = t),
        onEnd: (said, err) => {
          rec = null; mic.classList.remove("listening"); mic.lastChild.textContent = "Falar"; partial.textContent = "";
          if (err === "not_granted") { put(result, el("p", { class: "note warn" }, "Permita o uso do microfone para treinar a fala.")); return; }
          if (!said.trim()) { put(result, el("p", { class: "muted" }, "Não captei nada. Toque em Falar e leia a frase.")); return; }
          const d = wordDiff(en, said);
          put(result, el("div", { class: `fb ${d.score >= 80 ? "ok" : "no"}` }, el("b", {}, `${d.score}% entendido. `), d.score >= 80 ? "Pronúncia clara!" : "As palavras em vermelho não foram reconhecidas. Ouça o modelo e tente de novo."),
            el("p", { class: "muted" }, `Entendido: "${said.trim()}"`), d.node,
            el("div", { class: "row" }, el("button", { class: "btn dark", type: "button", onclick: next }, "Próxima frase", icon("arrowR"))));
          if (d.score >= 80) { P.stats.speak = (P.stats.speak || 0) + 1; addXP(5); }
        },
      });
    });
    put(area, el("p", { class: "say-big" }, en), el("p", { class: "muted" }, pt),
      el("div", { class: "row" }, canSpeak() ? el("button", { class: "btn", type: "button", onclick: () => say(en) }, icon("speaker"), "Ouvir modelo") : null, mic,
        el("button", { class: "btn ghost", type: "button", onclick: next }, "Pular")), partial, result);
    canListen().then((ok) => (mic.hidden = !ok));
  };
  next();
}
function trainWrite(body) {
  body.append(el("h1", {}, "Redação corrigida"), el("p", { class: "muted" }, "Escreva de 3 a 10 frases sobre o tema. A IA devolve o texto corrigido, explica cada erro e mostra como um americano escreveria."));
  if (!aiReady()) { body.append(aiGate()); return; }
  let topic = pick(WRITING_TOPICS);
  const topicEl = el("p", { class: "say-big" }, topic);
  const ta = el("textarea", { id: "write-text", rows: "7", placeholder: "Escreva em inglês. Sem medo de errar: é para isso que serve.", "aria-label": "Seu texto" });
  const out = el("div", { class: "stack" });
  body.append(el("div", { class: "card stack" },
    el("div", { class: "row spread" }, el("span", { class: "eyebrow" }, "Tema"), el("button", { class: "chip", type: "button", onclick: () => { topic = pick(WRITING_TOPICS.filter((x) => x !== topic)); topicEl.textContent = topic; } }, "Outro tema")),
    topicEl, ta,
    el("button", { class: "btn primary", type: "button", style: "justify-self:start", onclick: async () => {
      const text = ta.value.trim();
      if (text.split(/\s+/).length < 5) { toast("Escreva pelo menos uma frase completa."); return; }
      const r = await streamInto(out, { system: `Você é ${tutorRef(tutor())}, de inglês americano, e corrige redações de alunos brasileiros com carinho e precisão.`, prompt: `Tema: "${topic}"
Texto do aluno:
"""
${text.slice(0, 4000)}
"""
Responda em português do Brasil, neste formato:
**Texto corrigido:** (o texto inteiro corrigido, em inglês)
**Erros e explicações:** (lista com "-": trecho errado → correção, com explicação curta)
**Como um americano escreveria:** (versão natural, em inglês)
**Nota:** X/10 e uma dica para a próxima vez.`, maxTokens: 4000 });
      if (r) { P.stats.writing = (P.stats.writing || 0) + 1; addXP(10); }
    } }, icon("spark"), "Corrigir com IA"), out));
}
function trainQuiz(body) {
  const pool = LESSONS.flatMap((l) => l.q.filter((q) => q[0] === "mc" || q[0] === "fill").map((q) => ({ q, l })));
  const items = shuffle(pool).slice(0, 10);
  let n = 0, got = 0;
  const result = el("div", { class: "card", hidden: true });
  body.append(el("h1", {}, "Quiz rápido"), el("p", { class: "muted" }, "10 perguntas sorteadas de todos os níveis da trilha."),
    ...items.map(({ q, l }, i) => el("div", { class: "stack" }, el("span", { class: "eyebrow" }, `${l.lvl} · ${l.title}`), renderExercise(q, i, (ok) => {
      n++; if (ok) got++;
      if (n === items.length) {
        result.hidden = false;
        put(result, el("div", { class: "score" }, el("b", {}, `${got}/10`), el("div", {}, el("strong", {}, got >= 8 ? "Excelente!" : got >= 5 ? "Bom resultado!" : "Continue praticando na trilha."), el("div", { class: "muted" }, `+${got * 3} XP`))),
          el("div", { class: "row", style: "margin-top:12px" }, el("button", { class: "btn dark", type: "button", onclick: () => renderTreino() }, icon("refresh"), "Novo quiz")));
        P.stats.quiz = (P.stats.quiz || 0) + 1;
        if (got) addXP(got * 3);
        result.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }))), result);
}

// ---------- Lembretes ----------
const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const reminderVoice = () => (hasPack() && packVoices().some((v) => v.id === S.packVoice) ? S.packVoice : null);
const fmtWhen = (d) => d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
async function applyReminders(quiet) {
  if (!remindersSupported) return null;
  try {
    const st = await notificationStatus();
    if (st.display !== "granted") { if (!quiet) toast("Permita as notificações para receber os lembretes."); return null; }
    const dates = await scheduleReminders(S.reminders, REMINDER_LINES, reminderVoice());
    if (!quiet) toast(dates.length ? `Pronto! ${dates.length} lembretes agendados.` : "Nenhum lembrete ativo.");
    return dates;
  } catch {
    if (!quiet) toast("Não foi possível agendar os lembretes. Veja as permissões acima.");
    return null;
  }
}
async function renderLembretes() {
  const v = $("#view-lembretes");
  const list = el("div", { class: "stack" });
  const upcoming = el("div", { class: "stack" });
  const drawUpcoming = async () => {
    if (!remindersSupported) return;
    const dates = await upcomingReminders();
    put(upcoming, dates.length
      ? el("div", { class: "note ok stack" }, el("strong", {}, `✅ ${dates.length} lembretes agendados no celular`),
        el("ul", { class: "when-list" }, ...dates.slice(0, 4).map((d) => el("li", {}, fmtWhen(d)))),
        el("span", { class: "small" }, "Os próximos são renovados sozinhos sempre que você abre o app."))
      : el("p", { class: "note warn" }, "Nenhum lembrete agendado ainda. Escolha os horários e toque em \"Salvar lembretes\"."));
  };
  const drawList = () => {
    put(list, ...S.reminders.map((r) => {
      const time = el("input", { type: "time", value: r.time, "aria-label": "Horário", class: "time" });
      time.addEventListener("change", () => { r.time = time.value; saveSettings(); });
      const sw = el("button", { class: "switch", type: "button", role: "switch", "aria-checked": String(r.on), "aria-label": "Lembrete ligado" }, el("i"));
      sw.addEventListener("click", () => { r.on = !r.on; sw.setAttribute("aria-checked", String(r.on)); saveSettings(); });
      const del = el("button", { class: "btn small ghost", type: "button" }, "Excluir");
      del.addEventListener("click", () => { S.reminders = S.reminders.filter((x) => x !== r); saveSettings(); drawList(); });
      return el("div", { class: "card flat reminder" },
        el("div", { class: "row spread" }, time, el("div", { class: "row" }, sw, del)),
        el("div", { class: "days", role: "group", "aria-label": "Dias da semana" }, ...WEEKDAYS.map((d, i) => {
          const b = el("button", { type: "button", class: "day", "aria-pressed": String(r.days.includes(i)), "aria-label": WEEKDAY_NAMES[i] }, d);
          b.addEventListener("click", () => { r.days = r.days.includes(i) ? r.days.filter((x) => x !== i) : [...r.days, i].sort(); b.setAttribute("aria-pressed", String(r.days.includes(i))); saveSettings(); });
          return b;
        })));
    }));
    if (!S.reminders.length) list.append(el("p", { class: "empty" }, "Nenhum lembrete. Adicione um horário para estudar."));
  };
  drawList();

  // Passo a passo das permissões
  const steps = el("div", { class: "stack" });
  const drawSteps = async () => {
    if (!remindersSupported) {
      put(steps, el("p", { class: "note warn" }, "As notificações funcionam no app Inglesei para Android. Aqui você já pode escolher a voz e ouvir as frases."));
      return;
    }
    const st = await notificationStatus();
    const step = (n, done, title, text, btn) => el("div", { class: "step" + (done ? " done" : "") },
      el("span", { class: "step-n" }, done ? "✓" : String(n)),
      el("div", { class: "stack small-gap" }, el("strong", {}, title), el("span", { class: "muted small" }, text), done ? null : btn));
    put(steps,
      step(1, st.display === "granted", "Permitir notificações", "Sem isso o Android bloqueia os lembretes.",
        el("button", { class: "btn primary small", type: "button", onclick: async () => { await requestNotificationPermission(); await drawSteps(); await applyReminders(); drawUpcoming(); } }, icon("bell"), "Permitir")),
      step(2, st.exact === "granted", "Alarmes e lembretes (horário exato)", "Opcional: sem isso o lembrete pode chegar alguns minutos depois.",
        el("button", { class: "btn small", type: "button", onclick: async () => { await openExactAlarmSettings(); await drawSteps(); await applyReminders(true); drawUpcoming(); } }, "Abrir configuração")),
      el("details", { class: "step-help" }, el("summary", {}, "Os lembretes não chegam? Veja a bateria"),
        el("p", { class: "small" }, "Em celulares Samsung, Xiaomi, Motorola e outros, a economia de bateria pode bloquear apps fechados. Abra Configurações → Apps → Inglesei → Bateria e escolha \"Sem restrições\". Depois volte aqui e toque em Salvar lembretes.")));
  };
  drawSteps(); drawUpcoming();

  // Voz da notificação (frase falada em inglês)
  const voices = hasPack() ? packVoices() : PACK_VOICES;
  const voiceCards = el("div", { class: "voice-grid" }, ...voices.map((vc) => {
    const b = el("button", { type: "button", class: "voice-card", "aria-pressed": String(S.packVoice === vc.id) },
      el("span", { class: "voice-emoji" }, vc.gender === "f" ? "👩" : "👨"), el("b", {}, vc.name), el("span", { class: "muted small" }, vc.gender === "f" ? "mulher" : "homem"));
    b.addEventListener("click", () => {
      S.packVoice = vc.id; saveSettings();
      $$(".voice-card", voiceCards).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (hasPack()) playClip(reminderClipUrl(vc.id, Math.floor(Math.random() * REMINDER_LINES.length)));
    });
    return b;
  }));
  const speakOpen = el("input", { type: "checkbox", id: "speak-open", checked: S.speakOnOpen });
  speakOpen.addEventListener("change", () => { S.speakOnOpen = speakOpen.checked; saveSettings(); });

  put(v,
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Constância é tudo"), el("h1", {}, "Lembretes de estudo"),
      el("p", { class: "muted" }, "Na hora marcada, o celular toca uma voz falando em inglês que é hora de estudar, e mostra a frase com a tradução.")),
    steps,
    upcoming,
    el("section", { class: "stack" }, el("h2", {}, "Horários"), list,
      el("div", { class: "row" },
        el("button", { class: "btn", type: "button", onclick: () => { S.reminders.push({ id: Date.now(), time: "08:00", days: [0, 1, 2, 3, 4, 5, 6], on: true }); saveSettings(); drawList(); } }, "+ Adicionar horário"),
        el("button", { class: "btn primary", type: "button", onclick: async () => {
          if (remindersSupported) { if ((await notificationStatus()).display !== "granted") await requestNotificationPermission(); await drawSteps(); }
          await applyReminders(); drawUpcoming();
        } }, icon("bell"), "Salvar lembretes"))),
    el("section", { class: "card stack" }, el("h2", {}, "Voz do lembrete"),
      el("p", { class: "muted small" }, hasPack() ? "Toque para ouvir. A voz escolhida fala a frase em inglês quando o lembrete chegar." : "As vozes naturais vêm no app Android. Escolha a sua e ouça lá."),
      voiceCards,
      el("label", { class: "row" }, speakOpen, "Falar a frase de novo quando eu abrir o app pelo lembrete"),
      remindersSupported ? el("button", { class: "btn dark", type: "button", style: "justify-self:start", onclick: async () => {
        if ((await notificationStatus()).display !== "granted") await requestNotificationPermission();
        const n = Math.floor(Math.random() * REMINDER_LINES.length);
        if (await testReminder(REMINDER_LINES[n], n, reminderVoice())) toast("Lembrete de teste em 8 segundos. Bloqueie a tela para ver e ouvir.");
      } }, icon("bell"), "Testar lembrete agora") : null),
    el("section", { class: "card stack" }, el("h2", {}, "Frases dos lembretes"),
      el("ul", { class: "phrases" }, ...REMINDER_LINES.map(([en, pt], n) => el("li", {}, el("div", { class: "row", style: "flex-wrap:nowrap" },
        el("button", { class: "icon-btn", type: "button", "aria-label": "Ouvir", onclick: () => (reminderVoice() ? playClip(reminderClipUrl(reminderVoice(), n)) : say(en)) }, icon("speaker")),
        el("div", {}, el("b", {}, en), el("div", { class: "muted small" }, pt))))))),
  );
}
let pendingMotivation = null;
function renderMotivacao() {
  const v = $("#view-motivacao");
  const [en, pt] = pendingMotivation || MOTIVATION[dayNum() % MOTIVATION.length];
  const face = talkingFace(170, "motiv-face");
  currentCleanup = face._off;
  const nl = nextLesson();
  put(v, el("section", { class: "motiv" }, face,
    el("p", { class: "motiv-en" }, en), el("p", { class: "motiv-pt" }, pt),
    el("div", { class: "row center" },
      canSpeak() ? el("button", { class: "btn", type: "button", onclick: () => say(en) }, icon("speaker"), "Ouvir de novo") : null,
      el("a", { class: "btn primary", href: "#licao-" + nl.id }, "Bora estudar", icon("arrowR")),
      el("a", { class: "btn", href: "#chamada" }, icon("chat"), "Chamada com IA"))));
  if (pendingMotivation && S.speakOnOpen) setTimeout(() => say(en), 400);
  pendingMotivation = null;
}

// ---------- Ajustes ----------
const PALETTES = [
  ["vibrante", "Vibrante", "linear-gradient(135deg,#6c4cf5,#b245e8,#ff4f7b)"],
  ["oceano", "Oceano", "linear-gradient(135deg,#1f6feb,#00b4a6)"],
  ["por-do-sol", "Pôr do sol", "linear-gradient(135deg,#ff8a2b,#f2601f,#d6246e)"],
  ["floresta", "Floresta", "linear-gradient(135deg,#15803d,#65a30d)"],
  ["classico", "Clássico", "linear-gradient(135deg,#141b2d,#d6402b)"],
];
function appearanceCard() {
  const themes = el("div", { class: "themes", role: "group", "aria-label": "Cores do app" }, ...PALETTES.map(([id, label, grad]) => {
    const b = el("button", { type: "button", class: "theme-swatch", "aria-pressed": String(S.palette === id) }, el("i", { style: `background:${grad}` }), label);
    b.addEventListener("click", () => { S.palette = id; saveSettings(); $$(".theme-swatch", themes).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); });
    return b;
  }));
  const mode = el("div", { class: "seg", role: "group", "aria-label": "Modo claro ou escuro" }, ...[["auto", "Automático"], ["light", "Claro"], ["dark", "Escuro"]].map(([k, l]) => {
    const b = el("button", { type: "button", "aria-pressed": String((S.themeMode || "auto") === k) }, l);
    b.addEventListener("click", () => { S.themeMode = k; saveSettings(); $$("button", mode).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); });
    return b;
  }));
  return el("section", { class: "card stack" }, el("h2", {}, "Aparência"),
    el("p", { class: "muted small" }, "Escolha as cores do app."), themes, mode,
    el("div", { class: "row" }, el("a", { class: "btn", href: "#professores" }, icon("user"), "Professores"), el("a", { class: "btn", href: "#vozes" }, icon("speaker"), "Vozes")));
}
function renderAjustes() {
  const v = $("#view-ajustes");
  const result = el("div");
  const prov = el("div", { class: "seg", role: "group", "aria-label": "Provedor de IA" },
    ...[["claude", "Claude (Anthropic)"], ["gemini", "Gemini (Google)"]].map(([k, l]) =>
      el("button", { type: "button", "aria-pressed": String(S.provider === k), onclick: () => { S.provider = k; saveSettings(); renderAjustes(); } }, l)));
  const keyInput = el("input", { type: "password", id: "ai-key", autocomplete: "off", spellcheck: "false", placeholder: S.provider === "claude" ? "sk-ant-..." : "AIza...", value: S.provider === "claude" ? S.claudeKey : S.geminiKey, "aria-label": "Chave de API" });
  const show = el("button", { class: "btn small ghost", type: "button", onclick: () => { keyInput.type = keyInput.type === "password" ? "text" : "password"; } }, "Mostrar");
  let modelField;
  if (S.provider === "claude") {
    modelField = el("select", { id: "ai-model", "aria-label": "Modelo" }, ...CLAUDE_MODELS.map((m) => el("option", { value: m.id, selected: m.id === S.claudeModel }, m.label)));
  } else {
    modelField = el("input", { type: "text", id: "ai-model", value: S.geminiModel, spellcheck: "false", "aria-label": "Modelo do Gemini" });
  }
  const saveKey = () => {
    if (S.provider === "claude") { S.claudeKey = keyInput.value.trim(); S.claudeModel = modelField.value; }
    else { S.geminiKey = keyInput.value.trim(); S.geminiModel = modelField.value.trim() || GEMINI_DEFAULT_MODEL; }
    S.onboarded = true;
    saveSettings();
    delete $("#view-conversa").dataset.built;
  };
  const howTo = S.provider === "claude"
    ? el("ol", { class: "howto" },
      el("li", {}, "Acesse ", el("b", {}, "console.anthropic.com"), " e crie uma conta."),
      el("li", {}, "Em ", el("b", {}, "Billing"), ", adicione créditos (a partir de US$ 5). Você paga só o que usar."),
      el("li", {}, "Em ", el("b", {}, "API Keys"), ", toque em ", el("b", {}, "Create Key"), " e copie a chave (começa com sk-ant-)."),
      el("li", {}, "Cole aqui e toque em ", el("b", {}, "Salvar e testar"), "."))
    : el("ol", { class: "howto" },
      el("li", {}, "Acesse ", el("b", {}, "aistudio.google.com"), " com sua conta Google."),
      el("li", {}, "Toque em ", el("b", {}, "Get API key"), " e depois em ", el("b", {}, "Create API key"), "."),
      el("li", {}, "Copie a chave (começa com AIza) e cole aqui."),
      el("li", {}, "A faixa gratuita tem limite de uso por minuto e por dia."));
  // Backup do progresso
  const backup = el("textarea", { id: "backup", rows: "3", placeholder: "Cole aqui um backup para restaurar", "aria-label": "Backup" });
  put(v, 
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Configurações"), el("h1", {}, "Ajustes")),
    el("section", { class: "card stack" },
      el("h2", {}, "Inteligência artificial"),
      el("p", { class: "muted" }, "A IA conversa com você, corrige suas frases, cria aulas e exercícios. Escolha o provedor e cole sua chave de API. Ela fica salva só neste aparelho e vai direto para a empresa da IA."),
      prov,
      S.provider === "claude"
        ? el("p", { class: "note" }, "Claude: melhor qualidade de correção e conversa. É pago por uso: uma conversa de prática custa centavos. O Haiku 5.5 é bem mais barato que o Opus 5.5.")
        : el("p", { class: "note ok" }, "Gemini: tem faixa gratuita, ótima para começar. Se o modelo padrão deixar de existir, troque o nome no campo Modelo."),
      el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Chave de API"), el("div", { class: "fill-row" }, keyInput, show)),
      el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Modelo"), modelField),
      el("div", { class: "row" },
        el("button", { class: "btn primary", type: "button", onclick: async () => {
          saveKey();
          if (!aiReady()) { put(result, el("p", { class: "note warn" }, "Cole a chave antes de testar.")); return; }
          put(result, el("span", { class: "thinking" }, "Testando conexão..."));
          try { await testAI(); put(result, el("p", { class: "note ok" }, `Tudo certo! A IA (${aiName()}) está funcionando.`)); }
          catch (e) { put(result, el("p", { class: "note warn" }, aiErrorText(e))); }
        } }, "Salvar e testar"),
        el("button", { class: "btn ghost", type: "button", onclick: () => { keyInput.value = ""; saveKey(); toast("Chave removida deste aparelho"); } }, "Remover chave")),
      result,
      el("details", {}, el("summary", {}, "Como conseguir a chave"), howTo)),
    appearanceCard(),
    el("section", { class: "card stack" },
      el("h2", {}, "Backup do progresso"),
      el("p", { class: "muted" }, "Seu progresso fica salvo neste aparelho. Copie o backup antes de trocar de celular ou reinstalar o app."),
      el("div", { class: "row" },
        el("button", { class: "btn", type: "button", onclick: async () => {
          const data = JSON.stringify(P);
          try { await navigator.clipboard.writeText(data); toast("Backup copiado. Guarde num lugar seguro."); }
          catch { backup.value = data; backup.select(); toast("Copie o texto selecionado."); }
        } }, "Copiar backup"),
        el("button", { class: "btn", type: "button", onclick: () => {
          try { const d = JSON.parse(backup.value); if (typeof d.xp !== "number") throw new Error(); P = normalizeP(d); save(); updateChrome(); toast("Progresso restaurado!"); }
          catch { toast("Backup inválido. Cole o texto completo."); }
        } }, "Restaurar")),
      backup),
    el("section", { class: "card stack" }, el("h2", {}, "Sobre"),
      el("p", {}, el("b", {}, "Inglesei"), ` · versão ${window.INGLESEI_VERSION || "1.0"} · ${LESSONS.length} lições, ${SLANG.length} gírias, ${PHRASAL.length} phrasal verbs, ${IDIOMS.length} idioms e ${SCENARIOS.length} situações de conversa.`),
      el("p", { class: "muted small" }, "Feito por Moacir de Jesus Nascimento com HTML, CSS e JavaScript.")),
  );
}

// ---------- Professores (avatares) ----------
function matchVoicesTo(a) {
  if (a.pack) S.packVoice = a.pack;
  if (S.aiVoiceProvider === "gemini") S.aiVoice = a.gemini;
  if (S.aiVoiceProvider === "openai") S.aiVoice = a.openai;
}
function renderProfessores() {
  const v = $("#view-professores");
  const grid = el("div", { class: "tutor-grid" });
  const draw = () => {
    put(grid, ...AVATARS.map((a) => {
      const card = el("button", { type: "button", class: "tutor-card", "aria-pressed": String(S.avatar === a.id) },
        el("div", { class: "tutor-card-face", html: avatarSVG(a, 112) }),
        el("b", {}, a.name), el("span", { class: "muted small" }, `${a.g === "f" ? "Professora" : "Professor"} · ${a.from}`));
      card.addEventListener("click", () => {
        S.avatar = a.id; matchVoicesTo(a); saveSettings(); draw();
        const face = $(".tutor-card-face", card);
        face.classList.add("talking");
        say(MOTIVATION[9][0]).finally(() => face.classList.remove("talking"));
      });
      return card;
    }));
  };
  draw();
  // Foto própria
  const nameIn = el("input", { type: "text", id: "photo-name", value: S.photoName || "", placeholder: "Nome do professor(a)", "aria-label": "Nome" });
  const genderSel = el("select", { id: "photo-gender", "aria-label": "Voz" }, el("option", { value: "f", selected: S.photoGender !== "m" }, "Voz de mulher"), el("option", { value: "m", selected: S.photoGender === "m" }, "Voz de homem"));
  const preview = el("div", { class: "photo-preview", html: S.photo ? photoAvatarHTML(S.photo, 96, S.photoName) : "" });
  const file = el("input", { type: "file", accept: "image/*", id: "photo-file", "aria-label": "Escolher foto" });
  file.addEventListener("change", () => {
    const f = file.files && file.files[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const side = Math.min(img.width, img.height);
      c.width = c.height = 320;
      c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 3, side, side, 0, 0, 320, 320);
      S.photo = c.toDataURL("image/jpeg", 0.85);
      URL.revokeObjectURL(img.src);
      preview.innerHTML = photoAvatarHTML(S.photo, 96, nameIn.value);
      toast("Foto carregada. Toque em Usar esta foto.");
    };
    img.src = URL.createObjectURL(f);
  });
  const usePhoto = el("button", { class: "btn primary", type: "button" }, "Usar esta foto");
  usePhoto.addEventListener("click", () => {
    if (!S.photo) { toast("Escolha uma foto primeiro."); return; }
    S.photoName = nameIn.value.trim() || "Teacher";
    S.photoGender = genderSel.value;
    S.avatar = "foto";
    const base = AVATARS.find((a) => a.g === S.photoGender);
    matchVoicesTo(base);
    saveSettings(); draw();
    toast(`${S.photoName} agora é seu professor(a)!`);
  });
  put(v,
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Quem vai te ensinar"), el("h1", {}, "Escolha seu professor(a)"),
      el("p", { class: "muted" }, "Cada professor tem uma voz natural combinando. Ele aparece nas vídeo-aulas, na conversa e na chamada de vídeo. Toque para ouvir.")),
    grid,
    el("section", { class: "card stack" },
      el("h2", {}, "Usar uma foto"),
      el("p", { class: "muted small" }, "Quer um rosto fotográfico? Escolha uma foto (pode ser uma imagem criada por IA) e ela vira seu professor. A foto fica salva só neste celular."),
      el("div", { class: "photo-row" }, preview, el("div", { class: "stack" }, file, nameIn, genderSel, usePhoto))),
  );
}

// ---------- Vozes ----------
const GENDER = { f: "mulher", m: "homem", n: "neutra" };
function renderVozes() {
  const v = $("#view-vozes");
  const status = el("div");
  // 1. Vozes naturais embutidas
  const packList = hasPack() ? packVoices() : PACK_VOICES;
  const packGrid = el("div", { class: "voice-grid" }, ...packList.map((vc) => {
    const b = el("button", { type: "button", class: "voice-card", "aria-pressed": String(S.packVoice === vc.id) },
      el("span", { class: "voice-emoji" }, vc.gender === "f" ? "👩" : "👨"), el("b", {}, vc.name), el("span", { class: "muted small" }, GENDER[vc.gender]));
    b.addEventListener("click", () => {
      S.packVoice = vc.id; saveSettings();
      $$(".voice-card", packGrid).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      say(pick(MOTIVATION)[0]);
    });
    return b;
  }));
  // 2. Voz com IA
  const prov = S.aiVoiceProvider;
  const provSeg = el("div", { class: "seg", role: "group", "aria-label": "Voz com IA" },
    ...[["off", "Desligada"], ["gemini", "Gemini"], ["openai", "OpenAI"]].map(([k, l]) =>
      el("button", { type: "button", "aria-pressed": String(prov === k), onclick: () => {
        S.aiVoiceProvider = k;
        if (k !== "off" && !AI_VOICES[k].some((x) => x.id === S.aiVoice)) matchVoicesTo(tutor().photo ? AVATARS.find((a) => a.g === tutor().g) : tutor());
        saveSettings(); renderVozes();
      } }, l)));
  let aiBox = null;
  if (prov !== "off") {
    const list = AI_VOICES[prov];
    const grid = el("div", { class: "voice-grid" }, ...list.map((vc) => {
      const b = el("button", { type: "button", class: "voice-card", "aria-pressed": String(S.aiVoice === vc.id) },
        el("span", { class: "voice-emoji" }, vc.g === "f" ? "👩" : vc.g === "m" ? "👨" : "🧑"), el("b", {}, vc.label), el("span", { class: "muted small" }, `${GENDER[vc.g]} · ${vc.vibe}`));
      b.addEventListener("click", async () => {
        S.aiVoice = vc.id; saveSettings();
        $$(".voice-card", grid).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        await testAIVoice();
      });
      return b;
    }));
    const keyField = prov === "openai"
      ? el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Chave da OpenAI"),
        (() => { const i = el("input", { type: "password", id: "openai-key", value: S.openaiKey, placeholder: "sk-...", autocomplete: "off", spellcheck: "false", "aria-label": "Chave da OpenAI" });
          i.addEventListener("change", () => { S.openaiKey = i.value.trim(); saveSettings(); }); return i; })())
      : (aiSpeechReady("gemini") ? el("p", { class: "note ok small" }, "Usa a mesma chave do Gemini que você colocou em Ajustes.")
        : el("p", { class: "note warn small" }, "Cole sua chave do Gemini em Ajustes (é grátis) para usar estas vozes."));
    const modelIn = el("input", { type: "text", id: "tts-model", spellcheck: "false", value: prov === "gemini" ? S.geminiTtsModel || GEMINI_TTS_DEFAULT : S.openaiTtsModel || OPENAI_TTS_DEFAULT, "aria-label": "Modelo de voz" });
    modelIn.addEventListener("change", () => { if (prov === "gemini") S.geminiTtsModel = modelIn.value.trim(); else S.openaiTtsModel = modelIn.value.trim(); saveSettings(); });
    aiBox = el("div", { class: "stack" }, keyField, grid,
      el("details", {}, el("summary", {}, "Modelo de voz (avançado)"), el("div", { class: "stack", style: "margin-top:8px" }, modelIn,
        el("p", { class: "muted small" }, prov === "gemini" ? "Se o Google trocar o nome do modelo de voz, atualize aqui." : "Precisa de créditos na sua conta da OpenAI (platform.openai.com)."))),
      status);
  }
  async function testAIVoice() {
    put(status, el("span", { class: "thinking" }, "Gerando a voz..."));
    try {
      const blob = await aiSpeech("Hey there! This is how I sound. Nice to meet you!", { provider: S.aiVoiceProvider, voice: S.aiVoice });
      put(status, el("p", { class: "note ok small" }, "Voz funcionando! Ela será usada nas conversas, na chamada e nas aulas sob medida."));
      const url = URL.createObjectURL(blob);
      await playClip(url);
      URL.revokeObjectURL(url);
    } catch (e) { put(status, el("p", { class: "note warn small" }, aiErrorText(e))); }
  }
  // 3. Ritmo e voz do celular
  const range = (id, label, key, min, max, step, fmt) => {
    const out = el("span", { class: "mono" }, fmt(S[key]));
    const r = el("input", { type: "range", id, min, max, step, value: S[key], "aria-label": label });
    r.addEventListener("input", () => { S[key] = Number(r.value); out.textContent = fmt(S[key]); });
    r.addEventListener("change", () => { saveSettings(); say(MOTIVATION[1][0]); });
    return el("label", { class: "stack small-gap" }, el("span", { class: "row spread" }, el("span", {}, label), out), r);
  };
  const devSel = el("select", { id: "device-voice", "aria-label": "Voz do celular" }, el("option", { value: "" }, "Padrão do celular"));
  listEnglishVoices().then((voices) => {
    voices.forEach((vc) => devSel.append(el("option", { value: String(vc.index), selected: S.deviceVoice && S.deviceVoice.index === vc.index }, `${vc.name} (${vc.lang})`)));
    devSel._voices = voices;
  });
  devSel.addEventListener("change", () => {
    const vc = (devSel._voices || []).find((x) => String(x.index) === devSel.value);
    S.deviceVoice = vc ? { index: vc.index, voiceURI: vc.voiceURI, name: vc.name } : null;
    saveSettings();
  });
  put(v,
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Áudio"), el("h1", {}, "Vozes"),
      el("p", { class: "muted" }, "Escolha vozes de homem ou de mulher, que falam como uma pessoa de verdade e no ritmo normal de conversa.")),
    el("section", { class: "card stack" }, el("h2", {}, "Voz natural das frases do app"),
      el("p", { class: "muted small" }, hasPack() ? "Grátis e funciona sem internet: exemplos, gírias, expressões e lembretes. Toque para ouvir." : "Grátis e funciona sem internet no app Android. Aqui (versão web) é usada a voz do navegador."),
      packGrid),
    el("section", { class: "card stack" }, el("h2", {}, "Voz natural com IA"),
      el("p", { class: "muted small" }, "Para o que muda a cada vez: respostas da conversa, chamada de vídeo e aulas sob medida. A Gemini tem faixa gratuita (com limite por dia); a OpenAI é paga por uso. Os áudios ficam guardados no celular para não gastar de novo."),
      provSeg, aiBox),
    el("section", { class: "card stack" }, el("h2", {}, "Ritmo"),
      range("rate", "Velocidade da fala", "rate", 0.8, 1.5, 0.05, (x) => `${x.toFixed(2)}x`),
      range("pitch", "Tom (voz do celular)", "pitch", 0.8, 1.3, 0.05, (x) => x.toFixed(2)),
      el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Voz do celular (reserva)"), devSel),
      el("button", { class: "btn ghost small", type: "button", style: "justify-self:start", onclick: async () => { await clearVoiceCache(); toast("Áudios guardados apagados."); } }, "Apagar áudios guardados da IA")),
  );
}

// ---------- Chamada de vídeo com IA ----------
const call = { scen: SCENARIOS.find((s) => s.id === "free"), level: "mid", captions: true, translate: false, camera: false, active: null };
function callSystem() {
  return `You are on a live video call helping a Brazilian learner practice SPOKEN American English. You are ${tutor().name}, ${tutor().g === "f" ? "a woman" : "a man"} from the U.S.
Role-play: ${call.scen.role}.
Learner level: ${CONV_LEVELS[call.level].txt}.
Rules:
- This is spoken conversation: reply with 1 or 2 short, natural sentences, the way people really talk, and usually end with a question.
- Never use emojis, lists or symbols, because your reply will be read aloud.
- The learner speaks through voice recognition, so ignore punctuation and small recognition errors.
- Before your reply, give a very short correction in Brazilian Portuguese of the learner's LAST sentence (one line), or "Perfeito!" if it was fine.
Output format, exactly:
FEEDBACK: <one line in Portuguese>
===
<your spoken reply in English>`;
}
function renderChamada() {
  const v = $("#view-chamada");
  if (call.active) return; // a chamada fica em tela cheia
  if (!aiReady()) {
    put(v, el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Conversação ao vivo"), el("h1", {}, "Chamada de vídeo com IA")), aiGate());
    return;
  }
  const scenSel = el("select", { id: "call-scen", "aria-label": "Situação" }, ...SCENARIO_GROUPS.map((g, gi) =>
    el("optgroup", { label: g }, ...SCENARIOS.filter((s) => s.group === gi).map((s) => el("option", { value: s.id, selected: s.id === call.scen.id }, s.title)))));
  scenSel.addEventListener("change", () => { call.scen = SCENARIOS.find((s) => s.id === scenSel.value); });
  const levelSel = el("select", { id: "call-level", "aria-label": "Seu nível" }, ...Object.entries(CONV_LEVELS).map(([k, o]) => el("option", { value: k, selected: k === call.level }, o.label)));
  levelSel.addEventListener("change", () => { call.level = levelSel.value; });
  const toggle = (key, label) => {
    const b = el("button", { class: "chip", type: "button", "aria-pressed": String(call[key]) }, label);
    b.addEventListener("click", () => { call[key] = !call[key]; b.setAttribute("aria-pressed", String(call[key])); });
    return b;
  };
  const t = tutor();
  put(v,
    el("header", { class: "hello" }, el("span", { class: "eyebrow" }, "Conversação ao vivo"), el("h1", {}, "Chamada de vídeo com IA"),
      el("p", { class: "muted" }, `Fale em voz alta com ${tutorRef(t)}, como numa chamada de verdade. O app escuta você, ${t.g === "f" ? "ela" : "ele"} responde falando, e as correções aparecem na tela.`)),
    el("section", { class: "card call-setup" },
      el("div", { class: "call-setup-face", html: faceHTML(132) }),
      el("div", { class: "stack" },
        el("div", { class: "row spread" }, el("h2", {}, tutorTitle(t)), el("a", { class: "chip", href: "#professores" }, "Trocar")),
        el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Situação"), scenSel),
        el("label", { class: "stack small-gap" }, el("span", { class: "eyebrow" }, "Seu nível"), levelSel),
        el("div", { class: "row" }, toggle("captions", "Legenda"), toggle("translate", "Tradução"), toggle("camera", "Minha câmera")),
        usingAIVoice() ? null : el("p", { class: "note small" }, "Dica: ative a ", el("a", { href: "#vozes" }, "voz natural com IA"), " para a voz da chamada ficar mais humana."),
        el("button", { class: "btn primary big", type: "button", onclick: startCall }, "📞 Iniciar chamada"))),
    call.last ? callSummary(call.last) : null,
  );
}
function callSummary(r) {
  const min = Math.max(1, Math.round(r.seconds / 60));
  return el("section", { class: "card stack" },
    el("h2", {}, "Resumo da última chamada"),
    el("p", {}, `${min} min · você falou ${r.turns} ${r.turns === 1 ? "vez" : "vezes"} · +${r.xp} XP`),
    r.fixes.length ? el("div", { class: "stack" }, el("strong", {}, "Correções para revisar"), el("ul", { class: "fix-list" }, ...r.fixes.map((f) => el("li", {}, el("div", { class: "muted small" }, `Você: "${f.said}"`), el("div", {}, f.fb))))) : el("p", { class: "note ok" }, "Nenhuma correção. Mandou muito bem!"));
}
async function startCall() {
  const t = tutor();
  const st = { turns: [{ role: "assistant", content: call.scen.opener }], said: 0, fixes: [], started: Date.now(), ended: false, rec: null, auto: true, stream: null, ctl: null };
  call.active = st;
  const face = talkingFace(Math.min(240, Math.round(window.innerWidth * 0.55)), "call-face");
  const timer = el("span", { class: "call-timer mono" }, "00:00");
  const stateEl = el("span", { class: "call-state" }, "Conectando...");
  const aiCap = el("p", { class: "call-cap-ai", hidden: !call.captions });
  const ptCap = el("p", { class: "call-cap-pt", hidden: true });
  const meCap = el("p", { class: "call-cap-me" });
  const fbCap = el("p", { class: "call-fb", hidden: true });
  const video = el("video", { class: "call-self", autoplay: true, muted: true, playsinline: true, hidden: true });
  const typed = el("input", { type: "text", class: "call-type", placeholder: "Sem microfone? Escreva aqui e aperte Enter", hidden: true, "aria-label": "Sua fala" });
  const micBtn = el("button", { class: "call-btn", type: "button", "aria-label": "Falar" }, icon("mic"));
  const capBtn = el("button", { class: "call-btn", type: "button", "aria-label": "Legenda", "aria-pressed": String(call.captions) }, "CC");
  const camBtn = el("button", { class: "call-btn", type: "button", "aria-label": "Câmera", "aria-pressed": String(call.camera) }, icon("video"));
  const endBtn = el("button", { class: "call-btn end", type: "button", "aria-label": "Encerrar chamada" }, "✕");
  const overlay = el("div", { class: "call", role: "dialog", "aria-label": `Chamada com ${t.name}` },
    el("div", { class: "call-top" }, el("div", {}, el("b", {}, t.name), el("div", { class: "small" }, call.scen.title)), timer),
    el("div", { class: "call-stage" }, face, stateEl),
    el("div", { class: "call-caps" }, aiCap, ptCap, meCap, fbCap, typed),
    video,
    el("div", { class: "call-controls" }, micBtn, capBtn, camBtn, endBtn));
  document.body.append(overlay);
  document.body.classList.add("in-call");
  const tick = setInterval(() => { const s = Math.floor((Date.now() - st.started) / 1000); timer.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }, 1000);
  const setState = (txt, cls) => { stateEl.textContent = txt; stateEl.className = "call-state " + (cls || ""); };
  const showAI = async (text) => {
    aiCap.textContent = text; ptCap.hidden = true;
    if (call.translate) {
      ptCap.hidden = false; ptCap.textContent = "...";
      aiText({ system: "Traduza do inglês para o português do Brasil, de forma natural. Responda só com a tradução.", messages: [{ role: "user", content: text }], effort: "low", maxTokens: 600 })
        .then((tr) => { if (aiCap.textContent === text) ptCap.textContent = tr.trim(); }).catch(() => { ptCap.hidden = true; });
    }
  };
  async function aiSay(text) {
    await showAI(text);
    setState("Falando...", "speaking");
    await speak(text);
    if (!st.ended && st.auto) listenTurn();
    else if (!st.ended) setState("Toque no microfone para responder");
  }
  async function listenTurn() {
    if (st.ended || st.rec) return;
    if (!(await canListen())) { typed.hidden = false; setState("Escreva sua resposta"); return; }
    setState("Ouvindo... fale agora", "listening");
    micBtn.classList.add("on");
    meCap.textContent = "";
    st.rec = await listen({
      onPartial: (p) => { meCap.textContent = p; },
      onEnd: (said, err) => {
        st.rec = null; micBtn.classList.remove("on");
        if (st.ended) return;
        if (err === "not_granted") { typed.hidden = false; setState("Permita o microfone ou escreva sua resposta"); return; }
        if (!said.trim()) { st.auto = false; setState("Não ouvi nada. Toque no microfone para falar"); return; }
        st.auto = true;
        reply(said.trim());
      },
    });
  }
  async function reply(said) {
    meCap.textContent = said;
    st.turns.push({ role: "user", content: said });
    st.said++;
    setState("Pensando...", "thinking");
    const ctl = new AbortController(); st.ctl = ctl;
    try {
      const full = await aiText({ system: callSystem(), messages: [{ role: "user", content: "(The call starts.)" }, ...st.turns.slice(-20)], effort: "low", maxTokens: 800, signal: ctl.signal });
      if (st.ended) return;
      const p = parseReply(full);
      if (p.fb && p.fb !== "-") {
        fbCap.hidden = false; fbCap.textContent = p.fb;
        fbCap.classList.toggle("perfect", /^perfeito!?$/i.test(p.fb));
        if (!/^perfeito!?$/i.test(p.fb)) st.fixes.push({ said, fb: p.fb });
      }
      const text = p.reply || "Sorry, could you say that again?";
      st.turns.push({ role: "assistant", content: text });
      aiSay(text);
    } catch (e) {
      if (st.ended || e.code === "cancelled") return;
      st.turns.pop();
      setState(aiErrorText(e));
      st.auto = false;
    }
  }
  micBtn.addEventListener("click", async () => {
    if (st.rec) { st.rec.stop(); return; }
    await stopSpeaking();
    st.auto = true;
    listenTurn();
  });
  typed.addEventListener("keydown", (e) => { if (e.key === "Enter" && typed.value.trim()) { const t2 = typed.value.trim(); typed.value = ""; reply(t2); } });
  capBtn.addEventListener("click", () => { call.captions = !call.captions; capBtn.setAttribute("aria-pressed", String(call.captions)); aiCap.hidden = !call.captions; });
  const startCam = async () => {
    st.stream = await openCamera();
    if (st.stream) { video.srcObject = st.stream; video.hidden = false; } else { call.camera = false; camBtn.setAttribute("aria-pressed", "false"); toast("Não foi possível abrir a câmera."); }
  };
  const stopCam = () => { if (st.stream) st.stream.getTracks().forEach((tr) => tr.stop()); st.stream = null; video.hidden = true; };
  camBtn.addEventListener("click", () => { call.camera = !call.camera; camBtn.setAttribute("aria-pressed", String(call.camera)); if (call.camera) startCam(); else stopCam(); });
  endBtn.addEventListener("click", endCall);
  function endCall() {
    st.ended = true;
    if (st.rec) st.rec.stop();
    if (st.ctl) st.ctl.abort();
    stopSpeaking(); stopCam(); clearInterval(tick); face._off();
    overlay.remove();
    document.body.classList.remove("in-call");
    const seconds = Math.round((Date.now() - st.started) / 1000);
    const xp = st.said ? 10 + st.said * 3 : 0;
    if (xp) addXP(xp);
    P.stats.calls = (P.stats.calls || 0) + 1; save();
    call.last = { seconds, turns: st.said, fixes: st.fixes, xp };
    call.active = null;
    currentCleanup = null;
    renderChamada();
  }
  currentCleanup = () => { if (call.active) endCall(); };
  if (call.camera) startCam();
  setTimeout(() => aiSay(call.scen.opener), 500);
}

// ---------- Mais ----------
function renderMais() {
  put($("#view-mais"),
    el("header", { class: "hello" }, el("h1", {}, "Mais")),
    el("div", { class: "actions" },
      action("#treino", "target", "Treino", "Flashcards, ouvido, fala, redação e quiz"),
      action("#aulas", "play", "Vídeo-aulas", "Aulas narradas e aulas sob medida com IA"),
      action("#professores", "user", "Professores", "Escolha quem vai te ensinar (ou use uma foto)"),
      action("#vozes", "speaker", "Vozes", "Vozes naturais de homem e de mulher"),
      action("#expressoes", "book", "Gírias e expressões", `${SLANG.length + PHRASAL.length + IDIOMS.length} expressões com áudio`),
      action("#lembretes", "bell", "Lembretes", "Horários e voz em inglês na notificação"),
      action("#ajustes", "gear", "Ajustes", "IA, cores do app e backup do progresso")));
}

// ---------- Inicialização ----------
buildNav();
$("#stop-voice").addEventListener("click", () => stopSpeaking());
onSpeakingChange((on) => ($("#speaking-bar").hidden = !on || document.body.classList.contains("in-call")));
updateChrome();
onReminderOpened((extra) => {
  pendingMotivation = extra && extra.en ? [extra.en, extra.pt || ""] : null;
  if (location.hash === "#motivacao") route(); else location.hash = "#motivacao";
});
if (isNative) {
  CapApp.addListener("backButton", () => {
    if (call.active) { $(".call .end")?.click(); return; }
    const h = location.hash.slice(1) || "inicio";
    if (h === "inicio") CapApp.exitApp(); else history.back();
  });
}
route();
lastView = location.hash.slice(1) || "inicio";
// Vozes naturais embutidas: carrega o índice e renova os lembretes (com a voz escolhida).
loadPack().then(() => {
  applySettings();
  if (isNative) applyReminders(true);
  const h = location.hash.slice(1) || "inicio";
  if (["vozes", "lembretes"].includes(h)) route();
});
