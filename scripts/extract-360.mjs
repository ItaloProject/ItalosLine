#!/usr/bin/env node
/**
 * Extrai uma sequência 360° a partir de um vídeo de volta completa (turntable)
 * e grava em public/360/<ref>/01.jpg … NN.jpg — o formato que o Viewer360 lê.
 *
 *   node scripts/extract-360.mjs <video> <ref> [--frames 36] [--width 1200]
 *                                             [--quality 4] [--start 0] [--end 0]
 *
 * Exemplo:
 *   node scripts/extract-360.mjs ~/Downloads/camisa-giro.mp4 IL-101
 *
 * O vídeo deve conter exatamente UMA volta completa da peça. Se ele tiver
 * sobras no começo ou no fim, recorte com --start / --end (em segundos).
 *
 * Requer ffmpeg no PATH.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const positional = argv.filter(
  (a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--"))
);

const [video, ref] = positional;

if (!video || !ref) {
  console.error(`
Uso: node scripts/extract-360.mjs <video> <ref> [opções]

  <video>            vídeo com uma volta completa da peça
  <ref>              pasta de destino em public/360/ (ex.: IL-101)

  --frames   36      quantos quadros gerar (24–36 é o usual)
  --width    1200    largura de saída em px
  --quality  4       qualidade JPEG do ffmpeg (2 = melhor, 31 = pior)
  --start    0       segundos a ignorar no início
  --end      0       segundos a ignorar no fim
`);
  process.exit(1);
}

const src = resolve(video);
if (!existsSync(src)) {
  console.error(`Vídeo não encontrado: ${src}`);
  process.exit(1);
}

const count = Number(flag("frames", 36));
const width = Number(flag("width", 1200));
const quality = Number(flag("quality", 4));
const startAt = Number(flag("start", 0));
const endTrim = Number(flag("end", 0));

const ffprobe = (args) =>
  execFileSync("ffprobe", args, { encoding: "utf8" }).trim();

let duration;
try {
  duration = Number(
    ffprobe([
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      src,
    ])
  );
} catch {
  console.error("Não consegui ler o vídeo. O ffmpeg/ffprobe está no PATH?");
  process.exit(1);
}

const span = duration - startAt - endTrim;
if (!(span > 0)) {
  console.error(`Trecho inválido: ${span.toFixed(2)}s (duração ${duration.toFixed(2)}s)`);
  process.exit(1);
}

const outDir = resolve("public", "360", ref);
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

console.log(`Vídeo    ${basename(src)}  (${duration.toFixed(2)}s)`);
console.log(`Trecho   ${startAt}s → ${(duration - endTrim).toFixed(2)}s`);
console.log(`Gerando  ${count} quadros de ${width}px em public/360/${ref}/\n`);

// Amostra em intervalos iguais para que a volta feche sem repetir o quadro 1.
const step = span / count;

for (let i = 0; i < count; i++) {
  const t = startAt + i * step;
  const name = String(i + 1).padStart(2, "0") + ".jpg";
  execFileSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-ss", t.toFixed(4),
      "-i", src,
      "-frames:v", "1",
      "-vf", `scale=${width}:-2:flags=lanczos`,
      "-q:v", String(quality),
      join(outDir, name),
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
  process.stdout.write(`\r  ${i + 1}/${count}`);
}

const written = readdirSync(outDir).length;
console.log(`\n\n✓ ${written} quadros em public/360/${ref}/`);
console.log(`
Agora ligue a sequência à peça em src/lib/vitrine.ts:

    import { frameSet } from "./vitrine";
    …
    {
      ref: "${ref.replace("-", "—")}",
      …
      frames: frameSet("${ref}", ${count}),
    }
`);
