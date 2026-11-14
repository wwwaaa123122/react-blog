var e=`<div class="markdown"><h2 class="markdown-h1" id="前言">前言</h2>
<p>啊大家都知道，fuwari的RSS如果你用的是相对路径，那么生成的RSS将也是相对路径，但这样就看不了图了啊，所以本章将带你修复它</p>
<h2 class="markdown-h1" id="修改rss配置文件">修改RSS配置文件</h2>
<p>打开<strong>src/pages/rss.xml.ts</strong>，当然你也可以直接删了<br/>
直接一个全选删除再将下面的配置粘贴填入</p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">typescript</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-typescript"><span class="hljs-keyword">import</span> rss <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@astrojs/rss&#x27;</span>;
<span class="hljs-keyword">import</span> sanitizeHtml <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;sanitize-html&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">MarkdownIt</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;markdown-it&#x27;</span>;
<span class="hljs-keyword">import</span> { getCollection } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;astro:content&#x27;</span>;
<span class="hljs-keyword">import</span> { siteConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@/config&#x27;</span>;
<span class="hljs-keyword">import</span> { parse <span class="hljs-keyword">as</span> htmlParser } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;node-html-parser&#x27;</span>;
<span class="hljs-keyword">import</span> { getImage } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;astro:assets&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">APIContext</span>, <span class="hljs-title class_">ImageMetadata</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;astro&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">RSSFeedItem</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@astrojs/rss&#x27;</span>;
<span class="hljs-keyword">import</span> { getSortedPosts } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@/utils/content-utils&#x27;</span>;

<span class="hljs-keyword">const</span> markdownParser = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MarkdownIt</span>();

<span class="hljs-comment">// get dynamic import of images as a map collection</span>
<span class="hljs-keyword">const</span> imagesGlob = <span class="hljs-keyword">import</span>.<span class="hljs-property">meta</span>.<span class="hljs-property">glob</span>&lt;{ <span class="hljs-attr">default</span>: <span class="hljs-title class_">ImageMetadata</span> }&gt;(
	<span class="hljs-string">&#x27;/src/content/**/*.{jpeg,jpg,png,gif,webp}&#x27;</span>, <span class="hljs-comment">// include posts and assets</span>
);

<span class="hljs-keyword">export</span> <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">GET</span>(<span class="hljs-params"><span class="hljs-attr">context</span>: <span class="hljs-title class_">APIContext</span></span>) {
	<span class="hljs-keyword">if</span> (!context.<span class="hljs-property">site</span>) {
		<span class="hljs-keyword">throw</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;site not set&#x27;</span>);
	}

	<span class="hljs-comment">// Use the same ordering as site listing (pinned first, then by published desc)</span>
	<span class="hljs-keyword">const</span> posts = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getSortedPosts</span>();
	<span class="hljs-keyword">const</span> <span class="hljs-attr">feed</span>: <span class="hljs-title class_">RSSFeedItem</span>[] = [];

	<span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> post <span class="hljs-keyword">of</span> posts) {
		<span class="hljs-comment">// convert markdown to html string</span>
		<span class="hljs-keyword">const</span> body = markdownParser.<span class="hljs-title function_">render</span>(post.<span class="hljs-property">body</span>);
		<span class="hljs-comment">// convert html string to DOM-like structure</span>
		<span class="hljs-keyword">const</span> html = htmlParser.<span class="hljs-title function_">parse</span>(body);
		<span class="hljs-comment">// hold all img tags in variable images</span>
		<span class="hljs-keyword">const</span> images = html.<span class="hljs-title function_">querySelectorAll</span>(<span class="hljs-string">&#x27;img&#x27;</span>);

		<span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> img <span class="hljs-keyword">of</span> images) {
			<span class="hljs-keyword">const</span> src = img.<span class="hljs-title function_">getAttribute</span>(<span class="hljs-string">&#x27;src&#x27;</span>);
			<span class="hljs-keyword">if</span> (!src) <span class="hljs-keyword">continue</span>;

			<span class="hljs-comment">// Handle content-relative images and convert them to built _astro paths</span>
			<span class="hljs-keyword">if</span> (src.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;./&#x27;</span>) || src.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;../&#x27;</span>)) {
				<span class="hljs-keyword">let</span> <span class="hljs-attr">importPath</span>: <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span> = <span class="hljs-literal">null</span>;

				<span class="hljs-keyword">if</span> (src.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;./&#x27;</span>)) {
					<span class="hljs-comment">// Path relative to the post file directory</span>
					<span class="hljs-keyword">const</span> prefixRemoved = src.<span class="hljs-title function_">slice</span>(<span class="hljs-number">2</span>);
					importPath = <span class="hljs-string">\`/src/content/posts/<span class="hljs-subst">\${prefixRemoved}</span>\`</span>;
				} <span class="hljs-keyword">else</span> {
					<span class="hljs-comment">// Path like ../assets/images/xxx -&gt; relative to /src/content/</span>
					<span class="hljs-keyword">const</span> cleaned = src.<span class="hljs-title function_">replace</span>(<span class="hljs-regexp">/^\\.\\.\\//</span>, <span class="hljs-string">&#x27;&#x27;</span>);
					importPath = <span class="hljs-string">\`/src/content/<span class="hljs-subst">\${cleaned}</span>\`</span>;
				}

				<span class="hljs-keyword">const</span> imageMod = <span class="hljs-keyword">await</span> imagesGlob[importPath]?.()?.<span class="hljs-title function_">then</span>(<span class="hljs-function">(<span class="hljs-params">res</span>) =&gt;</span> res.<span class="hljs-property">default</span>);
				<span class="hljs-keyword">if</span> (imageMod) {
					<span class="hljs-keyword">const</span> optimizedImg = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getImage</span>({ <span class="hljs-attr">src</span>: imageMod });
					img.<span class="hljs-title function_">setAttribute</span>(<span class="hljs-string">&#x27;src&#x27;</span>, <span class="hljs-keyword">new</span> <span class="hljs-title function_">URL</span>(optimizedImg.<span class="hljs-property">src</span>, context.<span class="hljs-property">site</span>).<span class="hljs-property">href</span>);
				}
			} <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (src.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;/&#x27;</span>)) {
				<span class="hljs-comment">// images starting with \`/\` are in public dir</span>
				img.<span class="hljs-title function_">setAttribute</span>(<span class="hljs-string">&#x27;src&#x27;</span>, <span class="hljs-keyword">new</span> <span class="hljs-title function_">URL</span>(src, context.<span class="hljs-property">site</span>).<span class="hljs-property">href</span>);
			}
		}

		feed.<span class="hljs-title function_">push</span>({
			<span class="hljs-attr">title</span>: post.<span class="hljs-property">data</span>.<span class="hljs-property">title</span>,
			<span class="hljs-attr">description</span>: post.<span class="hljs-property">data</span>.<span class="hljs-property">description</span>,
			<span class="hljs-attr">pubDate</span>: post.<span class="hljs-property">data</span>.<span class="hljs-property">published</span>,
			<span class="hljs-attr">link</span>: <span class="hljs-string">\`/posts/<span class="hljs-subst">\${post.slug}</span>/\`</span>,
			<span class="hljs-comment">// sanitize the new html string with corrected image paths</span>
			<span class="hljs-attr">content</span>: <span class="hljs-title function_">sanitizeHtml</span>(html.<span class="hljs-title function_">toString</span>(), {
				<span class="hljs-attr">allowedTags</span>: sanitizeHtml.<span class="hljs-property">defaults</span>.<span class="hljs-property">allowedTags</span>.<span class="hljs-title function_">concat</span>([<span class="hljs-string">&#x27;img&#x27;</span>]),
			}),
		});
	}

	<span class="hljs-keyword">return</span> <span class="hljs-title function_">rss</span>({
		<span class="hljs-attr">title</span>: siteConfig.<span class="hljs-property">title</span>,
		<span class="hljs-attr">description</span>: siteConfig.<span class="hljs-property">subtitle</span> || <span class="hljs-string">&#x27;No description&#x27;</span>,
		<span class="hljs-attr">site</span>: context.<span class="hljs-property">site</span>,
		<span class="hljs-attr">items</span>: feed,
		<span class="hljs-attr">customData</span>: <span class="hljs-string">\`&lt;language&gt;<span class="hljs-subst">\${siteConfig.lang}</span>&lt;/language&gt;\`</span>,
	});
}
</code></pre></div>
<p>保存了，还需要安装一个pnpm包，不用管是什么，能帮我们转换成链接就是的了</p>
<div class="code-block my-4 overflow-hidden rounded-lg border border-border"><div class="flex items-center justify-between gap-2 bg-muted/60 px-3.5 py-2"><div class="flex items-center gap-2.5"><div class="flex items-center gap-1.5 opacity-70"><span class="size-2 rounded-full bg-destructive/70"></span><span class="size-2 rounded-full bg-chart-3/70"></span><span class="size-2 rounded-full bg-chart-5/70"></span></div><span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3! bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 font-mono text-xs">bash</span></div><button data-slot="button" data-variant="muted" data-size="xs" class="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&amp;_svg:not([class*=&#x27;size-&#x27;])]:size-3" type="button" data-copy-code="" data-copied="false" aria-label="复制代码" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true" data-icon="inline-start" data-copy-icon=""><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true" data-icon="inline-start" data-check-icon=""><path d="M20 6 9 17l-5-5"></path></svg><span data-copy-label="">复制</span></button></div><div data-orientation="horizontal" role="none" data-slot="separator" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"></div><pre class="!m-0 !rounded-none !border-0 overflow-x-auto" tabindex="0"><code class="language-bash">pnpm add node-html-parser
</code></pre></div>
<div data-slot="alert" role="alert" class="group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[&gt;svg]:grid-cols-icon has-[&gt;svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=&#x27;size-&#x27;])]:size-4 bg-card my-4 text-chart-3 *:data-[slot=alert-description]:text-chart-3/90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg><div data-slot="alert-title" class="font-medium group-has-[&gt;svg]/alert:col-start-2 [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground">警告</div><div data-slot="alert-description" class="text-sm text-balance text-muted-foreground md:text-pretty [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground [&amp;_p:not(:last-child)]:mb-4 [&amp;_p:first-child]:mt-1">在推送到仓库时，你可能会遇到warning: in the working copy of &#x27;pnpm-lock.yaml&#x27;, LF will be replaced by CRLF the next time Git touches it 这是由于空格不同引起的，但并不会影响部署，忽略即可</div></div></div>`,t=[{level:2,text:`前言`,id:`前言`},{level:2,text:`修改RSS配置文件`,id:`修改rss配置文件`}],n={html:e,toc:t};export{n as default,e as html,t as toc};