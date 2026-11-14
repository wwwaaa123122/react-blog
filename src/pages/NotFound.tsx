import { Link } from "../lib/router";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="404" description="页面不存在或已被移除" noindex />
      <div className="mx-auto max-w-lg py-20">
        <Empty variant="solid">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <h1 className="text-5xl font-bold tracking-tight text-muted-foreground tabular-nums">404</h1>
            <EmptyTitle variant="icon" className="mt-2">页面飞走了</EmptyTitle>
            <EmptyDescription>你访问的页面不存在或已被移除</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {/* 移动端纵向堆叠居中，PC 端并排（布局类在容器上，按钮保持设计系统尺寸） */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild>
                <Link to="/"><Home data-icon="inline-start" className="size-4" /> 回到首页</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/posts"><BookOpen data-icon="inline-start" className="size-4" /> 浏览文章</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </>
  );
}
