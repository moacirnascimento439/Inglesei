// Gera os ícones PNG (web e Android) a partir de tools/icon.svg.
// Uso: node tools/make-icons.js   (precisa do Playwright)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const svg = fs.readFileSync(path.join(__dirname, "icon.svg"), "utf8");
const font = fs.readFileSync(path.join(root, "www/fonts/bricolage-800.woff2")).toString("base64");
const fontCss = `@font-face{font-family:"Bricolage Grotesque";font-weight:800;src:url(data:font/woff2;base64,${font}) format("woff2");}`;
const markOnly = svg.replace(/<rect[^>]*\/>/, ""); // sem o fundo (para o ícone adaptativo do Android)

async function render(page, markup, size, file, { bg = "transparent", scale = 1, round = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><head><style>${fontCss}html,body{margin:0;background:${bg}}
    .w{width:${size}px;height:${size}px;display:grid;place-items:center;overflow:hidden;${round ? "border-radius:50%;" : ""}}
    .w svg{width:${size * scale}px;height:${size * scale}px}</style></head><body><div class="w">${markup}</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.locator(".w").screenshot({ path: file, omitBackground: bg === "transparent" });
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const web = path.join(root, "www/icons");
  await render(p, svg, 192, path.join(web, "icon-192.png"));
  await render(p, svg, 512, path.join(web, "icon-512.png"));
  const square = svg.replace(/rx="112"/, 'rx="0"');
  await render(p, markOnly, 512, path.join(web, "icon-maskable-512.png"), { bg: "#D6402B", scale: 0.8 });

  const res = path.join(root, "android/app/src/main/res");
  if (fs.existsSync(res)) {
    const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
    for (const [d, f] of Object.entries(dens)) {
      await render(p, square, Math.round(48 * f), path.join(res, `mipmap-${d}/ic_launcher.png`), { round: false });
      await render(p, square, Math.round(48 * f), path.join(res, `mipmap-${d}/ic_launcher_round.png`), { round: true });
      await render(p, markOnly, Math.round(108 * f), path.join(res, `mipmap-${d}/ic_launcher_foreground.png`), { scale: 0.62 });
    }
    // Telas de abertura (splash): mesmo tamanho dos arquivos originais do modelo
    const splashes = [];
    const walk = (dir) => fs.readdirSync(dir).forEach((n) => { const f = path.join(dir, n); if (fs.statSync(f).isDirectory()) walk(f); else if (n === "splash.png") splashes.push(f); });
    walk(res);
    for (const f of splashes) {
      const buf = fs.readFileSync(f);
      const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
      await p.setViewportSize({ width: w, height: h });
      const s = Math.round(Math.min(w, h) * 0.32);
      await p.setContent(`<html><head><style>${fontCss}html,body{margin:0;width:${w}px;height:${h}px;background:#F4F6FB;display:grid;place-items:center}
        svg{width:${s}px;height:${s}px}</style></head><body>${svg}</body></html>`);
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: f });
    }
    console.log(`Android: ícones + ${splashes.length} splash`);
  }
  await b.close();
  console.log("Ícones gerados.");
})();
