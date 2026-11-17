// ===== Avatares dos professores =====
// Retratos em SVG com luz e sombra (sem imagens externas, funcionam offline).
// Cada professor tem uma voz natural combinando (pacote embutido, Gemini e OpenAI).
export const AVATARS = [
  { id: "liz", name: "Liz", g: "f", from: "Nova York", style: "long", pack: "emma", gemini: "Kore", openai: "nova",
    skin: "#f2c7a6", shade: "#d49a78", hair: "#3b2419", hairHi: "#74482f", iris: "#6b4a2b", lip: "#c9655f", lipDark: "#a84d48", shirt: "#ff4f7b", shirtDark: "#d63a63", earrings: true },
  { id: "sofia", name: "Sofia", g: "f", from: "Miami", style: "long2", pack: "amy", gemini: "Aoede", openai: "shimmer",
    skin: "#dca782", shade: "#b47c57", hair: "#1d1513", hairHi: "#4e342b", iris: "#3d2817", lip: "#b95b56", lipDark: "#94433f", shirt: "#14b8a6", shirtDark: "#0d8c7f", earrings: true },
  { id: "aisha", name: "Aisha", g: "f", from: "Atlanta", style: "curly", pack: "emma", gemini: "Leda", openai: "coral",
    skin: "#8e5b3c", shade: "#66391f", hair: "#17110f", hairHi: "#3d2c25", iris: "#2b1a10", lip: "#82423a", lipDark: "#5e2a25", shirt: "#f5b700", shirtDark: "#c99400", earrings: true },
  { id: "mike", name: "Mike", g: "m", from: "Chicago", style: "short", pack: "ryan", gemini: "Puck", openai: "echo",
    skin: "#f3cdb1", shade: "#d3a283", hair: "#7a4f27", hairHi: "#b07a44", iris: "#3f6e8c", lip: "#c47a6e", lipDark: "#a36054", shirt: "#3b5bdb", shirtDark: "#2a44ad" },
  { id: "james", name: "James", g: "m", from: "Houston", style: "buzz", pack: "joe", gemini: "Charon", openai: "onyx",
    skin: "#6f452f", shade: "#4c2b1b", hair: "#15100e", hairHi: "#30251f", iris: "#24160d", lip: "#5f3027", lipDark: "#45201a", shirt: "#16a34a", shirtDark: "#0f7d38", beard: true },
  { id: "carlos", name: "Carlos", g: "m", from: "Los Angeles", style: "wavy", pack: "ryan", gemini: "Fenrir", openai: "ash",
    skin: "#c98f66", shade: "#a1694a", hair: "#1f1612", hairHi: "#4b372e", iris: "#3a2414", lip: "#a55f52", lipDark: "#844a3f", shirt: "#7c3aed", shirtDark: "#5b21b6", beard: true, glasses: true },
];

export const avatarById = (id) => AVATARS.find((a) => a.id === id) || AVATARS[0];
/** "a professora Liz" / "o professor Mike" */
export const tutorRef = (a) => (a.g === "f" ? `a professora ${a.name}` : `o professor ${a.name}`);
export const tutorTitle = (a) => (a.g === "f" ? `Professora ${a.name}` : `Professor ${a.name}`);

const HAIR = {
  long: {
    back: "M57 102C50 56 76 34 100 34c27 0 52 22 43 70 4 36 10 62 14 82H43c5-22 11-48 14-84z",
    front: "M62 101C57 60 78 39 101 39c25 0 43 20 37 61-4-22-14-36-30-40-8 15-26 26-46 41z M62 101c-2 20 0 40 4 50l-6 2c-4-20-4-38 2-52z M138 100c2 20 0 40-4 50l6 2c4-20 4-38-2-52z",
  },
  long2: {
    back: "M56 104C50 58 74 34 100 34c28 0 52 22 44 72 6 30 4 58 12 80H44c8-22 6-50 12-82z",
    front: "M138 101C143 60 122 39 99 39c-25 0-43 20-37 61 4-22 14-36 30-40 8 15 26 26 46 41z M62 102c-3 24-1 42 5 52l-7 1c-5-20-5-40 2-53z",
  },
  curly: {
    back: "M100 22c-34 0-56 22-58 54-12 10-14 30-6 44 0 16 8 26 20 28h88c12-2 20-12 20-28 8-14 6-34-6-44-2-32-24-54-58-54z",
    front: "M64 92c-6-12-2-26 10-30-2-12 10-22 22-18 8-10 24-8 30 4 12-2 22 8 18 20 12 6 12 20 4 28-6-14-18-24-34-26-14 0-26 4-34 12-8 2-14 6-16 10z",
  },
  short: {
    front: "M64 98c-4-40 16-58 38-58 24 0 40 18 34 56-2-16-8-26-16-30-12 4-32-2-44 6-6 6-10 16-12 26z",
  },
  buzz: {
    front: "M65 94c-1-34 17-50 35-50s36 16 35 50c-5-22-17-34-35-34s-30 12-35 34z",
  },
  wavy: {
    front: "M63 97c-5-40 17-59 39-59 26 0 42 20 35 58-4-18-11-28-21-32-4 6-12 2-18-2-6 6-14 4-20 8-6 6-12 16-15 27z",
  },
};

