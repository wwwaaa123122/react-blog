import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
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

function CodeBlock({ className, children, ...props }: React.ComponentProps<"code">) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");
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
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground bg-muted/50 border-b border-border rounded-t-[var(--radius)]">
        <span>{lang || "code"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={copied ? "已复制" : "复制代码"}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className="text-[11px]">{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <code className={className} {...props}>{children}</code>
    </div>
  );
}

export default function Markdown({ content }: { content: string }) {
  const components: Components = {
    code: CodeBlock as any,
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
