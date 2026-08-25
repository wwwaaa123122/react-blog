// remark 插件：把 VuePress 风格容器块 :::warning … ::: 转换为
// <div class="admonition admonition-warning">…</div> 节点，
// 交给 Markdown 组件里的 div 渲染逻辑渲染成漂亮的提示卡片。
//
// 支持的写法（类型不区分大小写，允许 `::: warning` 带空格）：
//   :::warning
//   内容…
//   :::
//   :::tip 自定义标题
//   内容…
//   :::
// 内容可以是普通 markdown（段落 / 列表 / 代码块等），
// 自定义标题通过 data-admonition-title 传给渲染组件。
//
// 注意：CommonMark 下块内没有空行时，整个 :::…::: 会被合并进同一个段落
// （软换行留在 text 值里，行尾两个空格则产生 break 节点），
// 所以需要同时处理「合并成一段」和「拆成多段」两种形态。

const ADMONITION_TYPES = new Set([
  "warning",
  "danger",
  "caution",
  "tip",
  "tips",
  "success",
  "error",
  "note",
  "info",
]);

// 别名归一：tips -> tip（渲染时共用同一套图标/配色/标题）
const TYPE_ALIASES: Record<string, string> = { tips: "tip" };

/** 返回规范类型名（含别名归一）；不是支持的 admonition 类型时返回 null */
function canonicalType(name: string): string | null {
  const lower = name.toLowerCase();
  if (!ADMONITION_TYPES.has(lower)) return null;
  return TYPE_ALIASES[lower] ?? lower;
}

// mdast 节点的最小结构描述（避免引入 @types/mdast 依赖）
type MdNode = {
  type: string;
  children?: MdNode[];
  value?: string;
  data?: Record<string, unknown>;
};

/** 取段落的纯文本（仅拼接 text 子节点，忽略行内标记） */
function paragraphText(node: MdNode | undefined): string {
  if (!node || node.type !== "paragraph" || !Array.isArray(node.children)) {
    return "";
  }
  return node.children
    .map((child) => (child.type === "text" ? child.value ?? "" : ""))
    .join("");
}

// 开标记独占一段（后面跟了空行）：:::warning 或 :::warning 标题
// 注意：标题前的分隔只能用空格/Tab（[ \t]+），不能用 \s —— \s 含换行，
// 会把「合并成一段」形态里紧跟开标记的内容行误当成标题
const OPEN_RE = /^:::\s*([a-z]+)(?:[ \t]+([^\n]+?))?\s*$/i;
// 开标记出现在段落开头（与内容合并成一段）：只匹配到行尾
const OPEN_START_RE = /^:::\s*([a-z]+)(?:[ \t]+([^\n]*?))?\s*(?=\n|$)/i;
// 闭合标记独占一段
const CLOSE_RE = /^:::\s*$/;

function makeAdmonition(type: string, title: string, inner: MdNode[]): MdNode {
  return {
    type: "admonition",
    children: inner,
    data: {
      hName: "div",
      hProperties: {
        className: ["admonition", `admonition-${type}`],
        ...(title ? { "data-admonition-title": title } : {}),
      },
    },
  };
}

// 形态 A：块内没有空行，整个 :::…::: 被 CommonMark 合并进同一个段落。
// 直接在段落内部剥离开/闭标记，剩余子节点即内容（行内格式如 **加粗** 完整保留）。
function extractMerged(node: MdNode): { type: string; title: string; inner: MdNode[] } | null {
  const kids = node.children ?? [];
  const textIndexes: number[] = [];
  kids.forEach((child, i) => {
    if (child.type === "text") textIndexes.push(i);
  });
  if (!textIndexes.length) return null;

  const firstIdx = textIndexes[0];
  const lastIdx = textIndexes[textIndexes.length - 1];
  const firstValue = kids[firstIdx].value ?? "";
  const lastValue = kids[lastIdx].value ?? "";

  const open = firstValue.match(OPEN_START_RE);
  const openType = open ? canonicalType(open[1]) : null;
  if (!open || !openType) return null;
  // 段落末尾必须是闭合的 :::
  if (!lastValue.replace(/\s+$/, "").endsWith(":::")) return null;

  const type = openType;
  const title = (open[2] ?? "").trim();

  const inner: MdNode[] = [];
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (k.type !== "text") {
      inner.push(k);
      continue;
    }
    let value = k.value ?? "";
    // 剥离开标记（含行尾空白）与行首换行
    if (i === firstIdx) value = value.slice(open[0].length).replace(/^\n+/, "");
    // 剥离行尾换行与闭合 :::
    if (i === lastIdx) value = value.replace(/\s*:::\s*$/, "");
    if (value !== "") inner.push({ ...k, value });
  }
  // 去掉开/闭标记行留下的换行 break（段落首尾各一个）
  while (inner.length && inner[0].type === "break") inner.shift();
  while (inner.length && inner[inner.length - 1].type === "break") inner.pop();

  return { type, title, inner };
}

export default function remarkAdmonitions() {
  return (tree: MdNode) => {
    const children = tree.children ?? [];
    const out: MdNode[] = [];
    let i = 0;

    while (i < children.length) {
      const node = children[i];

      if (node.type === "paragraph") {
        // 形态 A：整个块合并成一段
        const merged = extractMerged(node);
        if (merged) {
          out.push(makeAdmonition(merged.type, merged.title, merged.inner));
          i++;
          continue;
        }

        // 形态 B：开标记独占一段（块内有空行），收集到闭合的 ::: 为止
        const open = paragraphText(node).match(OPEN_RE);
        const openType = open ? canonicalType(open[1]) : null;
        if (open && openType) {
          const type = openType;
          const title = (open[2] ?? "").trim();
          i++;
          const inner: MdNode[] = [];
          let closed = false;
          while (i < children.length) {
            const n = children[i];
            if (n.type === "paragraph" && CLOSE_RE.test(paragraphText(n))) {
              closed = true;
              i++;
              break;
            }
            inner.push(n);
            i++;
          }
          if (closed) {
            out.push(makeAdmonition(type, title, inner));
            continue;
          }
          // 未闭合：原样还原，避免吞掉后续内容
          out.push(node, ...inner);
          continue;
        }
      }

      out.push(node);
      i++;
    }

    tree.children = out;
  };
}
