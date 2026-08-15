import { Link } from "react-router-dom";
import { publishedPosts } from "../lib/posts";
import { siteConfig } from "../config/site";
import { formatDate } from "../lib/posts";
import { assetUrl } from "../lib/base";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";

const PostCard = ({ post }: { post: typeof publishedPosts[0] }) => {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <div>
      {cover && (
        <div className="mb-4">
          <Link to={"/posts/" + post.slug}>
            <img
              src={cover}
              alt={post.title}
              className="w-full rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md"
              loading="lazy"
            />
          </Link>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 leading-snug">
        <Link to={"/posts/" + post.slug} className="hover:underline text-foreground">
          {post.title}
        </Link>
      </h3>
      <div className="text-sm text-muted-foreground mb-3">
        <time>{formatDate(post.published)}</time>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {post.description}
      </p>
    </div>
  );
};

export default function Home() {
  const allPosts = publishedPosts;
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <>
      <Seo
        title={siteConfig.title}
        description={siteConfig.description}
        path="/"
        keywords={siteConfig.keywords}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }}
      />

      <main>
        {/* Intro */}
        <section className="flex flex-col md:flex-row items-center md:justify-between mt-12 mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight md:pr-8">
            {siteConfig.title}
          </h1>
          <p className="text-center md:text-left text-base mt-3 md:mt-0 md:pl-8 text-muted-foreground">
            {siteConfig.subtitle}
          </p>
        </section>

        {/* Hero Post — 第一篇突出显示 */}
        {heroPost && (
          <section className="mb-12 md:mb-16">
            {(() => {
              const cover = heroPost.image
                ? assetUrl(heroPost.image.replace(/\.\.\/images\//, "/images/"))
                : undefined;
              return (
                <>
                  {cover && (
                    <div className="mb-6">
                      <Link to={"/posts/" + heroPost.slug}>
                        <img
                          src={cover}
                          alt={heroPost.title}
                          className="w-full rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md"
                          loading="lazy"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="md:grid md:grid-cols-2 md:gap-12">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
                        <Link to={"/posts/" + heroPost.slug} className="hover:underline text-foreground">
                          {heroPost.title}
                        </Link>
                      </h2>
                      <div className="text-sm text-muted-foreground">
                        <time>{formatDate(heroPost.published)}</time>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {heroPost.description}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </section>
        )}

        {/* 最新文章 */}
        {morePosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">最新文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5 mb-12">
              {morePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
