import { Link } from "react-router-dom";
import { publishedPosts, formatDate } from "../lib/posts";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";

function formatMonthDay(d: string): string {
  if (!d) return "";
  const parts = d.split(/[-/]/);
  if (parts.length >= 3) {
    return `${parts[1]}-${parts[2].slice(0, 2)}`;
  }
  return formatDate(d);
}

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
      <Seo title="归档" description="全部文章按年份归档" path="/archive/" />
      <Breadcrumb items={[{ label: "归档", to: "/archive/" }]} />
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">归档</h1>
        <p className="text-sm text-muted-foreground">共 {publishedPosts.length} 篇文章 · 按年份归档</p>
      </div>
      {years.map(([year, posts]) => (
        <div key={year} className="cv-auto mb-8">
        <Card className="mb-0">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              <span className="flex items-center gap-2">
                {year} <Badge variant="secondary" size="xs">{posts.length} 篇</Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup size="flush">
              {posts.map((post) => (
                <Item key={post.slug} size="flush" variant="muted-divided">
                  <ItemMedia variant="meta" className="w-16 shrink-0">
                    <time dateTime={post.published}>{formatMonthDay(post.published)}</time>
                  </ItemMedia>
                  <ItemContent>
                    <div className="flex items-center justify-between gap-2">
                      <Link className="text-sm font-medium text-foreground hover:text-primary transition-colors break-words" to={"/posts/" + post.slug}>
                        {post.title}
                      </Link>
                      {post.category && (
                        <span className="hidden sm:inline shrink-0">
                          <Badge variant="secondary" size="2xs">
                            {post.category}
                          </Badge>
                        </span>
                      )}
                    </div>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
        </div>
      ))}
    </>
  );
}
