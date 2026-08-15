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
  const years = Array.from(byYear.entries()).sort((a, b) =>
    a[0] < b[0] ? 1 : -1
  );

  return (
    <>
      <Seo title="归档" description="全部文章按年份归档" path="/archive" />
      <Breadcrumb items={[{ label: "归档", to: "/archive" }]} />

      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-2">
          归档
        </h1>
        <p className="text-lg text-muted-foreground">
          共 {publishedPosts.length} 篇文章 · 按年份归档
        </p>
      </div>

      {years.map(([year, posts]) => (
        <section key={year} className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
            {year}
            <Badge variant="secondary" className="text-sm">{posts.length} 篇</Badge>
          </h2>
          <ul className="list-none">
            {posts.map((post) => (
              <li
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-dashed border-border py-3"
                key={post.slug}
              >
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {formatDate(post.published)}
                </span>
                <Link
                  className="min-w-0 text-lg font-medium text-foreground transition-colors hover:text-primary [overflow-wrap:anywhere]"
                  to={"/posts/" + post.slug}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