let uidCounter = 0;
/** SVG do avatar. Coloque a classe "talking" num elemento pai para animar a fala. */
export function avatarSVG(a, size = 120) {
  const u = `av${++uidCounter}`;
  const id = (n) => `${u}-${n}`;
  const h = HAIR[a.style] || HAIR.short;
  const lash = a.g === "f";
  const eye = (cx) => `
    <path d="M${cx - 11} 100q11-8.5 22 0q-11 6.5-22 0z" fill="#fbf8f4"/>
    <circle cx="${cx}" cy="100" r="4.7" fill="url(#${id("iris")})"/>
    <circle cx="${cx}" cy="100" r="2.2" fill="#111"/>
    <circle cx="${cx + 1.6}" cy="98.4" r="1.2" fill="#fff"/>
    <path d="M${cx - 12} 100q12-9.8 24-.6" fill="none" stroke="#2a1a14" stroke-width="${lash ? 2.4 : 1.6}" stroke-linecap="round"/>
    ${lash ? `<path d="M${cx + 10} 98.6l3-2.4M${cx + 7.5} 96.6l2-2.6" stroke="#2a1a14" stroke-width="1.3" stroke-linecap="round"/>` : ""}`;
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 200 200" role="img" aria-label="${tutorTitle(a)}">
<defs>
  <radialGradient id="${id("skin")}" cx="46%" cy="40%" r="68%"><stop offset="0" stop-color="${a.skin}"/><stop offset=".72" stop-color="${a.skin}"/><stop offset="1" stop-color="${a.shade}"/></radialGradient>
  <linearGradient id="${id("hair")}" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${a.hairHi}"/><stop offset=".55" stop-color="${a.hair}"/></linearGradient>
  <linearGradient id="${id("shirt")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.shirt}"/><stop offset="1" stop-color="${a.shirtDark}"/></linearGradient>
  <radialGradient id="${id("iris")}"><stop offset="0" stop-color="${a.iris}" stop-opacity=".6"/><stop offset="1" stop-color="${a.iris}"/></radialGradient>
  <clipPath id="${id("clip")}"><circle cx="100" cy="100" r="100"/></clipPath>
</defs>
<g clip-path="url(#${id("clip")})">
  <rect width="200" height="200" fill="var(--avatar-bg)"/>
  <g transform="translate(100 108) scale(1.26) translate(-100 -100)"><g class="av-head">
    ${h.back ? `<path d="${h.back}" fill="url(#${id("hair")})"/>` : ""}
    <path d="M84 138v28q16 9 32 0v-28z" fill="${a.shade}"/>
    <path d="M26 202c2-26 24-40 58-44q16 14 32 0c34 4 56 18 58 44z" fill="url(#${id("shirt")})"/>
    <path d="M84 158q16 16 32 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
    <ellipse cx="63" cy="105" rx="7" ry="11" fill="${a.shade}"/><ellipse cx="137" cy="105" rx="7" ry="11" fill="${a.shade}"/>
    <path d="M64 96c0-34 16-50 36-50s36 16 36 50c0 28-12 52-36 58-24-6-36-30-36-58z" fill="url(#${id("skin")})"/>
    <path d="M70 124c8 20 20 28 30 30 10-2 22-10 30-30-8 16-18 23-30 24-12-1-22-8-30-24z" fill="${a.shade}" opacity=".35"/>
    <ellipse cx="78" cy="121" rx="9" ry="5" fill="#e8857a" opacity=".22"/><ellipse cx="122" cy="121" rx="9" ry="5" fill="#e8857a" opacity=".22"/>
    ${a.beard ? `<path d="M66 112c2 28 18 44 34 45 16-1 32-17 34-45-4 20-14 34-34 36-20-2-30-16-34-36z" fill="${a.hair}" opacity=".5"/><path d="M86 128q14-5 28 0-2 6-14 5-12 1-14-5z" fill="${a.hair}" opacity=".55"/>` : ""}
    <g class="av-eyes">${eye(84)}${eye(116)}</g>
    <path d="M72 ${a.g === "f" ? 88 : 87.5}q12-6 23-1M105 87q11-5 23 1" fill="none" stroke="${a.hair}" stroke-width="${a.g === "f" ? 2.8 : 4}" stroke-linecap="round"/>
    <path d="M100 102c-2 10-5 17-3 21q3 2.6 7 0" fill="none" stroke="${a.shade}" stroke-width="1.9" stroke-linecap="round"/>
    <g class="av-lips">
      <path d="M88 134q6-3 12-1.5q6-1.5 12 1.5q-12 2-24 0z" fill="${a.lip}"/>
      <path d="M89 134.5q11 7.5 22 0q-11 2.5-22 0z" fill="${a.lipDark}"/>
    </g>
    <g class="av-mouth">
      <path d="M88.5 133.5q11.5-3.5 23 0q-11.5 14-23 0z" fill="#4a1717" stroke="${a.lip}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M92 134.2q8-1.6 16 0l-1 2.2q-7-.8-14 0z" fill="#fff"/>
    </g>
    ${a.glasses ? `<g fill="none" stroke="#1d1d24" stroke-width="2.4"><rect x="71" y="91" width="26" height="18" rx="7"/><rect x="103" y="91" width="26" height="18" rx="7"/><path d="M97 99h6M71 97l-7-2M129 97l7-2"/></g>` : ""}
    ${a.earrings ? `<circle cx="63" cy="118" r="3.2" fill="#ffd166"/><circle cx="137" cy="118" r="3.2" fill="#ffd166"/>` : ""}
    <path d="${h.front}" fill="url(#${id("hair")})"/>
  </g></g>
</g>
</svg>`;
}

/** Avatar de foto escolhida pelo usuário (com anel que pulsa enquanto fala). */
export function photoAvatarHTML(src, size, name) {
  return `<div class="photo-avatar" style="width:${size}px;height:${size}px"><img src="${src}" alt="${name || "Seu avatar"}"><span class="ring"></span></div>`;
}
