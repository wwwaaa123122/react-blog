import { Link } from "react-router-dom";
import { publishedPosts, formatDate } from "../lib/posts";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";

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
        <Card key={year} className="mb-8 py-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {year} <Badge variant="secondary" className="text-xs">{posts.length} 篇</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup className="gap-0">
              {posts.map((post) => (
                <Item key={post.slug} size="sm" variant="muted" className="border-b border-border/50 last:border-b-0 px-0 py-2">
                  <ItemMedia className="shrink-0 text-xs text-muted-foreground tabular-nums w-20">
                    <time dateTime={post.published}>{formatDate(post.published)}</time>
                  </ItemMedia>
                  <ItemContent>
                    <Link className="text-sm font-medium text-foreground hover:text-primary transition-colors [overflow-wrap:anywhere]" to={"/posts/" + post.slug}>{post.title}</Link>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
