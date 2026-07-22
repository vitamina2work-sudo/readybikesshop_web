import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const brandDir = path.join(__dirname, '../public/brand')

function isNearWhite(r, g, b, tolerance = 18) {
  return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance
}

async function loadRgba(file) {
  const image = sharp(file).ensureAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  return { data: Uint8ClampedArray.from(data), width: info.width, height: info.height }
}

async function saveRgba(file, pixels, width, height) {
  const temp = `${file}.tmp.png`
  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(temp)
  fs.renameSync(temp, file)
}

function removeNearWhite(pixels, tolerance = 18) {
  for (let i = 0; i < pixels.length; i += 4) {
    if (isNearWhite(pixels[i], pixels[i + 1], pixels[i + 2], tolerance)) {
      pixels[i + 3] = 0
    }
  }
}

function removeEdgeWhite(pixels, width, height, tolerance = 18) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const pushIfWhite = (x, y) => {
    const idx = y * width + x
    if (visited[idx]) return
    const p = idx * 4
    if (!isNearWhite(pixels[p], pixels[p + 1], pixels[p + 2], tolerance)) return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x++) {
    pushIfWhite(x, 0)
    pushIfWhite(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    pushIfWhite(0, y)
    pushIfWhite(width - 1, y)
  }

  while (queue.length) {
    const idx = queue.pop()
    const p = idx * 4
    pixels[p + 3] = 0

    const x = idx % width
    const y = (idx - x) / width
    if (x > 0) pushIfWhite(x - 1, y)
    if (x < width - 1) pushIfWhite(x + 1, y)
    if (y > 0) pushIfWhite(x, y - 1)
    if (y < height - 1) pushIfWhite(x, y + 1)
  }
}

async function processHorizontal() {
  const file = path.join(brandDir, 'logo-horizontal.png')
  const { data, width, height } = await loadRgba(file)
  removeNearWhite(data, 20)
  await saveRgba(file, data, width, height)
  console.log('Processed horizontal logo')
}

async function processEmblem() {
  const file = path.join(brandDir, 'logo-emblem.png')
  const { data, width, height } = await loadRgba(file)
  removeEdgeWhite(data, width, height, 20)
  await saveRgba(file, data, width, height)
  console.log('Processed emblem logo')
}

await processHorizontal()
await processEmblem()
