import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 回到顶部：shadcn Button（圆形 + 阴影）+ Tooltip 提示
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="回到顶部"
            className={
              "fixed bottom-6 right-5 z-40 rounded-full bg-background/90 shadow-lg backdrop-blur transition-all duration-200 " +
              (visible
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0")
            }
          >
            <ArrowUp className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">回到顶部</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
