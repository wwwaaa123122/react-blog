import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

// 回到顶部：shadcn Button（圆形 + 主色），移动端更靠边、不遮挡正文。
// 刻意不套 Tooltip：触屏没有 hover，长按还会弹出系统菜单，反而碍事。
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      variant="default"
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="回到顶部"
      title="回到顶部"
      className={
        // safe-area-inset：viewport-fit=cover 后内容会延伸到刘海/横条区域，
        // 用环境变量把按钮抬离底部安全区，避免挡住全面屏手势条
        "fixed bottom-4 right-4 z-40 size-10 rounded-full shadow-lg ring-1 ring-foreground/10 transition-all duration-200 sm:bottom-6 sm:right-6 sm:size-11 " +
        "[bottom:calc(1rem+env(safe-area-inset-bottom))] sm:[bottom:calc(1.5rem+env(safe-area-inset-bottom))] " +
        "[right:calc(1rem+env(safe-area-inset-right))] sm:[right:calc(1.5rem+env(safe-area-inset-right))] " +
        (visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      <ArrowUp className="size-4 sm:size-5" />
    </Button>
  );
}
