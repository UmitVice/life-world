// scripts/generatePlaceholderWebp.mjs
//
// One-off helper: converts public/images/placeholder.jpg into a 96×96
// WebP at public/images/properties/marker/placeholder.webp so the
// marker fallback chain always has a WebP target to hit.

import sharp from 'sharp';

const SRC = new URL('../public/images/placeholder.jpg', import.meta.url)
  .pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = new URL('../public/images/properties/marker/placeholder.webp', import.meta.url)
  .pathname.replace(/^\/([A-Za-z]:)/, '$1');

await sharp(SRC)
  .resize(96, 96, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
