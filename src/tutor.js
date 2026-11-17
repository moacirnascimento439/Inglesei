// ===== Vídeo-aulas: professor(a) animado(a) + player de aulas narradas =====
import { speakLines, stopSpeaking, onSpeakingChange } from "./voice.js";

// ---------- Roteiro da aula a partir de uma lição da trilha ----------
/** Divide um HTML da lição em falas: o que está em <em> é inglês, o resto é português. */
function segment(node, out = [], inEn = false) {
  node.childNodes.forEach((c) => {
    if (c.nodeType === 3) {
      const t = c.textContent.replace(/\s+/g, " ");
      if (!t.trim()) { if (out.length) out[out.length - 1].text += " "; return; }
      const lang = inEn ? "en" : "pt";
      const last = out[out.length - 1];
      if (last && last.lang === lang) last.text += t; else out.push({ lang, text: t });
    } else if (c.nodeType === 1) {
      segment(c, out, inEn || c.tagName === "EM");
    }
  });
  return out;
}
function cleanLines(lines) {
  return lines.map((l) => ({ lang: l.lang, text: l.text.replace(/[→()]/g, " ").replace(/\s+/g, " ").trim() }))
    .filter((l) => /[A-Za-zÀ-ú0-9]/.test(l.text));
}

/** tutor = { name, g: "f" | "m" } */
export function lessonToSlides(L, tutor) {
  const box = document.createElement("div");
  box.innerHTML = L.theory;
  const slides = [{
    title: L.title,
    html: `<p class="tutor-big">${L.lvl} · ${escapeHTML(L.title)}</p>`,
    lines: [{ lang: "pt", text: tutor.g === "f"
      ? `Oi! Eu sou a ${tutor.name}, sua professora de inglês. Nesta aula você vai aprender: ${L.title}.`
      : `Oi! Eu sou o ${tutor.name}, seu professor de inglês. Nesta aula você vai aprender: ${L.title}.` }],
  }];
  [...box.children].forEach((elm) => {
    if (elm.tagName === "TABLE") {
      const rows = [...elm.querySelectorAll("tr")].slice(1).map((tr) => [...tr.children].map((td) => td.textContent.trim()));
      slides.push({ title: "Veja a tabela", html: elm.outerHTML, lines: rows.map((r) => ({ lang: "en", text: r.join(", ") })) });
      return;
    }
    const lines = cleanLines(segment(elm));
    if (lines.length) slides.push({ title: "Teoria", html: elm.outerHTML, lines });
  });
  slides.push({
    title: "Exemplos",
    html: `<ul class="tutor-ex">${L.ex.map(([en, pt]) => `<li><b>${escapeHTML(en)}</b><span>${escapeHTML(pt)}</span></li>`).join("")}</ul>`,
    lines: [{ lang: "pt", text: "Agora ouça os exemplos e repita em voz alta." }, ...L.ex.flatMap(([en, pt]) => [{ lang: "en", text: en }, { lang: "pt", text: pt }])],
  });
  if (L.tips.length) {
    const t = document.createElement("div");
    t.innerHTML = `<ul>${L.tips.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    slides.push({ title: "Cuidado, brasileiros!", html: t.innerHTML, lines: [{ lang: "pt", text: "Atenção para os erros mais comuns de brasileiros." }, ...cleanLines(segment(t))] });
  }
  slides.push({
    title: "Sua vez!",
    html: `<p class="tutor-big">Agora pratique com os exercícios da lição.</p>`,
    lines: [{ lang: "pt", text: "Muito bem! Agora é a sua vez: faça os exercícios da lição. Você consegue!" }, { lang: "en", text: "You've got this!" }],
  });
  return slides;
}

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Converte a aula gerada pela IA (texto puro, sem HTML) em slides. */
export function aiLessonToSlides(data) {
  return data.slides.map((s) => ({
    title: s.title,
    html: `<ul class="tutor-ex">${s.lines.map((l) => `<li class="${l.lang === "en" ? "is-en" : ""}">${escapeHTML(l.text)}</li>`).join("")}</ul>`,
    lines: s.lines.map((l) => ({ lang: l.lang === "en" ? "en" : "pt", text: l.text })),
  }));
}

// ---------- Player ----------
/**
 * Monta o player dentro de `root`.
 * face = { html, title } do avatar escolhido.
 */
export function createPlayer(root, slides, face, { onEnd } = {}) {
  let idx = 0, playing = false;
  root.innerHTML = `
  <div class="tutor-stage">
    <div class="tutor-face">${face.html}<span class="tutor-name">${escapeHTML(face.title)}</span></div>
    <div class="tutor-board">
      <div class="tutor-slide-title"></div>
      <div class="tutor-slide-body"></div>
    </div>
  </div>
  <p class="tutor-sub" aria-live="polite"></p>
  <div class="tutor-controls">
    <button type="button" class="btn" data-a="prev" aria-label="Slide anterior">‹ Anterior</button>
    <button type="button" class="btn primary" data-a="play">▶ Assistir</button>
    <button type="button" class="btn" data-a="next" aria-label="Próximo slide">Próximo ›</button>
  </div>
  <div class="tutor-dots"></div>`;
  const faceEl = root.querySelector(".tutor-face");
  const title = root.querySelector(".tutor-slide-title");
  const body = root.querySelector(".tutor-slide-body");
  const sub = root.querySelector(".tutor-sub");
  const playBtn = root.querySelector('[data-a="play"]');
  const dots = root.querySelector(".tutor-dots");
  const off = onSpeakingChange((v) => faceEl.classList.toggle("talking", v));

  function render() {
    const s = slides[idx];
    title.textContent = `${idx + 1}/${slides.length} · ${s.title}`;
    body.innerHTML = s.html; // conteúdo nosso ou escapado em aiLessonToSlides
    dots.innerHTML = slides.map((_, i) => `<i class="${i === idx ? "on" : i < idx ? "done" : ""}"></i>`).join("");
    playBtn.textContent = playing ? "❚❚ Pausar" : "▶ Assistir";
  }
  async function playFrom(i) {
    idx = i; playing = true; render();
    while (playing && idx < slides.length) {
      const s = slides[idx];
      const finished = await speakLines(s.lines, (k) => { sub.textContent = s.lines[k].text; sub.className = "tutor-sub " + (s.lines[k].lang === "en" ? "is-en" : ""); });
      if (!finished || !playing) return;
      if (idx === slides.length - 1) { playing = false; render(); onEnd?.(); return; }
      idx++; render();
    }
  }
  async function pause() { playing = false; await stopSpeaking(); render(); }
  root.querySelector(".tutor-controls").addEventListener("click", async (e) => {
    const a = e.target.closest("button")?.dataset.a;
    if (a === "play") { if (playing) pause(); else playFrom(idx); }
    if (a === "next" && idx < slides.length - 1) { const p = playing; await pause(); idx++; render(); if (p) playFrom(idx); }
    if (a === "prev" && idx > 0) { const p = playing; await pause(); idx--; render(); if (p) playFrom(idx); }
  });
  render();
  return { destroy() { playing = false; stopSpeaking(); off(); } };
}
