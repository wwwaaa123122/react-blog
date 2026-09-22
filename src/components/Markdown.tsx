import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { rewriteImagePaths } from "../lib/posts";
import { assetUrl } from "../lib/base";
import remarkAdmonitions from "../lib/remark-admonition";
import {
  Check,
  CircleCheck,
  CircleX,
  Copy,
  Info,
  Lightbulb,
  OctagonAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");
}

// GitHub 风格的标题 id 去重：重复的标题追加 -1、-2… 后缀，
// 保证锚点唯一（同一文档内按出现顺序调用）
export function createSlugger(): (text: string) => string {
  const used = new Set<string>();
  return (text: string) => {
    const base = slugify(text);
    if (!used.has(base)) {
      used.add(base);
      return base;
    }
    let i = 1;
    while (used.has(`${base}-${i}`)) i++;
    const id = `${base}-${i}`;
    used.add(id);
    return id;
  };
}

// 递归提取 heading 的纯文本：标题里若含 <code>/<strong>/<a> 等行内元素，
// String(children) 会得到 "[object Object]" 导致锚点 id 与目录 href 失配
function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: React.ReactNode } }).props;
    return headingText(props?.children);
  }
  return "";
}

const HIGHLIGHT_SUBSET = [
  "javascript", "typescript", "jsx", "tsx", "bash", "shell", "json",
  "markdown", "css", "html", "xml", "python", "yaml", "dockerfile",
  "ini", "diff", "sql", "java", "nginx", "powershell",
  // 博客文章中实际使用的语言（此前缺失导致不高亮）
  "stylus", "toml",
];

// astro/svelte 不是 highlight.js 注册语言，但文章里大量使用；
// 映射到 markup/xml 语法高亮（注册方向：已注册语言 -> 别名列表）
const HIGHLIGHT_ALIASES = { xml: ["astro", "svelte"] };

