import { Fragment } from "react";
import { Link } from "../lib/router";
import {
  Breadcrumb as Crumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrumbJsonLd, jsonLd } from "../lib/seo";

export interface Crumb {
  label: string;
  to?: string;
}

// 面包屑导航（shadcn/ui 组件，含 schema.org BreadcrumbList JSON-LD）
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  const all = [{ label: "首页", to: "/" }, ...items];

  return (
    <>
      <Crumb className="mb-4">
        <BreadcrumbList>
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <Fragment key={i}>
                <BreadcrumbItem
                  className={
                    last && all.length > 2 ? "hidden min-w-0 sm:inline-flex" : last ? "min-w-0" : undefined
                  }
                >
                  {!last && item.to ? (
                    <BreadcrumbLink asChild>
                      <Link
                        to={item.to}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    // 末级可能是长文章标题：外层包一层做单行截断，
                    // 避免在移动端把面包屑折成两行（标题下方紧接着就是 h1）
                    <span className={last ? "block max-w-64 truncate md:max-w-none" : undefined}>
                      <BreadcrumbPage variant="emphasized">{item.label}</BreadcrumbPage>
                    </span>
                  )}
                </BreadcrumbItem>
                {!last && (
                  <BreadcrumbSeparator
                    className={i === all.length - 2 && all.length > 2 ? "hidden sm:flex" : undefined}
                  />
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Crumb>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbJsonLd(all)),
        }}
      />
    </>
  );
}
