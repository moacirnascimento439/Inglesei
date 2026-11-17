// Identificador curto de uma frase (FNV-1a 32 bits sobre os bytes UTF-8 do texto normalizado).
// O mesmo cálculo existe em tools/make-voices.py para nomear os arquivos de áudio.
export function normText(text) {
  return String(text).replace(/\s+/g, " ").trim();
}
export function voiceHash(text) {
  const bytes = new TextEncoder().encode(normText(text));
  let h = 0x811c9dc5;
  for (const b of bytes) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}
