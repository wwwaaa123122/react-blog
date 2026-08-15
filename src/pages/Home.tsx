import { Link } from "react-router-dom";
import { publishedPosts } from "../lib/posts";
import { siteConfig } from "../config/site";
import { formatDate } from "../lib/posts";
import { assetUrl } from "../lib/base";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";

const PostCard = ({ post, hero = false }: { post: typeof publishedPosts[0]; hero?: boolean }) => {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  if (hero) {
    return (
      <section className="mb-16">
        {cover && (
          <div className="mb-8 md:mb-16">
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
        <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
          <div>
            <h3 className="mb-4 text-4xl lg:text-5xl leading-tight font-bold">
              <Link
                to={"/posts/" + post.slug}
                className="hover:underline text-foreground"
              >
                {post.title}
              </Link>
            </h3>
            <div className="mb-4 md:mb-0 text-lg text-muted-foreground">
              <time>{formatDate(post.published)}</time>
            </div>
          </div>
          <div>
            <p className="text-lg leading-relaxed mb-4 text-muted-foreground">
              {post.description}
            </p>

          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      {cover && (
        <div className="mb-5">
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
      <h3 className="text-3xl mb-3 leading-snug font-bold">
        <Link
          to={"/posts/" + post.slug}
          className="hover:underline text-foreground"
        >
          {post.title}
        </Link>
      </h3>
      <div className="text-lg mb-4 text-muted-foreground">
        <time>{formatDate(post.published)}</time>
      </div>
      <p className="text-lg leading-relaxed mb-4 text-muted-foreground">
        {post.description}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={siteConfig.site_url + "/favicon.svg"}
          className="size-11 rounded-full"
          alt={siteConfig.author}
        />
        <div className="text-lg font-bold">{siteConfig.author}</div>
      </div>
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
        <section className="flex flex-col md:flex-row items-center md:justify-between mt-16 mb-16 md:mb-12">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
            Blog.
          </h1>
          <h4 className="text-center md:text-left text-lg mt-5 md:pl-8 text-muted-foreground">
            {siteConfig.subtitle} · 分享技术、生活与热爱
          </h4>
        </section>

        {/* Hero Post */}
        {heroPost && <PostCard post={heroPost} hero />}

        {/* More Stories */}
        {morePosts.length > 0 && (
          <section>
            <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
              More Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-20">
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
