// 图片体积优化（可重复执行，幂等）：
//   1. PNG/JPG → WebP（按内容类型选码率：截图含密集文字用 88 防糊，插画/封面 82）
//   2. 最长边 > 1600px 的图片缩放到 1600px（显示容器上限 1120px，@2x 也只需 2240px）
//   3. 重编码后自动更新 src 内的扩展名引用
//   4. 删除完全未被 src 引用的图片（cover-sizes.json 是生成物，不计入引用）
//
// 前置依赖：cwebp / dwebp（WebP 工具链）
// 用法: node scripts/optimize-images.mjs [--dry-run]
import { execFileSync } from "node:child_process";
import {
  readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, renameSync, existsSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PUBLIC = join(ROOT, "public");
const DRY = process.argv.includes("--dry-run");
const MAX_EDGE = 1600;

const sizeOf = (p) => (existsSync(p) ? statSync(p).size : 0);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "pipe" });

/** 解析图片尺寸（PNG/JPEG/WebP/GIF），失败返回 null */
function imageSize(buf) {
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xd8 || m === 0xd9) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const f = buf.toString("ascii", 12, 16);
    if (f === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (f === "VP8L") { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
    if (f === "VP8X") {
      return { w: 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16), h: 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16) };
    }
  }
  return null;
}

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

/** src 中是否引用了该图片（按文件名匹配；cover-sizes.json 为生成物，跳过） */
function isReferenced(basename) {
  for (const f of walk(join(ROOT, "src"))) {
    if (statSync(f).isDirectory() || f.endsWith("cover-sizes.json")) continue;
    if (readFileSync(f, "utf-8").includes(basename)) return true;
  }
  return readFileSync(join(ROOT, "index.html"), "utf-8").includes(basename);
}

/** WebP/PNG/JPG → WebP，返回 { out, before, after }；未变小则清理并返回 null */
function toWebp(rel, q) {
  const src = join(PUBLIC, rel);
  const out = rel.replace(/\.(png|jpe?g|webp)$/i, ".webp");
  const outPath = join(PUBLIC, out);
  const before = sizeOf(src);
  run("cwebp", ["-q", String(q), "-quiet", src, "-o", outPath]);
  const after = sizeOf(outPath);
  if (after >= before) {
    if (outPath !== src && existsSync(outPath)) unlinkSync(outPath);
    return null;
  }
  if (!DRY) {
    renameSync(outPath, outPath + ".tmp");
    renameSync(outPath + ".tmp", outPath);
    if (src !== outPath) unlinkSync(src);
  }
  return { from: rel, to: out, before, after };
}

// ---------- 第 1 步：删除未引用图片 ----------
const deleted = [];
for (const f of walk(PUBLIC)) {
  if (!/\.(png|jpe?g|webp|gif|svg)/i.test(f)) continue;
  const rel = f.slice(PUBLIC.length + 1).replace(/\\/g, "/");
  if (!isReferenced(join(...rel.split("/")).split("/").pop())) {
    const b = sizeOf(f);
    if (!DRY) unlinkSync(f);
    deleted.push({ rel, before: b });
    console.log(`[del] ${rel}: -${(b / 1024).toFixed(0)}KB（未被引用）`);
  }
}

// ---------- 第 2 步：PNG/JPG → WebP ----------
const converted = [];
for (const f of walk(PUBLIC)) {
  if (!/\.(png|jpe?g)/i.test(f)) continue;
  if (/(^|\/)(favicon|apple-touch-icon)\.png$/.test(f)) continue; // 浏览器图标需保留 PNG
  const rel = f.slice(PUBLIC.length + 1).replace(/\\/g, "/");
  // 截图类文件名含密集文字，用更高码率防糊
  const q = /screenshot|archlinux|kick|tunelbroker/i.test(rel) ? 88 : 82;
  const r = toWebp(rel, q);
  if (r) converted.push(r);
  else console.log(`[skip] ${rel}（转 WebP 未变小）`);
}

// ---------- 第 3 步：超长边图片缩放 ----------
const resized = [];
for (const f of walk(PUBLIC)) {
  if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
  const rel = f.slice(PUBLIC.length + 1).replace(/\\/g, "/");
  const dim = imageSize(readFileSync(f));
  // 小图跳过：二维码/长截图等窄高图缩小会损失可扫描性，收益也仅几 KB
  if (!dim || Math.max(dim.w, dim.h) <= MAX_EDGE || sizeOf(f) < 100 * 1024) continue;
  const before = sizeOf(f);
  const tmp = join(ROOT, ".tmp", "resize-" + rel.replace(/[\/.]/g, "_"));
  if (!DRY) {
    run("node", [join(ROOT, "scripts/resize-image.mjs"), f, f + ".new", String(MAX_EDGE), "82"]);
    const after = sizeOf(f + ".new");
    if (after >= before) { unlinkSync(f + ".new"); console.log(`[skip] ${rel}（缩放未变小）`); continue; }
    renameSync(f + ".new", f + ".tmp"); renameSync(f + ".tmp", f);
    resized.push({ rel, before, after, from: `${dim.w}x${dim.h}`, to: `${MAX_EDGE}x${Math.round(dim.h * MAX_EDGE / Math.max(dim.w, dim.h))}` });
    console.log(`[resize] ${rel}: ${dim.w}x${dim.h} -> 最长边 ${MAX_EDGE}, ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
  } else {
    console.log(`[dry]  ${rel}: ${dim.w}x${dim.h} 待缩放到 ${MAX_EDGE}`);
  }
}

// ---------- 第 4 步：更新 src 中的扩展名引用 ----------
const renames = converted.filter((c) => c.from !== c.to);
if (renames.length && !DRY) {
  for (const f of walk(join(ROOT, "src")).filter((p) => !statSync(p).isDirectory())) {
    if (!/\.(md|tsx|ts|json|html)$/.test(f)) continue;
    let t = readFileSync(f, "utf-8");
    const o = t;
    for (const r of renames) t = t.split(r.from).join(r.to);
    if (t !== o) { writeFileSync(f, t); console.log(`[ref] ${f.slice(ROOT.length + 1)}`); }
  }
  // index.html 也可能引用图片
  const idx = join(ROOT, "index.html");
  let t = readFileSync(idx, "utf-8");
  const o = t;
  for (const r of renames) t = t.split(r.from).join(r.to);
  if (t !== o) { writeFileSync(idx, t); console.log("[ref] index.html"); }
}

// ---------- 汇总 ----------
const saved =
  deleted.reduce((s, d) => s + d.before, 0) +
  converted.reduce((s, c) => s + (c.before - c.after), 0) +
  resized.reduce((s, c) => s + (c.before - c.after), 0);
console.log(`\n删除 ${deleted.length} 张, 转格式 ${converted.length} 张, 缩放 ${resized.length} 张, 共省 ${(saved / 1024 / 1024).toFixed(2)}MB`);
if (converted.length || resized.length) console.log("（记得重建 cover-sizes.json：node scripts/cover-sizes.mjs）");
