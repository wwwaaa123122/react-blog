// 图片缩放：任意位图 -> WebP（限制最长边），用于压缩超出显示需求的超大封面图。
// 管线：原图 -> cwebp(临时 webp) -> dwebp -ppm(原始 PPM) -> 双线性缩放 -> cwebp 输出
// 用法: node .tmp/resize.mjs <input> <output> <maxLongEdge> <quality>
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, statSync, existsSync } from "node:fs";

const [, , input, output, maxEdgeStr, qStr] = process.argv;
const MAX_EDGE = parseInt(maxEdgeStr, 10);
const Q = qStr ? String(qStr) : "82";
const TMP = ".tmp/_resize";

// 1) 统一解码为 PPM（P6）：WebP 走 dwebp，其它格式先转 WebP 再 dwebp
const tmpWebp = TMP + "_in.webp";
try { unlinkSync(tmpWebp); } catch {}
if (!/\.(webp)$/i.test(input)) {
  execFileSync("cwebp", ["-q", "100", "-quiet", input, "-o", tmpWebp]);
  const src = tmpWebp;
  execFileSync("dwebp", ["-ppm", src, "-o", TMP + ".ppm"]);
} else {
  execFileSync("dwebp", ["-ppm", input, "-o", TMP + ".ppm"]);
}

// 2) 解析 PPM P6
const buf = readFileSync(TMP + ".ppm");
let off = 0;
const readToken = () => {
  while (off < buf.length && (buf[off] <= 32 || buf[off] === 35)) {
    // 跳过空白与 # 注释
    if (buf[off] === 35) { while (off < buf.length && buf[off] !== 10) off++; }
    off++;
  }
  let t = "";
  while (off < buf.length && buf[off] > 32) { t += String.fromCharCode(buf[off]); off++; }
  return t;
};
const magic = readToken();
if (magic !== "P6") throw new Error("不是 PPM P6 格式: " + magic);
const W = parseInt(readToken(), 10);
const H = parseInt(readToken(), 10);
const maxval = parseInt(readToken(), 10);
off++; // P6 头部后恰好一个空白字节
const srcData = buf.subarray(off);
if (srcData.length !== W * H * 3) throw new Error(`PPM 数据长度不符: ${srcData.length} != ${W * H * 3}`);

// 3) 计算目标尺寸（保持宽高比，最长边 = MAX_EDGE）
const longEdge = Math.max(W, H);
const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1;
const TW = Math.max(1, Math.round(W * scale));
const TH = Math.max(1, Math.round(H * scale));

// 4) 双线性重采样
const out = Buffer.alloc(TW * TH * 3);
for (let y = 0; y < TH; y++) {
  const sy = scale < 1 ? (y + 0.5) / scale - 0.5 : y;
  const y0 = Math.max(0, Math.min(H - 1, Math.floor(sy)));
  const y1 = Math.max(0, Math.min(H - 1, y0 + 1));
  const fy = sy - y0;
  for (let x = 0; x < TW; x++) {
    const sx = scale < 1 ? (x + 0.5) / scale - 0.5 : x;
    const x0 = Math.max(0, Math.min(W - 1, Math.floor(sx)));
    const x1 = Math.max(0, Math.min(W - 1, x0 + 1));
    const fx = sx - x0;
    for (let c = 0; c < 3; c++) {
      const i00 = (y0 * W + x0) * 3 + c;
      const i10 = (y0 * W + x1) * 3 + c;
      const i01 = (y1 * W + x0) * 3 + c;
      const i11 = (y1 * W + x1) * 3 + c;
      const top = srcData[i00] * (1 - fx) + srcData[i10] * fx;
      const bot = srcData[i01] * (1 - fx) + srcData[i11] * fx;
      out[(y * TW + x) * 3 + c] = Math.round(top * (1 - fy) + bot * fy);
    }
  }
}

// 5) 写回 PPM 并用 cwebp 编码
const header = Buffer.from(`P6\n${TW} ${TH}\n255\n`, "ascii");
writeFileSync(TMP + ".ppm", Buffer.concat([header, out]));
execFileSync("cwebp", ["-q", Q, "-quiet", TMP + ".ppm", "-o", output]);

const before = statSync(input).size;
const after = statSync(output).size;
console.log(`${input} ${W}x${H} -> ${TW}x${TH} q${Q}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
