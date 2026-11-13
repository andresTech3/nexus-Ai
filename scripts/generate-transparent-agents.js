const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const HASH_MAP = {
  ivan: 'c9887b42',
  valeria: 'a1ff5ace',
  clara: 'd05652ab',
  diego: 'a473a8e8',
  lucas: '4654e6fb',
  carlos: '4654e6fb',
  leo: 'f4b39a70',
  sofia: '67337906',
  tomas: '73dd2484',
  mateo: 'cdce65d1',
  marco: 'cdce65d1',
  dora: 'a5391339',
};

const assetDir = path.join(__dirname, '..', 'assets', 'img agent');
const publicDir = path.join(__dirname, '..', 'public', 'agents');
const assetFiles = fs.readdirSync(assetDir);

function findMatchingFile(hash) {
  return assetFiles.find((f) => f.includes(hash) && !f.includes('(1)'));
}

async function processImage(inputPath, outWebp, outPng) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const total = width * height;
  const isBg = new Uint8Array(total);
  const queue = new Int32Array(total);
  let qHead = 0, qTail = 0;

  function checkPixel(idx) {
    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return min >= 235 && (max - min) <= 18;
  }

  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const botIdx = (height - 1) * width + x;
    if (checkPixel(topIdx)) { isBg[topIdx] = 1; queue[qTail++] = topIdx; }
    if (checkPixel(botIdx)) { isBg[botIdx] = 1; queue[qTail++] = botIdx; }
  }
  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (checkPixel(leftIdx)) { isBg[leftIdx] = 1; queue[qTail++] = leftIdx; }
    if (checkPixel(rightIdx)) { isBg[rightIdx] = 1; queue[qTail++] = rightIdx; }
  }

  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % width;
    const cy = (curr / width) | 0;

    if (cx > 0) {
      const n = curr - 1;
      if (!isBg[n] && checkPixel(n)) { isBg[n] = 1; queue[qTail++] = n; }
    }
    if (cx < width - 1) {
      const n = curr + 1;
      if (!isBg[n] && checkPixel(n)) { isBg[n] = 1; queue[qTail++] = n; }
    }
    if (cy > 0) {
      const n = curr - width;
      if (!isBg[n] && checkPixel(n)) { isBg[n] = 1; queue[qTail++] = n; }
    }
    if (cy < height - 1) {
      const n = curr + width;
      if (!isBg[n] && checkPixel(n)) { isBg[n] = 1; queue[qTail++] = n; }
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let i = 0; i < total; i++) {
    const pIdx = i * channels;
    const outIdx = i * 4;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    rgba[outIdx] = r;
    rgba[outIdx + 1] = g;
    rgba[outIdx + 2] = b;

    if (isBg[i]) {
      rgba[outIdx + 3] = 0;
    } else {
      const x = i % width;
      const y = (i / width) | 0;
      let nearBg = false;
      if ((x > 0 && isBg[i - 1]) || (x < width - 1 && isBg[i + 1]) ||
          (y > 0 && isBg[i - width]) || (y < height - 1 && isBg[i + width])) {
        nearBg = true;
      }

      if (nearBg) {
        const brightness = (r + g + b) / 3;
        if (brightness > 220) {
          const alphaFactor = Math.max(0, Math.min(1, (255 - brightness) / 35));
          rgba[outIdx + 3] = Math.round(alphaFactor * 255);
        } else {
          rgba[outIdx + 3] = 255;
        }
      } else {
        rgba[outIdx + 3] = 255;
      }

      if (rgba[outIdx + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 24;
  const top = Math.max(0, minY - pad);
  const bottom = Math.min(height, maxY + pad);
  const left = Math.max(0, minX - pad);
  const right = Math.min(width, maxX + pad);
  const cropW = right - left;
  const cropH = bottom - top;

  const charBuffer = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(760, 760, { fit: 'inside' })
    .png()
    .toBuffer();

  const finalPipeline = sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([{ input: charBuffer, gravity: 'center' }]);

  await finalPipeline.clone().webp({ quality: 95 }).toFile(outWebp);
  await finalPipeline.clone().png({ quality: 95 }).toFile(outPng);
}

async function main() {
  for (const [name, hash] of Object.entries(HASH_MAP)) {
    const matched = findMatchingFile(hash);
    if (!matched) {
      console.warn('No asset found for', name, hash);
      continue;
    }
    const inputPath = path.join(assetDir, matched);
    const outWebp = path.join(publicDir, name + '.webp');
    const outPng = path.join(publicDir, name + '.png');
    console.log(`Processing ${name} from ${matched}...`);
    await processImage(inputPath, outWebp, outPng);
  }

  // Also create eva.webp
  const sofiaWebp = path.join(publicDir, 'sofia.webp');
  if (fs.existsSync(sofiaWebp)) {
    fs.copyFileSync(sofiaWebp, path.join(publicDir, 'eva.webp'));
    fs.copyFileSync(path.join(publicDir, 'sofia.png'), path.join(publicDir, 'eva.png'));
    console.log('Done eva from sofia');
  }

  console.log('All 800x800 transparent agent cutouts generated successfully!');
}

main().catch(console.error);
