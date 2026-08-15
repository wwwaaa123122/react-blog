import { Link } from "react-router-dom";
import { publishedPosts, formatDate } from "../lib/posts";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Badge } from "@/components/ui/badge";

export default function Archive() {
  const byYear = new Map<string, typeof publishedPosts>();
  for (const post of publishedPosts) {
    const year = post.published.slice(0, 4) || "未知";
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }
  const years = Array.from(byYear.entries()).sort((a, b) => a[0] < b[0] ? 1 : -1);

  return (
    <>
      <Seo title="归档" description="全部文章按年份归档" path="/archive" />
      <Breadcrumb items={[{ label: "归档", to: "/archive" }]} />
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">归档</h1>
        <p className="text-sm text-muted-foreground">共 {publishedPosts.length} 篇文章 · 按年份归档</p>
      </div>
      {years.map(([year, posts]) => (
        <section key={year} className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            {year} <Badge variant="secondary" className="text-xs">{posts.length} 篇</Badge>
          </h2>
          <ul className="space-y-1">
            {posts.map((post) => (
              <li className="flex items-baseline gap-3 py-2 border-b border-border/50" key={post.slug}>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums w-20">{formatDate(post.published)}</span>
                <Link className="text-sm font-medium text-foreground hover:text-primary transition-colors [overflow-wrap:anywhere]" to={"/posts/" + post.slug}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
