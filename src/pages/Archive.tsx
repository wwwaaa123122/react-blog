import { Link } from "../lib/router";
import { publishedPosts, formatDate } from "../lib/posts";
import { profileConfig } from "../config/profile";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { PageHeader, SectionHeading } from "../components/page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";

function formatMonthDay(d: string): string {
  if (!d) return "";
  const parts = d.split(/[-/]/);
  if (parts.length >= 3) {
    return `${parts[1]}-${parts[2].slice(0, 2)}`;
  }
  return formatDate(d);
}

// 归档结构是静态的：构建完成后年份分组不会变，算一次即可
// （此前每次渲染都重建 Map 并重新排序）
const years = (() => {
  const byYear = new Map<string, typeof publishedPosts>();
  for (const post of publishedPosts) {
    const year = post.published.slice(0, 4) || "未知";
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }
  return Array.from(byYear.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
})();

export default function Archive() {
  return (
    <>
      <Seo
        title="归档"
        description="全部文章按年份归档"
        path="/archive/"
        ogImage={profileConfig.avatar}
      />
      <Breadcrumb items={[{ label: "归档", to: "/archive/" }]} />
      <PageHeader
        title="归档"
        description={`共 ${publishedPosts.length} 篇文章 · 按年份归档`}
      />
      {years.map(([year, posts]) => (
        <div key={year} className="cv-auto mb-6">
          {/* 年份卡片：标题下方一条分隔线，行与行之间只用发丝线，
              不再给每行铺底色 —— 底色会把列表切成一块块"表格行" */}
          <Card size="flush">
            <div className="border-b border-border px-4 py-3">
              <SectionHeading className="mb-0" meta={`${posts.length} 篇`}>
                {year}
              </SectionHeading>
            </div>
            <div className="px-4 pb-1.5">
            <ItemGroup size="flush">
              {posts.map((post) => (
                <Item key={post.slug} variant="divided" size="flush">
                  <ItemMedia variant="meta" className="w-11 shrink-0">
                    <time dateTime={post.published}>{formatMonthDay(post.published)}</time>
                  </ItemMedia>
                  <ItemContent>
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        to={"/posts/" + post.slug}
                      >
                        {post.title}
                      </Link>
                      {post.category && (
                        <span className="hidden shrink-0 sm:inline">
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
            </div>
          </Card>
        </div>
      ))}
    </>
  );
}
