// 构建期的 Markdown → HTML 渲染器（仅在 Node 中运行：scripts/build-content.mts）。
//
// 文章是静态内容，没必要让每个访客的浏览器都下载 react-markdown / remark / rehype /
// highlight.js（约 340 KB JS）再重新解析一遍。这里在构建时把 Markdown 编译成 HTML，
// 客户端只负责插入这段 HTML（见 components/Markdown.tsx）。
//
// 该文件不得被任何浏览器端代码 import —— 它存在的前提就是「不进 bundle」。
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { rewriteImagePaths } from "./paths";
import { assetUrl } from "./base";
import remarkAdmonitions from "./remark-admonition";
import { createSlugger } from "./slug";
import {
  CircleCheck,
  CircleX,
  Copy,
  Check,
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

// 代码块的复制按钮是纯 DOM 交互（客户端 Markdown 组件用事件委托处理），
// 所以这里输出 data-* 钩子 + 两个静态图标，由 CSS 切换显示状态。
function CodeBlock({
  lang,
  highlighted,
}: {
  lang: string;
  highlighted: ReactNode;
}) {
  return (
    <div className="code-block my-4 overflow-hidden rounded-lg border border-border">
      {/* 头部：macOS 装饰圆点 + shadcn Badge（语言）+ Button（复制），固定在外部不随代码滚动 */}
      <div className="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-chart-3/70" />
            <span className="size-2 rounded-full bg-chart-5/70" />
          </div>
          <Badge variant="secondary" size="xs-mono">
            {lang || "code"}
          </Badge>
        </div>
        <Button
          variant="muted"
          size="xs"
          type="button"
          data-copy-code=""
          data-copied="false"
          aria-label="复制代码"
          aria-live="polite"
        >
          <Copy data-icon="inline-start" data-copy-icon="" />
          <Check data-icon="inline-start" data-check-icon="" />
          <span data-copy-label="">复制</span>
        </Button>
      </div>
      <Separator />
      {/* 代码区：独立横向滚动；highlighted 保留 rehype-highlight 生成的 span，
          code 纯文本供复制按钮使用（data-code 避免从高亮 span 里还原文本） */}
      <pre className="!m-0 !rounded-none !border-0 overflow-x-auto" tabIndex={0}>
        <code className={"language-" + lang}>{highlighted}</code>
      </pre>
    </div>
  );
}

// ===== 提示卡片（:::warning 等 admonition 容器）=====

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

export default function MarkdownRenderer({ content }: { content: string }) {
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
        return <CodeBlock lang={lang} highlighted={child.props.children} />;
      }
      // 普通 pre（非代码块）保持原样
      return <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-card-nested p-4">{children}</pre>;
    },
    // 让 <code> 自带的 pre 不干扰
    code: ({ className, children }: any) => {
      // 含 language- 类的是代码块，返回裸 code 供 pre 处理（类名顺序不固定）
      if (className && /\blanguage-/.test(className)) {
        return <code className={className}>{children}</code>;
      }
      // 行内 code — 带背景和颜色，不加 border 避免像代码块
      return <code className="px-1.5 py-0.5 rounded-none bg-muted/70 text-primary font-medium text-sm">{children}</code>;
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
