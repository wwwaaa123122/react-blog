var e=`<div class="markdown"><h2 class="markdown-h1" id="本文章分为两部分">本文章分为两部分</h2>
<h3 id="适配多语言的404界面">适配多语言的404界面</h3>
<p>打开<strong>src/i18n/i18nKey.ts</strong></p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">typescript</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-typescript">	license = <span class="hljs-string">&quot;license&quot;</span>,
	friends = <span class="hljs-string">&quot;friends&quot;</span>,

	<span class="hljs-comment">// 404 page</span>
	notFound = <span class="hljs-string">&quot;notFound&quot;</span>,
	notFoundTitle = <span class="hljs-string">&quot;notFoundTitle&quot;</span>,
	notFoundMessage = <span class="hljs-string">&quot;notFoundMessage&quot;</span>,
	backToHome = <span class="hljs-string">&quot;backToHome&quot;</span>,
	viewArchive = <span class="hljs-string">&quot;viewArchive&quot;</span>,
</code></pre></div>
<p>再分别打开languages下的<strong>en.ts</strong>和<strong>zh_CN.ts</strong><br/>
en.ts</p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">typescript</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-typescript">	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">license</span>]: <span class="hljs-string">&quot;License&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">friends</span>]: <span class="hljs-string">&quot;Friends&quot;</span>,

	<span class="hljs-comment">// 404 page</span>
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFound</span>]: <span class="hljs-string">&quot;Page Not Found&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFoundTitle</span>]: <span class="hljs-string">&quot;Oops! Page Not Found&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFoundMessage</span>]: <span class="hljs-string">&quot;The page you are looking for doesn&#x27;t exist. It may have been moved or deleted.&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">backToHome</span>]: <span class="hljs-string">&quot;Back to Home&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">viewArchive</span>]: <span class="hljs-string">&quot;View Archive&quot;</span>,
</code></pre></div>
<p>zh_CN.ts</p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">typescript</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-typescript">	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">license</span>]: <span class="hljs-string">&quot;许可协议&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">friends</span>]: <span class="hljs-string">&quot;友链&quot;</span>,

	<span class="hljs-comment">// 404 page</span>
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFound</span>]: <span class="hljs-string">&quot;页面未找到&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFoundTitle</span>]: <span class="hljs-string">&quot;哎呀！页面走丢了&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">notFoundMessage</span>]: <span class="hljs-string">&quot;您访问的页面不存在，可能已被删除或链接有误。&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">backToHome</span>]: <span class="hljs-string">&quot;返回首页&quot;</span>,
	[<span class="hljs-title class_">Key</span>.<span class="hljs-property">viewArchive</span>]: <span class="hljs-string">&quot;查看归档&quot;</span>,
</code></pre></div>
<p>最后在<strong>src/pages</strong>目录下创建<strong>404.astro</strong></p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">astro</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-astro">---
import { Icon } from &quot;astro-icon/components&quot;;
import MainGridLayout from &quot;../layouts/MainGridLayout.astro&quot;;
import I18nKey from &quot;../i18n/i18nKey&quot;;
import { i18n } from &quot;../i18n/translation&quot;;
import { url } from &quot;../utils/url-utils&quot;;
import { siteConfig } from &quot;../config&quot;;
---

<span class="hljs-tag">&lt;<span class="hljs-name">MainGridLayout</span> <span class="hljs-attr">title</span>=<span class="hljs-string">{i18n(I18nKey.notFound)}</span> <span class="hljs-attr">description</span>=<span class="hljs-string">{i18n(I18nKey.notFoundMessage)}</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-96&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;card-base z-10 px-6 md:px-12 py-8 md:py-12 relative w-full&quot;</span>&gt;</span>
            <span class="hljs-comment">&lt;!-- 404 Content --&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex flex-col items-center text-center space-y-6&quot;</span>&gt;</span>
                <span class="hljs-comment">&lt;!-- Large 404 Number --&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;relative opacity-0 animate-fade-in-up&quot;</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-8xl md:text-9xl font-bold bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] bg-clip-text text-transparent select-none&quot;</span>&gt;</span>
                        404
                    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                    <span class="hljs-comment">&lt;!-- Decorative elements --&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute -top-4 -right-4 w-8 h-8 bg-[var(--primary)] rounded-full opacity-20 animate-pulse&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute -bottom-2 -left-2 w-6 h-6 bg-[var(--primary)] rounded-full opacity-30 animate-pulse&quot;</span> <span class="hljs-attr">style</span>=<span class="hljs-string">&quot;animation-delay: 0.5s;&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                <span class="hljs-comment">&lt;!-- Title and Message --&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;space-y-3 max-w-md opacity-0 animate-fade-in-up animate-delay-100&quot;</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">h1</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-2xl md:text-3xl font-bold text-[var(--primary)]&quot;</span>&gt;</span>
                        {i18n(I18nKey.notFoundTitle)}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-75 text-base md:text-lg leading-relaxed&quot;</span>&gt;</span>
                        {i18n(I18nKey.notFoundMessage)}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                <span class="hljs-comment">&lt;!-- Illustration --&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;py-4 opacity-0 animate-fade-in-up animate-delay-200&quot;</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;relative w-32 h-32 mx-auto animate-float&quot;</span>&gt;</span>
                        <span class="hljs-comment">&lt;!-- Simple geometric illustration --&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] rounded-full opacity-10&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute inset-4 bg-[var(--card-bg)] rounded-full border-2 border-[var(--primary)] border-opacity-20&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute inset-0 flex items-center justify-center&quot;</span>&gt;</span>
                            <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:location-crosshairs&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;w-12 h-12 text-[var(--primary)] opacity-60&quot;</span> /&gt;</span>
                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                <span class="hljs-comment">&lt;!-- Action Buttons --&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex flex-col sm:flex-row gap-3 pt-4 opacity-0 animate-fade-in-up animate-delay-300&quot;</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">{url(</span>&quot;/&quot;)} 
                       <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;btn-regular px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2&quot;</span>&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:house&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;w-4 h-4&quot;</span> /&gt;</span>
                        {i18n(I18nKey.backToHome)}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">{url(</span>&quot;/<span class="hljs-attr">archive</span>&quot;)} 
                       <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]&quot;</span>&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:box-archive&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;w-4 h-4&quot;</span> /&gt;</span>
                        {i18n(I18nKey.viewArchive)}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">{url(</span>&quot;/<span class="hljs-attr">about</span>&quot;)} 
                       <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]&quot;</span>&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:circle-info&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;w-4 h-4&quot;</span> /&gt;</span>
                        {i18n(I18nKey.about)}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                <span class="hljs-comment">&lt;!-- Additional Help Text --&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;pt-6 text-sm text-50&quot;</span>&gt;</span>
                    <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;transition-all duration-300&quot;</span>&gt;</span>
                        {siteConfig.lang === &#x27;zh_CN&#x27; ? &#x27;如果您认为这是一个错误，请联系网站管理员。&#x27; : &#x27;If you believe this is an error, please contact the site administrator.&#x27;}
                    <span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">MainGridLayout</span>&gt;</span>

<span class="hljs-tag">&lt;<span class="hljs-name">style</span>&gt;</span><span class="css">
    <span class="hljs-keyword">@keyframes</span> float {
        <span class="hljs-number">0%</span>, <span class="hljs-number">100%</span> { <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">translateY</span>(<span class="hljs-number">0px</span>); }
        <span class="hljs-number">50%</span> { <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">translateY</span>(-<span class="hljs-number">10px</span>); }
    }
    
    <span class="hljs-keyword">@keyframes</span> fadeInUp {
        <span class="hljs-selector-tag">from</span> {
            <span class="hljs-attribute">opacity</span>: <span class="hljs-number">0</span>;
            <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">translateY</span>(<span class="hljs-number">30px</span>);
        }
        <span class="hljs-selector-tag">to</span> {
            <span class="hljs-attribute">opacity</span>: <span class="hljs-number">1</span>;
            <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">translateY</span>(<span class="hljs-number">0</span>);
        }
    }
    
    <span class="hljs-selector-class">.animate-float</span> {
        <span class="hljs-attribute">animation</span>: float <span class="hljs-number">3s</span> ease-in-out infinite;
    }
    
    <span class="hljs-selector-class">.animate-fade-in-up</span> {
        <span class="hljs-attribute">animation</span>: fadeInUp <span class="hljs-number">0.6s</span> ease-out forwards;
    }
    
    <span class="hljs-selector-class">.animate-delay-100</span> {
        <span class="hljs-attribute">animation-delay</span>: <span class="hljs-number">0.1s</span>;
    }
    
    <span class="hljs-selector-class">.animate-delay-200</span> {
        <span class="hljs-attribute">animation-delay</span>: <span class="hljs-number">0.2s</span>;
    }
    
    <span class="hljs-selector-class">.animate-delay-300</span> {
        <span class="hljs-attribute">animation-delay</span>: <span class="hljs-number">0.3s</span>;
    }
    
    <span class="hljs-selector-class">.animate-delay-400</span> {
        <span class="hljs-attribute">animation-delay</span>: <span class="hljs-number">0.4s</span>;
    }
</span><span class="hljs-tag">&lt;/<span class="hljs-name">style</span>&gt;</span>
</code></pre></div>
<h3 id="单语言404-astro">单语言404.astro</h3>
<p>此方法直接在<strong>src/pages</strong>目录下创建404.astro即可<br/>
由于我没有语言的404，这里附上二叉树树的404界面<br/>
预览：<img src="/react-blog/images/2x-404.webp" alt="2x-404" loading="lazy" decoding="async"/></p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">astro</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-astro">---
import Layout from &quot;@/layouts/Layout.astro&quot;;
import MainGridLayout from &quot;@/layouts/MainGridLayout.astro&quot;;
import { Icon } from &quot;astro-icon/components&quot;;
import { siteConfig } from &quot;@/config&quot;;
---

<span class="hljs-tag">&lt;<span class="hljs-name">Layout</span> <span class="hljs-attr">title</span>=<span class="hljs-string">&quot;页面未找到&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">MainGridLayout</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex flex-col items-center justify-center min-h-[60vh] text-center px-4&quot;</span>&gt;</span>
                        <span class="hljs-comment">&lt;!-- 404 图标 --&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;mb-8&quot;</span>&gt;</span>
                                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;relative&quot;</span>&gt;</span>
                                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-8xl md:text-9xl font-bold text-[var(--primary)] opacity-20&quot;</span>&gt;</span>
                                                404
                                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;absolute inset-0 flex items-center justify-center&quot;</span>&gt;</span>
                                                <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:face-sad-tear&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-6xl md:text-7xl text-[var(--primary)]&quot;</span> /&gt;</span>
                                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                        <span class="hljs-comment">&lt;!-- 错误信息 --&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;card-base p-8 max-w-md mx-auto mb-8&quot;</span>&gt;</span>
                                <span class="hljs-tag">&lt;<span class="hljs-name">h1</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-2xl md:text-3xl font-bold text-90 mb-4&quot;</span>&gt;</span>
                                        页面走丢了
                                <span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
                                <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;text-75 mb-6 leading-relaxed&quot;</span>&gt;</span>
                                        抱歉，您访问的页面不存在或已被移动。
                                        <span class="hljs-tag">&lt;<span class="hljs-name">br</span>&gt;</span>
                                        请检查URL是否正确，或者返回首页继续浏览。
                                <span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>

                                <span class="hljs-comment">&lt;!-- 导航按钮 --&gt;</span>
                                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex flex-col sm:flex-row gap-3 justify-center&quot;</span>&gt;</span>
                                        <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;btn-regular-dark px-6 py-3 rounded-lg text-white font-medium&quot;</span>&gt;</span>
                                                <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:house&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;mr-2&quot;</span> /&gt;</span>
                                                返回首页
                                        <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
                                        <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/archive/&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;btn-regular px-6 py-3 rounded-lg font-medium&quot;</span>&gt;</span>
                                                <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:box-archive&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;mr-2&quot;</span> /&gt;</span>
                                                文章归档
                                        <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
                                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

                        <span class="hljs-comment">&lt;!-- 返回提示 --&gt;</span>
                        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;mt-8 text-50 text-sm&quot;</span>&gt;</span>
                                <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;flex items-center justify-center&quot;</span>&gt;</span>
                                        <span class="hljs-tag">&lt;<span class="hljs-name">Icon</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;fa6-solid:clock-rotate-left&quot;</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;mr-2&quot;</span> /&gt;</span>
                                        您也可以使用浏览器的后退按钮返回上一页
                                <span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
                        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">MainGridLayout</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">Layout</span>&gt;</span>
</code></pre></div></div>`,t=[{level:2,text:`本文章分为两部分`,id:`本文章分为两部分`},{level:3,text:`适配多语言的404界面`,id:`适配多语言的404界面`},{level:3,text:`单语言404.astro`,id:`单语言404-astro`}],n={html:e,toc:t};export{n as default,e as html,t as toc};