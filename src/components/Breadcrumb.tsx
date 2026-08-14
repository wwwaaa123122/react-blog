import { Link } from "react-router-dom";
import { breadcrumbJsonLd, jsonLd } from "../lib/seo";

export interface Crumb {
  label: string;
  to?: string;
}

// 面包屑导航（含 schema.org BreadcrumbList JSON-LD）
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  const all = [{ label: "首页", to: "/" }, ...items];

  return (
    <nav aria-label="面包屑" className="breadcrumb">
      <ol>
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i}>
              {!last && item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>{item.label}</span>
              )}
              {!last && <span className="breadcrumb-sep">/</span>}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbJsonLd(all)),
        }}
      />
    </nav>
  );
}
