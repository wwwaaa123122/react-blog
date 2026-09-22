import { Link } from "react-router-dom";
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
      <div className="py-20">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <p className="text-6xl font-bold tracking-tight text-muted-foreground/60">404</p>
            <EmptyTitle className="text-lg font-bold mt-2">页面飞走了</EmptyTitle>
            <EmptyDescription>你访问的页面不存在或已被移除</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap justify-center gap-3">
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
