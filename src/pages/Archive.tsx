import { Link } from "react-router-dom";
import { publishedPosts, formatDate } from "../lib/posts";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Card } from "@/components/ui/card";
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

      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-[0.5px]">归档</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          共 {publishedPosts.length} 篇文章 · 按年份归档
        </p>
      </div>

      <Card className="px-7 py-5">
        {years.map(([year, posts]) => (
          <section key={year}>
            <h2 className="mb-3.5 mt-6 flex items-center gap-2.5 text-[19px] font-extrabold first:mt-0">
              {year}
              <Badge variant="secondary" className="text-[12.5px]">
                {posts.length} 篇
              </Badge>
            </h2>
            <ul className="list-none">
              {posts.map((post) => (
                <li
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-dashed border-border px-1 py-2.5"
                  key={post.slug}
                >
                  <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
                    {formatDate(post.published)}
                  </span>
                  <Link
                    className="min-w-0 text-[15px] font-medium text-foreground transition-colors hover:text-primary [overflow-wrap:anywhere]"
                    to={"/posts/" + post.slug}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Card>
    </>
  );
}
