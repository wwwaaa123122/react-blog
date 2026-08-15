import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import type { ReactElement } from "react";
import { rewriteImagePaths } from "../lib/posts";
import { assetUrl } from "../lib/base";
import { Check, Copy } from "lucide-react";

export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");
}

const HIGHLIGHT_SUBSET = [
  "javascript", "typescript", "jsx", "tsx", "bash", "shell", "json",
  "markdown", "css", "html", "xml", "python", "yaml", "dockerfile",
  "ini", "diff", "sql", "java", "nginx", "powershell",
];

function CodeBlock({ lang, code }: { lang: string; code: string }) {
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
    <div className="my-4 rounded-[var(--radius)] border border-border overflow-hidden">
      {/* Header — 固定在外部，不随代码滚动 */}
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground bg-muted/50 border-b border-border">
        <span className="font-medium">{lang || "code"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={copied ? "已复制" : "复制代码"}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className="text-[11px]">{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      {/* 代码区 — 独立横向滚动 */}
      <pre className="!m-0 !border-0 !rounded-none overflow-x-auto" tabIndex={0}>
        <code className={"language-" + lang}>{code}</code>
      </pre>
    </div>
  );
}

export default function Markdown({ content }: { content: string }) {
  const components: Components = {
    // 拦截 <pre>，检测子元素是否为代码块
    pre: ({ children }) => {
      const child = children as ReactElement;
      if (child?.props?.className?.startsWith?.("language-")) {
        const lang = child.props.className.replace("language-", "");
        const code = String(child.props.children || "").replace(/\n$/, "");
        return <CodeBlock lang={lang} code={code} />;
      }
      // 普通 pre（非代码块）保持原样
      return <pre className="my-4 rounded-[var(--radius)] border border-border bg-muted/50 p-4 overflow-x-auto">{children}</pre>;
    },
    // 让 <code> 自带的 pre 不干扰
    code: ({ className, children, ...props }) => {
      // 如果 className 以 language- 开头，说明是代码块，返回裸 code 供 pre 处理
      if (className?.startsWith?.("language-")) {
        return <code className={className} {...props}>{children}</code>;
      }
      // 行内 code
      return <code className="px-1.5 py-0.5 rounded bg-muted border border-border text-[0.88em] text-primary" {...props}>{children}</code>;
    },
    a: ({ href, children, ...props }) => {
      const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
      return (
        <a href={href} {...props} {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
          {children}
        </a>
      );
    },
    img: ({ src, alt, ...props }) => (
      <img src={assetUrl(rewriteImagePaths(src || ""))} alt={alt || ""} loading="lazy" {...props} />
    ),
    h2: ({ children }) => <h2 id={slugify(String(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(String(children))}>{children}</h3>,
    h4: ({ children }) => <h4 id={slugify(String(children))}>{children}</h4>,
  };

  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { subset: HIGHLIGHT_SUBSET }]]} components={components}>
        {rewriteImagePaths(content)}
      </ReactMarkdown>
    </div>
  );
}
