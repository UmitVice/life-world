// scripts/optimizeImages.mjs
//
// Reads every .jpg / .jpeg / .png under public/images/properties/ and
// generates two WebP variants next to them:
//
//   public/images/properties/marker/<name>.webp   96×96, q=80
//     ↳ fed into the Leaflet divIcon. Small file size is critical
//       because all markers on the listings page load at once.
//
//   public/images/properties/card/<name>.webp     400×300, q=80
//     ↳ fed into PropertyCard. Crisp on retina, still well under
//       30 KB.
//
// Originals are kept (smaller `placeholder.jpg` can also be converted).
// The marker-card fallback chain (see buildMarkerImageSrc and
// PropertyImage) tries the new `.webp` first and falls back to the
// original if missing.
//
// Usage:
//   yarn optimize-images
//   npm run optimize-images

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'public', 'images', 'properties');
const MARKER_OUT = path.join(SRC_DIR, 'marker');
const CARD_OUT = path.join(SRC_DIR, 'card');

const MARKER_SIZE = 96;
const CARD_SIZE = 400; // width (height auto-derived from aspect)
const QUALITY = 80;

const SUPPORTED_EXT = new Set(['.jpg', '.jpeg', '.png']);

const isImageFile = (name) =>
  SUPPORTED_EXT.has(path.extname(name).toLowerCase());

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const fmtKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const processFile = async (file) => {
  const srcPath = path.join(SRC_DIR, file);
  const baseName = path.parse(file).name;

  const srcStat = await fs.stat(srcPath);
  const srcBuffer = await fs.readFile(srcPath);
  const srcMeta = await sharp(srcBuffer).metadata();

  // ---- Marker variant (96×96, cover-cropped to a square) ----
  const markerName = `${baseName}.webp`;
  await sharp(srcBuffer)
    .resize(MARKER_SIZE, MARKER_SIZE, {
      fit: 'cover',
      position: 'attention', // smart crop for portraits/landscapes
    })
    .webp({ quality: QUALITY })
    .toFile(path.join(MARKER_OUT, markerName));

  // ---- Card variant (responsive, max width 400) ----
  const cardName = `${baseName}.webp`;
  const cardWidth = Math.min(CARD_SIZE, srcMeta.width ?? CARD_SIZE);
  await sharp(srcBuffer)
    .resize({ width: cardWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(path.join(CARD_OUT, cardName));

  const afterStat = await fs.stat(path.join(CARD_OUT, cardName));
  return {
    name: baseName,
    before: srcStat.size,
    after: afterStat.size,
  };
};

const main = async () => {
  await ensureDir(MARKER_OUT);
  await ensureDir(CARD_OUT);

  const entries = await fs.readdir(SRC_DIR);
  const imageFiles = entries.filter(isImageFile);

  if (imageFiles.length === 0) {
    console.log('No source images found in', SRC_DIR);
    return;
  }

  console.log(
    `Optimizing ${imageFiles.length} image(s) → marker ${MARKER_SIZE}×${MARKER_SIZE}, card max ${CARD_SIZE}w @ q=${QUALITY}…`,
  );

  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of imageFiles) {
    try {
      const { name, before, after } = await processFile(file);
      totalBefore += before;
      totalAfter += after;
      console.log(`  ✓ ${name}: ${fmtKb(before)} → ${fmtKb(after)}`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err);
    }
  }

  const saved = totalBefore - totalAfter;
  const pct = totalBefore === 0 ? 0 : Math.round((saved / totalBefore) * 100);
  console.log(
    `\nDone. ${fmtKb(totalBefore)} → ${fmtKb(totalAfter)}  (saved ${fmtKb(
      saved,
    )}, ${pct}% smaller).`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
