import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { rewriteImagePaths } from "../lib/posts";

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const HIGHLIGHT_SUBSET = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "bash",
  "shell",
  "json",
  "markdown",
  "css",
  "html",
  "xml",
  "python",
  "yaml",
  "dockerfile",
  "ini",
  "diff",
  "sql",
  "java",
  "nginx",
  "powershell",
];

export default function Markdown({ content }: { content: string }) {
  const components: Components = {
    a: ({ href, children, ...props }) => {
      const isExternal =
        href && (href.startsWith("http://") || href.startsWith("https://"));
      return (
        <a
          href={href}
          {...props}
          {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt, ...props }) => (
      <img src={rewriteImagePaths(src || "")} alt={alt || ""} loading="lazy" {...props} />
    ),
    h2: ({ children }) => (
      <h2 id={slugify(String(children))}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 id={slugify(String(children))}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 id={slugify(String(children))}>{children}</h4>
    ),
  };

  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { subset: HIGHLIGHT_SUBSET }]]}
        components={components}
      >
        {rewriteImagePaths(content)}
      </ReactMarkdown>
    </div>
  );
}
