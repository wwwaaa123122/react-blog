// 为文章封面生成响应式缩略图，减少列表页与首页的下载量。
//
// 背景：封面原图最长边 1600px，但列表卡片实际只显示 96~484px CSS 宽。
// 直接加载原图意味着首页 8 张封面下载 ~800KB，实际只需要 ~64KB。
//
// 生成两档：
//   - <name>-thumb.webp  320px 宽  —— 首页/归档的 96~112px 缩略图（@2x = 224px）
//   - <name>-md.webp     760px 宽  —— 卡片封面（网格 352~484px CSS，@2x ≈ 970px，
//                                     760px 与原图差异肉眼不可辨且省一半流量）
// 尺寸信息写入 src/data/cover-thumbnails.json 供组件拼 srcset。
//
// 重要：缩略图与清单都已提交进 git，CI（Cloudflare Pages）只有 node/pnpm、
// 没有 cwebp/dwebp，因此**不会**重新生成。脚本先探测工具，缺失时直接跳过并
// 保留仓库里已提交的产物；只有真正干活时才覆写 cover-thumbnails.json，
// 避免 CI 上把清单刷成空对象导致构建失败。
//
// 用法: node scripts/generate-thumbnails.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PUBLIC = join(ROOT, "public");
const OUT = join(ROOT, "src/data/cover-thumbnails.json");
const TMP = join(ROOT, ".tmp");

/** 探测外部图片工具是否可用（CI 环境通常没有） */
function hasTool(cmd) {
  try {
    execFileSync(cmd, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const haveWebpTools = hasTool("cwebp") && hasTool("dwebp");
if (!haveWebpTools) {
  console.log(
    `[skip] 未找到 cwebp/dwebp，跳过缩略图生成（CI 环境）。` +
      (existsSync(OUT) ? ` 沿用已提交的 ${OUT.replace(ROOT + "/", "")}` : ` 警告：${OUT.replace(ROOT + "/", "")} 不存在，响应式变体将回退原图`)
  );
  process.exit(0);
}

mkdirSync(TMP, { recursive: true });

const SIZES = [
  { suffix: "-thumb", width: 320, q: 80 },
  { suffix: "-md", width: 760, q: 82 },
];

function sizeOf(p) { return existsSync(p) ? statSync(p).size : 0; }

// 解析图片尺寸
function imageSize(buf) {
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const f = buf.toString("ascii", 12, 16);
    if (f === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (f === "VP8L") { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
    if (f === "VP8X") return { w: 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16), h: 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16) };
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

// 只处理文章封面：src/posts/*.md 的 image 字段引用的图
const postFiles = readdirSync(join(ROOT, "src/posts")).filter((f) => f.endsWith(".md"));
const covers = new Set();
for (const f of postFiles) {
  const md = readFileSync(join(ROOT, "src/posts", f), "utf-8");
  const m = md.match(/^image:\s*['"]?(.+?)['"]?\s*$/m);
  if (m) {
    let p = m[1].trim();
    if (p.startsWith("./") || p.startsWith("../")) p = p.replace(/^\.\/|^\.\.\//, "");
    covers.add("/" + p.replace(/^\//, ""));
  }
}

const result = {};
let generated = 0;
let skipped = 0;

for (const rel of [...covers].sort()) {
  const src = join(ROOT, "public", rel);
  if (!existsSync(src)) { console.log(`[skip] 不存在: ${rel}`); continue; }
  const dim = imageSize(readFileSync(src));
  if (!dim) { console.log(`[skip] 无法解析尺寸: ${rel}`); continue; }
  const srcSize = sizeOf(src);
  const entry = { src: rel, srcW: dim.w, srcH: dim.h, srcBytes: srcSize, variants: [] };

  for (const { suffix, width, q } of SIZES) {
    // 源图已经比目标小就不生成
    if (dim.w <= width) { console.log(`[skip] ${rel}: 源图 ${dim.w}px <= ${width}px`); skipped++; continue; }
    const tmp = join(ROOT, ".tmp", "thumb-" + rel.replace(/[\/.]/g, "_"));
    const dst = join(ROOT, "public", rel.replace(/\.webp$/, suffix + ".webp"));
    try {
      execFileSync("node", [join(ROOT, "scripts/resize-image.mjs"), src, tmp, String(width), String(q)], { stdio: "pipe" });
      const dstSize = sizeOf(tmp);
      if (dstSize >= srcSize * 0.6) {
        // 缩略图没省出足够体积（源图本身很小），跳过避免徒增文件
        console.log(`[skip] ${rel}${suffix}: ${(dstSize/1024).toFixed(0)}KB 未显著小于原图`);
        skipped++;
        continue;
      }
      // 原子替换
      renameSync(tmp, dst + ".tmp");
      renameSync(dst + ".tmp", dst);
      const d2 = imageSize(readFileSync(dst));
      entry.variants.push({ suffix, width, height: d2?.h ?? 0, bytes: dstSize });
      generated++;
      console.log(`[ok] ${rel}${suffix}.webp: ${width}px, ${(dstSize/1024).toFixed(0)}KB (原 ${(srcSize/1024).toFixed(0)}KB)`);
    } catch (e) {
      console.log(`[fail] ${rel}${suffix}: ${String(e.message).split("\n")[0]}`);
      skipped++;
    }
  }

  if (entry.variants.length) result[rel] = entry;
}

// 安全检查：不覆写已有清单为空对象（本地工具异常时不能把 CI 依赖的数据刷掉）
const prevEntries = existsSync(OUT)
  ? Object.keys(JSON.parse(readFileSync(OUT, "utf-8"))).length
  : 0;
if (prevEntries > 0 && Object.keys(result).length === 0) {
  console.warn(`[warn] 本次未生成任何变体，保留已有清单（${prevEntries} 条），不覆写`);
  process.exit(1);
}
writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`\n生成 ${generated} 个缩略图, 跳过 ${skipped} 个 -> ${OUT.replace(ROOT + "/", "")}`);
