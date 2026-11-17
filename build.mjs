// Monta o app: junta o JavaScript em www/app.js e gera a lista de arquivos do modo offline.
import { build } from "esbuild";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020", "chrome90", "safari15"],
  outfile: "www/app.js",
  banner: { js: `window.INGLESEI_VERSION=${JSON.stringify(pkg.version)};` },
  logLevel: "info",
});

// Service worker: guarda todos os arquivos para o app abrir sem internet (versão web).
const files = [];
const walk = (dir) => readdirSync(dir).forEach((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (!["sw.js"].includes(f) && !p.includes("audio")) files.push(p.slice(4).replace(/\\/g, "/"));
});
walk("www");
const version = `${pkg.version}-${Date.now()}`;
writeFileSync("www/sw.js", `// Gerado por build.mjs
const CACHE = "inglesei-${version}";
const FILES = ${JSON.stringify(["./", ...files])};
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== "inglesei-audio").map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // IA e APIs externas: sempre pela rede
  // Áudios: guardados à medida que são ouvidos (não baixa todos de uma vez).
  if (url.pathname.includes("/audio/")) {
    e.respondWith(caches.open("inglesei-audio").then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
`);
console.log(`sw.js: ${files.length} arquivos no cache offline`);
