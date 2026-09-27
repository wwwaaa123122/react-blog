// 文章封面的响应式变体解析。
//
// 封面原图最长边 1600px，但列表卡片实际只显示 96~484px CSS 宽。
// 直接把原图塞给列表意味着首页 8 张封面下载 ~800KB，而浏览器只需要 ~64KB。
//
// scripts/generate-thumbnails.mjs 为每张封面产出两档：
//   -thumb.webp  320px 宽  —— 首页/归档小缩略图（96~112px CSS，@2x = 224px）
//   -md.webp     760px 宽  —— 网格卡片（352~484px CSS，@2x ≈ 970px）
// 变体尺寸记录在 src/data/cover-thumbnails.json（构建期生成）。
import coverThumbs from "../data/cover-thumbnails.json";
import { assetUrl } from "./base";

interface Variant {
  suffix: string;
  width: number;
  height: number;
  bytes: number;
}
interface CoverEntry {
  src: string;
  srcW: number;
  srcH: number;
  srcBytes: number;
  variants: Variant[];
}

const thumbs = coverThumbs as unknown as Record<string, CoverEntry>;

/** 归一化封面路径：去掉 ../images/ 之类前缀，统一成 /images/xxx.webp */
export function normalizeCover(image?: string): string | undefined {
  if (!image) return undefined;
  return "/" + image.replace(/^\.\/|^(\.\.\/)+/, "").replace(/^\//, "");
}

/** 封面在 cover-thumbnails.json 中的记录（可能不存在） */
export function coverEntry(image?: string): CoverEntry | undefined {
  const key = normalizeCover(image);
  return key ? thumbs[key] : undefined;
}

/** 某个后缀（-thumb / -md）的变体 URL，不存在则回退原图路径 */
export function variantUrl(image: string | undefined, suffix: string): string | undefined {
  const base = normalizeCover(image);
  if (!base) return undefined;
  const v = coverEntry(image)?.variants.find((x) => x.suffix === suffix);
  return v ? base.replace(/\.webp$/, v.suffix + ".webp") : base;
}

export interface ResponsiveImage {
  /** 兜底地址（不支持 srcset 的旧客户端），取最大候选 */
  src: string;
  srcSet: string;
  /** 兜底的 sizes 值；调用方应传入自己的断点表达式覆盖 */
  sizes: string;
}

/**
 * 按候选展示宽度挑变体并拼 srcset。
 *
 * @param cssWidths 从窄到宽排列的各断点显示宽度（CSS px）
 *                  每个断点选"宽度 >= 2×cssWidth 且最小"的变体，去重后升序进 srcset
 *
 * `sizes` 由调用方直接传入：断点语义（min/max viewport）只有组件自己清楚，
 * 这里只负责把宽度换算成合适的候选。
 */
export function responsiveImage(
  image: string | undefined,
  cssWidths: number[]
): ResponsiveImage | undefined {
  const src = normalizeCover(image);
  if (!src) return undefined;
  const cover = coverEntry(image);

  const byWidth = (need: number): { url: string; w: number } => {
    const v = cover
      ?.variants.filter((x) => x.width >= need)
      .sort((a, b) => a.width - b.width)[0];
    return v
      ? { url: src.replace(/\.webp$/, v.suffix + ".webp"), w: v.width }
      : { url: src, w: 1600 };
  };

  const picked = new Map<string, number>();
  for (const cw of cssWidths) {
    const { url, w } = byWidth(cw * 2);
    if (!picked.has(url)) picked.set(url, w);
  }
  if (!picked.has(src)) picked.set(src, 1600);

  const entries = [...picked.entries()].sort((a, b) => a[1] - b[1]);
  return {
    src: entries[entries.length - 1][0],
    srcSet: entries.map(([url, w]) => `${url} ${w}w`).join(", "),
    sizes: `${cssWidths[cssWidths.length - 1]}px`,
  };
}

/**
 * 同 responsiveImage，但所有 URL 已套上部署 base（如 /react-blog/）。
 * @param sizes 调用方按自身布局断点传入的 sizes 表达式
 */
export function responsiveImageSrc(
  image: string | undefined,
  cssWidths: number[],
  sizes: string
): { src: string; srcSet: string; sizes: string } | undefined {
  const r = responsiveImage(image, cssWidths);
  if (!r) return undefined;
  return {
    src: assetUrl(r.src),
    srcSet: r.srcSet.split(",").map((part) => {
      const [u, w] = part.trim().split(/\s+/);
      return `${assetUrl(u)} ${w}`;
    }).join(", "),
    sizes,
  };
}