// 递归提取代码块纯文本：高亮后的 children 是 hljs span 元素数组，
// String(children) 会得到 "[object Object]" 导致复制内容损坏
function codeText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(codeText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return codeText((node as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

function CodeBlock({
  lang,
  code,
  highlighted,
}: {
  lang: string;
  code: string;
  highlighted: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch {
      const ta = document.createElement("textarea");
      ta.value = code; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 overflow-hidden rounded-[var(--radius)] border border-border">
      {/* 头部：shadcn Badge（语言）+ Button（复制），固定在外部不随代码滚动 */}
      <div className="flex items-center justify-between gap-2 bg-muted/50 px-3 py-1.5">
        <Badge variant="secondary" className="font-mono text-[11px]">
          {lang || "code"}
        </Badge>
        <Button
          variant="ghost"
          size="xs"
          onClick={copy}
          aria-label={copied ? "已复制" : "复制代码"}
          aria-live="polite"
          className="text-muted-foreground"
        >
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? "已复制" : "复制"}
        </Button>
      </div>
      <Separator />
      {/* 代码区：独立横向滚动；highlighted 保留 rehype-highlight 生成的 span，
          code 纯文本供复制按钮使用 */}
      <pre className="!m-0 !rounded-none !border-0 overflow-x-auto" tabIndex={0}>
        <code className={"language-" + lang}>{highlighted}</code>
      </pre>
    </div>
  );
}

// ===== 提示卡片（:::warning 等 admonition 容器）=====
// 使用 shadcn Alert 渲染，语义色统一由组件库的 token 提供

type AdmonitionType =
  | "warning"
  | "danger"
  | "caution"
  | "tip"
  | "success"
  | "error"
  | "note"
  | "info";

const ADMONITION_META: Record<
  AdmonitionType,
  { icon: LucideIcon; defaultTitle: string }
> = {
  warning: { icon: TriangleAlert, defaultTitle: "警告" },
  danger: { icon: OctagonAlert, defaultTitle: "危险" },
  caution: { icon: OctagonAlert, defaultTitle: "小心" },
  tip: { icon: Lightbulb, defaultTitle: "提示" },
  success: { icon: CircleCheck, defaultTitle: "成功" },
  error: { icon: CircleX, defaultTitle: "错误" },
  note: { icon: Info, defaultTitle: "注意" },
  info: { icon: Info, defaultTitle: "信息" },
};

// 各类型的图标与 shadcn Alert 语义色（Alert 只有 default / destructive 两个 variant，
// 其余语义色按组件库的写法用文字色 + 描述色覆盖）
const ADMONITION_STYLE: Record<AdmonitionType, string> = {
  warning: "text-chart-3 *:data-[slot=alert-description]:text-chart-3/90",
  caution: "text-chart-3 *:data-[slot=alert-description]:text-chart-3/90",
  danger: "text-destructive *:data-[slot=alert-description]:text-destructive/90",
  error: "text-destructive *:data-[slot=alert-description]:text-destructive/90",
  success: "text-chart-5 *:data-[slot=alert-description]:text-chart-5/90",
  tip: "text-primary *:data-[slot=alert-description]:text-primary/90",
  note: "text-primary *:data-[slot=alert-description]:text-primary/90",
  info: "text-primary *:data-[slot=alert-description]:text-primary/90",
};

function Admonition({
  type,
  title,
  children,
}: {
  type: string;
  title?: string;
  children: ReactNode;
}) {
  const key = (type as AdmonitionType) in ADMONITION_META ? (type as AdmonitionType) : "warning";
  const meta = ADMONITION_META[key];
  const Icon = meta.icon;
  return (
    <Alert className={`my-4 ${ADMONITION_STYLE[key]}`}>
      <Icon />
      <AlertTitle>{title || meta.defaultTitle}</AlertTitle>
      <AlertDescription className="[&_p:first-child]:mt-1">{children}</AlertDescription>
    </Alert>
  );
}

export default function Markdown({ content }: { content: string }) {
  // 每次渲染新建 slugger：同一文档内标题 id 唯一（重复标题追加 -1/-2）
  const slug = createSlugger();
  const components: Components = {
    // 拦截 <pre>，检测子元素是否为代码块
    pre: ({ children }) => {
      const child = children as any;
      const cls = child?.props?.className as string | undefined;
      // rehype-highlight 生成的类名形如 "hljs language-typescript"（hljs 在前），
      // 必须用词边界匹配而非 startsWith，否则所有代码块都会退化为普通 pre
      if (cls && /\blanguage-/.test(cls)) {
        const lang = cls.match(/language-([\w+-]+)/)?.[1] ?? "";
        const code = codeText(child.props.children).replace(/\n$/, "");
        return <CodeBlock lang={lang} code={code} highlighted={child.props.children} />;
      }
      // 普通 pre（非代码块）保持原样
      return <pre className="my-4 overflow-x-auto rounded-[var(--radius)] border border-border bg-card-nested p-4">{children}</pre>;
    },
    // 让 <code> 自带的 pre 不干扰
    code: ({ className, children }: any) => {
      // 含 language- 类的是代码块，返回裸 code 供 pre 处理（类名顺序不固定）
      if (className && /\blanguage-/.test(className)) {
        return <code className={className}>{children}</code>;
      }
      // 行内 code — 带背景和颜色，不加 border 避免像代码块
      return <code className="px-1.5 py-0.5 rounded bg-muted/70 text-primary font-medium text-[0.88em]">{children}</code>;
    },
    a: ({ href, children }: any) => {
      const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
      return (
        <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer noopener" : undefined}>
          {children}
        </a>
      );
    },
    // remarkAdmonitions 生成的提示卡片：<div class="admonition admonition-warning">
    // 注意：不要解构 key —— React 会把 key 从 props 中摘走，组件内拿不到
    div: ({ node, className, children, ...props }: any) => {
      const cls =
        typeof className === "string"
          ? className
          : Array.isArray(className)
            ? className.join(" ")
            : "";
      if (/\badmonition\b/.test(cls)) {
        const type = cls.match(/admonition-([a-z]+)/)?.[1] ?? "warning";
        const title =
          typeof node?.properties?.["data-admonition-title"] === "string"
            ? node.properties["data-admonition-title"]
            : "";
        return (
          <Admonition type={type} title={title}>
            {children}
          </Admonition>
        );
      }
      // 普通 div 原样透传（不把 hast node 传给 DOM）
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    },
    img: ({ src, alt }: any) => (
      <img src={assetUrl(rewriteImagePaths(src || ""))} alt={alt || ""} loading="lazy" decoding="async" />
    ),
    // 文章正文里的 # 标题降级为 h2：页面已有文章标题作为唯一的 h1，
    // 避免文档大纲出现多个同级 h1（对读屏与大纲结构友好）
    h1: ({ children }) => (
      <h2 className="markdown-h1" id={slug(headingText(children))}>
        {children}
      </h2>
    ),
    h2: ({ children }) => <h2 id={slug(headingText(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slug(headingText(children))}>{children}</h3>,
    h4: ({ children }) => <h4 id={slug(headingText(children))}>{children}</h4>,
  };

  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkAdmonitions]} rehypePlugins={[[rehypeHighlight, { subset: HIGHLIGHT_SUBSET, aliases: HIGHLIGHT_ALIASES }]]} components={components}>
        {rewriteImagePaths(content)}
      </ReactMarkdown>
    </div>
  );
}
