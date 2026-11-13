const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const HASH_MAP = {
  tomas: '73dd2484',
  leo: 'f4b39a70',
  dora: 'a5391339',
  valeria: 'a1ff5ace',
  nora: 'a1ff5ace',
  diego: 'a473a8e8',
  sofia: '67337906',
  clara: 'd05652ab',
  marta: 'd05652ab',
  lucas: '4654e6fb',
  carlos: '4654e6fb',
  mateo: 'cdce65d1',
  marco: 'cdce65d1',
  ivan: 'c9887b42',
};

const assetDir = path.join(__dirname, '..', 'assets', 'img agent');
const publicDir = path.join(__dirname, '..', 'public', 'agents');

const assetFiles = fs.readdirSync(assetDir);

function findMatchingFile(hash) {
  return assetFiles.find((f) => f.includes(hash) && !f.includes('(1)'));
}

async function removeBg(inputPath, outputPathWebp, outputPathPng) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.alloc(width * height * 4);
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBgColor(idx) {
    const r = data[idx * channels];
    const g = data[idx * channels + 1];
    const b = data[idx * channels + 2];
    return r > 235 && g > 235 && b > 235;
  }

  // Enqueue borders
  for (let x = 0; x < width; x++) {
    queue.push(x, (height - 1) * width + x);
    visited[x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width, y * width + (width - 1));
    visited[y * width] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    if (!isBgColor(curr)) continue;
    visited[curr] = 2; // confirmed bg
    const x = curr % width;
    const y = Math.floor(curr / width);

    const neighbors = [
      y > 0 ? curr - width : -1,
      y < height - 1 ? curr + width : -1,
      x > 0 ? curr - 1 : -1,
      x < width - 1 ? curr + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        if (isBgColor(n)) {
          queue.push(n);
        }
      }
    }
  }

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const outIdx = i * 4;
    rgba[outIdx] = r;
    rgba[outIdx + 1] = g;
    rgba[outIdx + 2] = b;

    if (visited[i] === 2) {
      rgba[outIdx + 3] = 0; // Transparent
    } else {
      const distFromWhite = Math.min(255 - r, 255 - g, 255 - b);
      if (distFromWhite < 20 && (visited[i] === 1 || isBgColor(i))) {
        rgba[outIdx + 3] = Math.round((distFromWhite / 20) * 255);
      } else {
        rgba[outIdx + 3] = 255;
      }
      const x = i % width;
      const y = Math.floor(i / width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const cropW = Math.max(1, maxX - minX);
  const cropH = Math.max(1, maxY - minY);
  const size = Math.max(cropW, cropH) + 60;
  const padX = Math.round((size - cropW) / 2);
  const padY = Math.round((size - cropH) / 2);

  const pipeline = sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .extend({
      top: padY,
      bottom: size - cropH - padY,
      left: padX,
      right: size - cropW - padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(600, 600);

  await pipeline.clone().webp({ quality: 92 }).toFile(outputPathWebp);
  await pipeline.clone().png({ quality: 92 }).toFile(outputPathPng);
}

async function main() {
  for (const [agent, hash] of Object.entries(HASH_MAP)) {
    const matched = findMatchingFile(hash);
    if (!matched) {
      console.warn(`Could not find asset for ${agent} (${hash})`);
      continue;
    }
    const fullInput = path.join(assetDir, matched);
    const outWebp = path.join(publicDir, `${agent}.webp`);
    const outPng = path.join(publicDir, `${agent}.png`);
    console.log(`Processing ${agent} from ${matched}...`);
    await removeBg(fullInput, outWebp, outPng);
  }
  console.log('All transparent agent renders processed successfully!');
}

main().catch(console.error);
