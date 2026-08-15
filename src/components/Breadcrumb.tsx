import { Link } from "react-router-dom";
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
              <BreadcrumbItem key={i}>
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
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                )}
                {!last && <BreadcrumbSeparator />}
              </BreadcrumbItem>
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
