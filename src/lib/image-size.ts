import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface ImageSize {
  width: number;
  height: number;
}

const cache = new Map<string, Promise<ImageSize | undefined>>();

export function imageSize(src: string): Promise<ImageSize | undefined> {
  if (!src.startsWith('/')) return Promise.resolve(undefined);
  let pending = cache.get(src);
  if (!pending) {
    pending = readSize(src);
    cache.set(src, pending);
  }
  return pending;
}

async function readSize(src: string): Promise<ImageSize | undefined> {
  const file = path.join(process.cwd(), 'public', decodeURIComponent(src));
  let bytes: Buffer;
  try {
    bytes = await readFile(file);
  } catch {
    console.warn(`[image-size] 파일이 없어 width/height를 생략합니다: public${src}`);
    return undefined;
  }
  const size = parsePng(bytes) ?? parseWebp(bytes) ?? parseJpeg(bytes) ?? parseGif(bytes);
  if (!size) console.warn(`[image-size] 크기를 읽지 못해 width/height를 생략합니다: public${src}`);
  return size;
}

function parsePng(b: Buffer): ImageSize | undefined {
  if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') return undefined;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function parseGif(b: Buffer): ImageSize | undefined {
  if (b.length < 10 || b.toString('ascii', 0, 4) !== 'GIF8') return undefined;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

// WebP: RIFF 컨테이너의 첫 청크 종류(VP8 손실 / VP8L 무손실 / VP8X 확장)에 따라 크기 필드 위치가 다르다.
function parseWebp(b: Buffer): ImageSize | undefined {
  if (b.length < 30 || b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') {
    return undefined;
  }
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  }
  return undefined;
}

// JPEG: 세그먼트를 순서대로 건너뛰다 SOFn 마커(C0–CF, C4/C8/CC 제외)에서 높이·너비를 읽는다.
function parseJpeg(b: Buffer): ImageSize | undefined {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return undefined;
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return undefined;
    const marker = b[offset + 1];
    const standalone = marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8);
    if (standalone) {
      offset += 2;
      continue;
    }
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
    }
    offset += 2 + b.readUInt16BE(offset + 2);
  }
  return undefined;
}
