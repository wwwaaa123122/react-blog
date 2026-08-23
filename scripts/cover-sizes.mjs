// 扫描 public 下的封面图，解析尺寸，输出 src/data/cover-sizes.json
// 供 og:image:width/height 使用（Open Graph 协议推荐标注图片尺寸）
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const PUBLIC = "public";
const OUT = "src/data/cover-sizes.json";

/** 解析图片宽高，支持 PNG / JPEG / WebP (VP8/VP8L/VP8X) / GIF */
function imageSize(buf) {
  // PNG: 8 字节签名 + IHDR (宽高各 4 字节大端)
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // GIF: 6 字节签名 + 宽高各 2 字节小端
  if (buf.length > 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }
  // JPEG: 扫描 SOF0/SOF1/SOF2 等标记（0xFFC0-0xFFCF，排除 DHT/DAC）
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0xd9) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
    return null;
  }
  // WebP: RIFF....WEBP
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const fourcc = buf.toString("ascii", 12, 16);
    if (fourcc === "VP8 ") {
      // lossy: 帧头 3 字节后 14-bit 宽高（小端）
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (fourcc === "VP8L") {
      // lossless: 4 字节中 14-bit (宽-1)/(高-1)
      const bits = buf.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (fourcc === "VP8X") {
      // extended: 24-bit (宽-1) 在 24-26，24-bit (高-1) 在 27-29
      const w = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
      const h = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
      return { w, h };
    }
    return null;
  }
  return null;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!existsSync(p)) continue;
    if (extname(p).toLowerCase() !== "") out.push(p);
    else if (p.split("/").pop().includes(".")) out.push(p);
  }
  return out;
}

const files = [...walk(PUBLIC), ...walk(join(PUBLIC, "images"))];

const sizes = {};
let failed = 0;

for (const file of files) {
  const rel = file.replace(/^public/, "").replace(/\\/g, "/").replace(/^\/\//, "/");
  const size = imageSize(readFileSync(file));
  if (size) {
    sizes[rel] = size;
  } else {
    console.warn(`[cover-sizes] 无法解析: ${rel}`);
    failed++;
  }
}

writeFileSync(OUT, JSON.stringify(sizes, null, 2) + "\n");
console.log(`[cover-sizes] ${Object.keys(sizes).length} 张图片尺寸 -> ${OUT}${failed ? ` (${failed} 失败)` : ""}`);
