import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-[880px] px-5">
        <div className="py-16 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            {siteConfig.subtitle}
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2 gap-4">
            <a
              href="/"
              className="mx-3 bg-foreground hover:bg-foreground/80 text-background font-bold py-3 px-12 lg:px-8 duration-200 transition-colors text-sm rounded-lg"
            >
              {siteConfig.author}
            </a>
            <a
              href="https://github.com/wwwaaa123122"
              target="_blank"
              rel="noreferrer noopener"
              className="mx-3 font-bold hover:underline text-sm"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
