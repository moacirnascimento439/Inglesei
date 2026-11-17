// Lista todos os textos fixos em inglês do app para gerar os áudios naturais.
// Uso: node tools/export-texts.mjs  →  tools/voice-texts.json
import { writeFileSync } from "node:fs";
import { LESSONS } from "../src/content/lessons.js";
import { SLANG, PHRASAL, IDIOMS } from "../src/content/expressions.js";
import { MOTIVATION, REMINDER_LINES, PACK_VOICES, SCENARIOS } from "../src/content/scenarios.js";
import { normText, voiceHash } from "../src/voicehash.js";

const texts = new Set();
const add = (t) => { const n = normText(t); if (n && /[a-z]/i.test(n)) texts.add(n); };
LESSONS.forEach((l) => l.ex.forEach(([en]) => en.split(" / ").forEach(add)));
SLANG.forEach((s) => { add(s[0]); add(s[2]); });
PHRASAL.forEach((p) => { add(p[0]); add(p[2]); });
IDIOMS.forEach((p) => { add(p[0]); add(p[2]); });
MOTIVATION.forEach(([en]) => add(en));
SCENARIOS.forEach((s) => add(s.opener));
add("You've got this!");

const list = [...texts].map((text) => ({ text, hash: voiceHash(text) }));
const hashes = new Set(list.map((x) => x.hash));
if (hashes.size !== list.length) throw new Error("Colisão de hash: ajuste o texto");
writeFileSync(new URL("./voice-texts.json", import.meta.url), JSON.stringify({
  voices: PACK_VOICES,
  texts: list,
  reminders: REMINDER_LINES.map(([en]) => en),
}, null, 1));
console.log(`${list.length} frases · ${REMINDER_LINES.length} lembretes · ${PACK_VOICES.length} vozes`);
