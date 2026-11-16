// Testes E2E do Inglesei (versão web), com as APIs de IA simuladas.
// Rodar: npm run build && npm test
const { test, before, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "www");
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
let server, baseURL, browser, context, page, errors, claudeRequests, geminiRequests, claudeReply;

const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "POST, GET, OPTIONS" };
// ---- Respostas simuladas ----
function claudeSSE(text) {
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`;
  const half = Math.ceil(text.length / 2);
  return ev("message_start", { message: { id: "msg_test", type: "message", role: "assistant", model: "claude-opus-5-5", content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 1 } } })
    + ev("content_block_start", { index: 0, content_block: { type: "text", text: "" } })
    + ev("content_block_delta", { index: 0, delta: { type: "text_delta", text: text.slice(0, half) } })
    + ev("content_block_delta", { index: 0, delta: { type: "text_delta", text: text.slice(half) } })
    + ev("content_block_stop", { index: 0 })
    + ev("message_delta", { delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 20 } })
    + ev("message_stop", {});
}
function geminiSSE(text) {
  const half = Math.ceil(text.length / 2);
  return [text.slice(0, half), text.slice(half)].map((t) => `data: ${JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: t }] } }] })}\r\n\r\n`).join("");
}

before(async () => {
  server = http.createServer((req, res) => {
    const p = req.url.split("?")[0];
    const file = path.join(ROOT, p === "/" ? "index.html" : p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, r));
  baseURL = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch();
});
after(async () => { await browser.close(); server.close(); });

beforeEach(async () => {
  errors = []; claudeRequests = []; geminiRequests = [];
  claudeReply = () => "OK";
  context = await browser.newContext({ locale: "pt-BR", viewport: { width: 1200, height: 900 } });
  // Voz simulada: cada fala "termina" em 20 ms (o Chromium sem tela não tem vozes).
  await context.addInitScript(() => {
    window.__spoken = [];
    window.speechSynthesis.speak = (u) => { window.__spoken.push({ text: u.text, lang: u.lang }); setTimeout(() => u.onend && u.onend(), 20); };
    window.speechSynthesis.cancel = () => {};
  });
  page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://api.anthropic.com/**", async (route) => {
    const req = route.request();
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
    claudeRequests.push({ url: req.url(), headers: await req.allHeaders(), body: JSON.parse(req.postData() || "{}") });
    await route.fulfill({ status: 200, headers: { "content-type": "text/event-stream", ...CORS }, body: claudeSSE(claudeReply(JSON.parse(req.postData() || "{}"))) });
  });
  await page.route("https://generativelanguage.googleapis.com/**", async (route) => {
    const req = route.request();
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
    geminiRequests.push({ url: req.url(), headers: await req.allHeaders(), body: JSON.parse(req.postData() || "{}") });
    await route.fulfill({ status: 200, headers: { "content-type": "text/event-stream", ...CORS }, body: geminiSSE(claudeReply()) });
  });
});
afterEach(async () => {
  assert.deepEqual(errors, [], "sem erros de JavaScript");
  await context.close();
});

// Abre a tela recarregando a página (para o app ler as configurações salvas).
const go = async (hash) => { await page.goto(baseURL + "#" + hash); await page.reload(); await page.waitForTimeout(150); };
async function setClaudeKey(model = "claude-opus-5-5") {
  await page.evaluate((m) => localStorage.setItem("inglesei:settings", JSON.stringify({ provider: "claude", claudeKey: "sk-ant-test", claudeModel: m, onboarded: true })), model);
}

// ---------------- Testes ----------------
test("todas as telas abrem sem erro", async () => {
  await go("inicio");
  await page.evaluate(() => localStorage.setItem("inglesei:settings", JSON.stringify({ onboarded: true })));
  for (const v of ["inicio", "trilha", "licao-to-be", "aula-to-be", "aulas", "expressoes", "conversa", "treino", "lembretes", "ajustes", "mais", "motivacao"]) {
    await go(v);
    const visible = await page.evaluate(() => [...document.querySelectorAll(".view")].filter((x) => !x.hidden).map((x) => x.id));
    assert.deepEqual(visible, ["view-" + (v.startsWith("licao") ? "licao" : v.startsWith("aula-") ? "aula" : v)], v);
    const txt = await page.evaluate(() => document.querySelector(".view:not([hidden])").innerText);
    assert.ok(txt.length > 20, `${v} tem conteúdo`);
    assert.doesNotMatch(txt, /\b(null|undefined|NaN)\b/, `${v} não mostra null/undefined`);
  }
});

test("sem IA configurada, a conversa pede para configurar", async () => {
  await go("conversa");
  assert.match(await page.textContent("#view-conversa"), /Configure a IA/);
});

test("lição: responder os exercícios dá XP", async () => {
  await go("licao-to-be");
  for (const ex of await page.$$("#view-licao .ex")) {
    const opt = await ex.$(".opt"); if (opt) { await opt.click(); continue; }
    const inp = await ex.$("input"); if (inp) { await inp.fill("am"); await inp.press("Enter"); continue; }
    for (const w of await ex.$$(".order-pool .word")) await w.click();
    await (await ex.$("button.btn")).click();
  }
  assert.match(await page.textContent("#view-licao .score"), /Lição concluída/);
  assert.ok(Number(await page.textContent("#side-xp")) >= 10);
});

test("Claude: testar conexão manda a requisição certa", async () => {
  await go("ajustes");
  await page.fill("#ai-key", "sk-ant-minha-chave");
  await page.click("text=Salvar e testar");
  await page.waitForSelector("text=Tudo certo!");
  const r = claudeRequests[0];
  // O SDK oficial envia a chave como x-api-key ou Authorization: Bearer, conforme a versão.
  assert.ok(r.headers["x-api-key"] === "sk-ant-minha-chave" || r.headers["authorization"] === "Bearer sk-ant-minha-chave", "chave enviada");
  assert.equal(r.headers["anthropic-dangerous-direct-browser-access"], "true");
  assert.equal(r.body.model, "claude-opus-5-5");
  assert.equal(r.body.fallbacks, "default");
  assert.match(r.headers["anthropic-beta"], /server-side-fallback-2026-07-01/);
  assert.deepEqual(r.body.output_config, { effort: "low" });
  assert.equal(r.body.stream, true);
  assert.equal(r.body.thinking, undefined, "Opus 5.5 não aceita desligar o thinking");
});

test("Claude Haiku: sem parâmetro de fallback", async () => {
  await go("inicio"); await setClaudeKey("claude-haiku-5-5");
  await go("ajustes");
  await page.click("text=Salvar e testar");
  await page.waitForSelector("text=Tudo certo!");
  assert.equal(claudeRequests[0].body.model, "claude-haiku-5-5");
  assert.equal(claudeRequests[0].body.fallbacks, undefined);
});

test("conversa: correção em amarelo e resposta da IA", async () => {
  await go("inicio"); await setClaudeKey();
  claudeReply = () => "FEEDBACK: O certo é \"I am 25\".\n===\nNice! What do you do for fun?";
  await go("conversa");
  await page.fill("#conv-input", "I have 25 years");
  await page.click("#conv-send");
  await page.waitForSelector(".msg.me .feedback:not([hidden])");
  assert.match(await page.textContent(".msg.me .feedback"), /I am 25/);
  await page.waitForFunction(() => [...document.querySelectorAll(".msg.ai .bubble")].some((b) => b.textContent === "Nice! What do you do for fun?"));
  const body = claudeRequests[0].body;
  assert.equal(body.messages[0].role, "user", "conversa começa com mensagem do usuário");
  assert.equal(body.messages.at(-1).content, "I have 25 years");
  assert.match(body.system, /Your role/);
});

test("conversa: 30+ cenários disponíveis e troca de cenário", async () => {
  await go("inicio"); await setClaudeKey();
  await go("conversa");
  const n = await page.$$eval("#conv-scen option", (o) => o.length);
  assert.ok(n >= 30, `cenários: ${n}`);
  await page.selectOption("#conv-scen", "standup");
  assert.equal(await page.textContent("#chat-title"), "Daily (reunião de time)");
});

test("Gemini: conversa funciona com a chave gratuita", async () => {
  await go("inicio");
  await page.evaluate(() => localStorage.setItem("inglesei:settings", JSON.stringify({ provider: "gemini", geminiKey: "AIza-test", onboarded: true })));
  claudeReply = () => "FEEDBACK: Perfeito!\n===\nAwesome, see you there!";
  await go("conversa");
  await page.fill("#conv-input", "See you tomorrow");
  await page.click("#conv-send");
  await page.waitForFunction(() => [...document.querySelectorAll(".msg.ai .bubble")].some((b) => b.textContent === "Awesome, see you there!"));
  const r = geminiRequests[0];
  assert.equal(r.headers["x-goog-api-key"], "AIza-test");
  assert.match(r.url, /gemini-2\.5-flash:streamGenerateContent\?alt=sse/);
  assert.equal(r.body.contents[0].role, "user");
  assert.equal(r.body.contents[1].role, "model");
  assert.ok(await page.isVisible(".msg.me .feedback.perfect"));
});

test("vídeo-aula: a professora fala os slides até o fim", async () => {
  await go("aula-articles");
  const total = await page.$$eval(".tutor-dots i", (d) => d.length);
  assert.ok(total >= 5);
  await page.click("text=▶ Assistir");
  await page.waitForFunction(() => document.querySelector(".tutor-controls [data-a=play]").textContent.includes("Assistir") && window.__spoken.length > 5, null, { timeout: 15000 });
  const spoken = await page.evaluate(() => window.__spoken);
  assert.ok(spoken.some((s) => s.lang === "en-US") && spoken.some((s) => s.lang === "pt-BR"), "fala em inglês e português");
  assert.match(await page.textContent(".tutor-slide-title"), new RegExp(`${total}/${total}`));
});

test("aula sob medida: gera slides e quiz com a IA", async () => {
  await go("inicio"); await setClaudeKey();
  claudeReply = () => JSON.stringify({ title: "Drive-thru", slides: [{ title: "Pedindo", lines: [{ lang: "pt", text: "Vamos pedir." }, { lang: "en", text: "Can I get a burger?" }] }, { title: "Revisão", lines: [{ lang: "pt", text: "Muito bem." }] }],
    quiz: [{ q: "Can I ___ a burger?", options: ["get", "got", "gets"], answer: 0, explain: "Can + verbo base." }] });
  await go("aulas");
  await page.click("text=Pedir comida no drive-thru");
  await page.waitForSelector(".tutor-board");
  assert.match(await page.textContent("#view-aulas"), /Drive-thru/);
  assert.equal(await page.$$eval("#view-aulas .ex", (x) => x.length), 1);
});

test("lembretes: escolha de horário e dias fica salva", async () => {
  await go("lembretes");
  await page.click("text=+ Adicionar horário");
  const days = await page.$$(".reminder >> nth=1 >> .day");
  await days[0].click(); // desmarca domingo
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem("inglesei:settings")));
  assert.equal(s.reminders.length, 2);
  assert.equal(s.reminders[1].days.includes(0), false);
  assert.match(await page.textContent("#view-lembretes"), /funcionam no app Inglesei para Android/);
});

test("celular: nenhuma tela rola para o lado", async () => {
  await page.setViewportSize({ width: 360, height: 760 });
  await go("inicio"); await setClaudeKey();
  for (const v of ["inicio", "trilha", "licao-register", "aula-to-be", "aulas", "expressoes", "conversa", "treino", "lembretes", "ajustes", "mais", "motivacao"]) {
    await go(v);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.equal(ov, 0, `${v} rola ${ov}px para o lado`);
  }
});
