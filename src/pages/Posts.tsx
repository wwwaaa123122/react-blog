import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

const PAGE_SIZE = 6;

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const tags = getAllTags();

  const filtered = useMemo(() => {
    let list = publishedPosts;
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [tag, keyword]);

  useEffect(() => {
    setPage(1);
  }, [tag, keyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pagePosts = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTag = (t: string) => {
    if (t === tag) {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", t);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <Seo
        title="文章"
        description={
          publishedPosts.length +
          " 篇技术文章，涵盖服务器部署、内网穿透、Cloudflare、容器化等主题"
        }
        path="/posts"
      />
      <Breadcrumb items={[{ label: "文章", to: "/posts" }]} />

      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-[0.5px]">文章</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          共 {publishedPosts.length} 篇文章 · 分享技术、生活与热爱
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索文章标题、描述或内容…"
          className="h-11 rounded-full pl-11 pr-11 text-[14.5px]"
        />
        {keyword && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            onClick={() => setKeyword("")}
            aria-label="清除搜索"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant={tag === "" ? "default" : "secondary"} asChild>
          <button type="button" className="cursor-pointer" onClick={() => selectTag("")}>
            全部
          </button>
        </Badge>
        {tags.map((t) => (
          <Badge key={t} variant={tag === t ? "default" : "secondary"} asChild>
            <button type="button" className="cursor-pointer" onClick={() => selectTag(t)}>
              {t}
            </button>
          </Badge>
        ))}
      </div>

      {pagePosts.length === 0 ? (
        <Card className="py-14 text-center text-muted-foreground">
          <div className="flex justify-center opacity-50">
            <Search className="size-11" />
          </div>
          <p className="mt-2">没有找到相关文章，换个关键词试试吧</p>
        </Card>
      ) : (
        pagePosts.map((post) => <PostCard key={post.slug} post={post} />)
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <Button
              variant="outline"
              size="icon"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              aria-label="上一页"
            >
              <ChevronLeft />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === current ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
              aria-label="下一页"
            >
              <ChevronRight />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
