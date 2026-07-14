#!/usr/bin/env node
// Usage: node optimize-gallery.cjs [file1.webp file2.png ...]
// Generates compressed /images/thumbs (grid, 900w) and /images/full (lightbox, 1920w)
// WebP versions for gallery.html photos. With no args, regenerates every source
// image currently referenced in gallery.html's photos array.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public/images');
const thumbDir = path.join(__dirname, 'public/images/thumbs');
const fullDir = path.join(__dirname, 'public/images/full');
fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(fullDir, { recursive: true });

function imagesFromGalleryHtml() {
  const html = fs.readFileSync(path.join(__dirname, 'public/gallery.html'), 'utf8');
  const names = [...html.matchAll(/img\('([^']+)'/g)].map(m => m[1]);
  const exts = ['.webp', '.png', '.jpg', '.jpeg'];
  return names.map(name => {
    const found = exts.map(ext => name + ext).find(f => fs.existsSync(path.join(srcDir, f)));
    return found || name + '.webp';
  });
}

const images = process.argv.slice(2).length ? process.argv.slice(2) : imagesFromGalleryHtml();

(async () => {
  let totalBefore = 0, totalThumb = 0, totalFull = 0;
  for (const file of images) {
    const base = path.parse(file).name;
    const src = path.join(srcDir, file);
    if (!fs.existsSync(src)) { console.log('MISSING', file); continue; }
    const before = fs.statSync(src).size;
    const thumbPath = path.join(thumbDir, base + '.webp');
    const fullPath = path.join(fullDir, base + '.webp');
    await sharp(src).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 74 }).toFile(thumbPath);
    await sharp(src).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toFile(fullPath);
    const t = fs.statSync(thumbPath).size;
    const f = fs.statSync(fullPath).size;
    totalBefore += before; totalThumb += t; totalFull += f;
    console.log(file.padEnd(28), (before / 1024).toFixed(0) + 'K ->', 'thumb', (t / 1024).toFixed(0) + 'K,', 'full', (f / 1024).toFixed(0) + 'K');
  }
  console.log('---');
  console.log('TOTAL before(orig):', (totalBefore / 1024 / 1024).toFixed(2) + 'MB');
  console.log('TOTAL thumbs:', (totalThumb / 1024 / 1024).toFixed(2) + 'MB');
  console.log('TOTAL full:', (totalFull / 1024 / 1024).toFixed(2) + 'MB');
})();
