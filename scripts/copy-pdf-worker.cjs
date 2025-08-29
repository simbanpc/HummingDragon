/* Copies the modern (module) worker and a legacy fallback into /public */
const fs = require('fs');
const path = require('path');

const distDir = path.dirname(require.resolve('pdfjs-dist/package.json'));
const candidates = [
  ['build/pdf.worker.min.mjs', 'pdf.worker.min.mjs'],       // modern (preferred)
  ['legacy/build/pdf.worker.min.js', 'pdf.worker.min.js'],  // legacy fallback
];

const outDir = path.join(process.cwd(), 'public');
fs.mkdirSync(outDir, { recursive: true });

for (const [rel, outName] of candidates) {
  const src = path.join(distDir, rel);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, outName));
  }
}
console.log('✓ Copied pdfjs workers to /public');
