/**
 * One-off: hand-rasterize the brand mark (rounded navy square, cream V
 * chevron, terracotta dot — same shapes as src/app/icon.svg) and pack it
 * into a real favicon.ico, replacing the create-next-app/Vercel default.
 *
 * Pure Buffer math, no image libraries — next/og's ImageResponse hits a
 * known Windows bug (Invalid URL loading its default font) when used
 * outside a real Next.js request, so this avoids that dependency entirely.
 *
 * Run: node scripts/gen-favicon.cjs
 */
const { writeFileSync } = require("node:fs");
const zlib = require("node:zlib");

const NAVY = [0x1f, 0x3a, 0x4a];
const CREAM = [0xfa, 0xf6, 0xee];
const TERRACOTTA = [0xbd, 0x6b, 0x33];
const SUPERSAMPLE = 4;

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function roundedRectCoverage(x, y, w, h, r) {
  const dx = Math.max(0, Math.max(r - x, x - (w - r)));
  const dy = Math.max(0, Math.max(r - y, y - (h - r)));
  if (dx === 0 || dy === 0) return true; // inside the straight edges
  return dx * dx + dy * dy <= r * r;
}

// Renders at SUPERSAMPLE x resolution, then box-downsamples for AA edges.
function renderRGBA(size) {
  const hi = size * SUPERSAMPLE;
  const scale = hi / 64; // brand mark is authored in a 64x64 viewBox
  const strokeHalf = (8 / 2) * scale;
  const p1 = [15 * scale, 15 * scale];
  const p2 = [31 * scale, 43 * scale];
  const p3 = [47 * scale, 15 * scale];
  const dot = { cx: 50 * scale, cy: 46 * scale, r: 5.5 * scale };
  const cornerR = 14 * scale;

  const hiBuf = new Uint8ClampedArray(hi * hi * 4);
  for (let y = 0; y < hi; y += 1) {
    for (let x = 0; x < hi; x += 1) {
      const i = (y * hi + x) * 4;
      const px = x + 0.5;
      const py = y + 0.5;

      if (!roundedRectCoverage(px, py, hi, hi, cornerR)) {
        continue; // leave fully transparent outside the rounded square
      }

      let [r, g, b] = NAVY;

      const dSeg1 = distToSegment(px, py, p1[0], p1[1], p2[0], p2[1]);
      const dSeg2 = distToSegment(px, py, p2[0], p2[1], p3[0], p3[1]);
      if (Math.min(dSeg1, dSeg2) <= strokeHalf) {
        [r, g, b] = CREAM;
      }

      if (Math.hypot(px - dot.cx, py - dot.cy) <= dot.r) {
        [r, g, b] = TERRACOTTA;
      }

      hiBuf[i] = r;
      hiBuf[i + 1] = g;
      hiBuf[i + 2] = b;
      hiBuf[i + 3] = 255;
    }
  }

  // Box downsample hi -> size, averaging alpha-weighted color per block.
  const out = new Uint8ClampedArray(size * size * 4);
  const block = SUPERSAMPLE;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let by = 0; by < block; by += 1) {
        for (let bx = 0; bx < block; bx += 1) {
          const si = ((y * block + by) * hi + (x * block + bx)) * 4;
          const alpha = hiBuf[si + 3];
          r += hiBuf[si] * alpha;
          g += hiBuf[si + 1] * alpha;
          b += hiBuf[si + 2] * alpha;
          a += alpha;
        }
      }
      const oi = (y * size + x) * 4;
      if (a > 0) {
        out[oi] = r / a;
        out[oi + 1] = g / a;
        out[oi + 2] = b / a;
      }
      out[oi + 3] = a / (block * block);
    }
  }
  return out;
}

function rgbaToIcoBmpEntry(rgba, size) {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0); // biSize
  header.writeInt32LE(size, 4); // biWidth
  header.writeInt32LE(size * 2, 8); // biHeight (XOR+AND per ICO convention)
  header.writeUInt16LE(1, 12); // biPlanes
  header.writeUInt16LE(32, 14); // biBitCount
  header.writeUInt32LE(0, 16); // biCompression: BI_RGB
  header.writeUInt32LE(size * size * 4, 20); // biSizeImage
  header.writeInt32LE(0, 24);
  header.writeInt32LE(0, 28);
  header.writeUInt32LE(0, 32);
  header.writeUInt32LE(0, 36);

  // XOR data: bottom-up rows, BGRA byte order.
  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    const srcRow = size - 1 - y;
    for (let x = 0; x < size; x += 1) {
      const si = (srcRow * size + x) * 4;
      const di = (y * size + x) * 4;
      xor[di] = rgba[si + 2]; // B
      xor[di + 1] = rgba[si + 1]; // G
      xor[di + 2] = rgba[si]; // R
      xor[di + 3] = rgba[si + 3]; // A
    }
  }

  // AND mask: all zero bits — fully deferring transparency to the alpha
  // channel above, the standard approach for 32bpp Vista+ ICO entries.
  const rowBytes = Math.ceil(size / 8);
  const paddedRowBytes = Math.ceil(rowBytes / 4) * 4;
  const and = Buffer.alloc(paddedRowBytes * size, 0);

  return Buffer.concat([header, xor, and]);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function rgbaToPng(rgba, size) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowBytes = size * 4;
  const raw = Buffer.alloc((rowBytes + 1) * size);
  for (let y = 0; y < size; y += 1) {
    raw[y * (rowBytes + 1)] = 0; // filter: none
    raw.set(rgba.subarray(y * rowBytes, y * rowBytes + rowBytes), y * (rowBytes + 1) + 1);
  }
  const idatData = zlib.deflateSync(Buffer.from(raw));

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idatData),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function buildIco(entries) {
  const count = entries.length;
  const dirSize = 6 + 16 * count;
  const dir = Buffer.alloc(dirSize);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);

  let offset = dirSize;
  const chunks = [dir];
  entries.forEach(({ size, buffer }, i) => {
    const eo = 6 + i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, eo + 0);
    dir.writeUInt8(size >= 256 ? 0 : size, eo + 1);
    dir.writeUInt8(0, eo + 2);
    dir.writeUInt8(0, eo + 3);
    dir.writeUInt16LE(1, eo + 4);
    dir.writeUInt16LE(32, eo + 6);
    dir.writeUInt32LE(buffer.length, eo + 8);
    dir.writeUInt32LE(offset, eo + 12);
    offset += buffer.length;
    chunks.push(buffer);
  });

  return Buffer.concat(chunks);
}

function main() {
  const sizes = [16, 32, 48];
  const entries = sizes.map((size) => {
    const rgba = renderRGBA(size);
    return { size, buffer: rgbaToIcoBmpEntry(rgba, size) };
  });
  const ico = buildIco(entries);
  writeFileSync("src/app/favicon.ico", ico);
  console.log(`Wrote src/app/favicon.ico (${ico.length} bytes, sizes ${sizes.join("/")})`);

  const appleSize = 180;
  const applePng = rgbaToPng(renderRGBA(appleSize), appleSize);
  writeFileSync("public/apple-touch-icon.png", applePng);
  console.log(`Wrote public/apple-touch-icon.png (${applePng.length} bytes, ${appleSize}px)`);
}

main();
