// ===== Professora Liz: avatar animado + player de aulas narradas =====
import { speakLines, stopSpeaking, onSpeakingChange } from "./platform.js";

export const TUTOR_NAME = "Liz";

/** Avatar em SVG. A classe "talking" no elemento pai anima a boca. */
export function avatarSVG(size = 120) {
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 200 200" role="img" aria-label="Professora ${TUTOR_NAME}">
  <circle cx="100" cy="100" r="98" fill="var(--avatar-bg)"/>
  <path d="M44 112c-6-44 20-78 58-78s62 30 56 78c-4 30-10 48-10 48H54s-6-18-10-48z" fill="#3b2418"/>
  <path d="M40 200c4-30 28-46 60-46s56 16 60 46z" fill="var(--accent)"/>
  <path d="M84 154l16 18 16-18" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
  <rect x="88" y="132" width="24" height="26" rx="8" fill="#e8b48c"/>
  <ellipse cx="100" cy="100" rx="44" ry="50" fill="#f2c39c"/>
  <path d="M56 92c2-30 22-46 46-46 22 0 40 14 44 40-14-4-30-14-38-26-10 16-30 28-52 32z" fill="#3b2418"/>
  <circle cx="56" cy="108" r="5" fill="#ffd166"/><circle cx="144" cy="108" r="5" fill="#ffd166"/>
  <g class="av-eyes"><ellipse cx="82" cy="100" rx="5.5" ry="7" fill="#1d1d2b"/><ellipse cx="118" cy="100" rx="5.5" ry="7" fill="#1d1d2b"/>
    <circle cx="84" cy="97" r="1.8" fill="#fff"/><circle cx="120" cy="97" r="1.8" fill="#fff"/></g>
  <path d="M72 87q10-6 20 0M108 87q10-6 20 0" fill="none" stroke="#3b2418" stroke-width="3" stroke-linecap="round"/>
  <circle cx="72" cy="116" r="7" fill="#f29b8b" opacity=".55"/><circle cx="128" cy="116" r="7" fill="#f29b8b" opacity=".55"/>
  <path class="av-smile" d="M88 124q12 10 24 0" fill="none" stroke="#9c3b2e" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse class="av-mouth" cx="100" cy="127" rx="9" ry="7" fill="#7a2a20"/>
</svg>`;
}

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

export function lessonToSlides(L) {
  const box = document.createElement("div");
  box.innerHTML = L.theory;
  const slides = [{
    title: L.title,
    html: `<p class="tutor-big">${L.lvl} · ${escapeHTML(L.title)}</p>`,
    lines: [{ lang: "pt", text: `Oi! Eu sou a ${TUTOR_NAME}, sua professora de inglês. Nesta aula você vai aprender: ${L.title}.` }],
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
 * getVoiceOpts() devolve { rate, pitch, voice } das configurações.
 */
export function createPlayer(root, slides, getVoiceOpts, { onEnd } = {}) {
  let idx = 0, playing = false;
  root.innerHTML = `
  <div class="tutor-stage">
    <div class="tutor-face">${avatarSVG(150)}<span class="tutor-name">Professora ${TUTOR_NAME}</span></div>
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
  const face = root.querySelector(".tutor-face");
  const title = root.querySelector(".tutor-slide-title");
  const body = root.querySelector(".tutor-slide-body");
  const sub = root.querySelector(".tutor-sub");
  const playBtn = root.querySelector('[data-a="play"]');
  const dots = root.querySelector(".tutor-dots");
  const off = onSpeakingChange((v) => face.classList.toggle("talking", v));

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
      const finished = await speakLines(s.lines, getVoiceOpts(), (k) => { sub.textContent = s.lines[k].text; sub.className = "tutor-sub " + (s.lines[k].lang === "en" ? "is-en" : ""); });
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
