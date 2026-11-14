var e=`<div class="markdown"><h2 class="markdown-h1" id="缘起">缘起</h2>
<p>偶然间在B站上看到一个archlinux的使用视频，在观看完后，b站开始推送更多的arch视频，我也就开始了尝试</p>
<h2 class="markdown-h1" id="安装">安装</h2>
<p>arch安装对于安装到整个硬盘/虚拟机用户无疑是方便的，但在实际使用中，可能是windows/linux或想从debian/ubuntu迁移到archlinux。</p>
<h2 id="分盘">分盘</h2>
<h3 id="windows">windows</h3>
<p>windows装双系统算是简单的了，进PE分一个100G的盘基本就够archlinux的日常使用了。</p>
<h3 id="linux">linux</h3>
<p>linux想要安装双系统，分盘时给我的感觉非常麻烦，他不能像windows一样进PE（大部分pe都是windows内核，所以对ext4分区不太友好，显示错误）。经过我一个多小时各种尝试，最终选择整盘安装😅。这玩意用linux应用分区又提示不支持，我整盘安装是因为这个盘就是给linux的原debian没什么重要数据。</p>
<div data-slot="alert" role="alert" class="group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[&gt;svg]:grid-cols-icon has-[&gt;svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=&#x27;size-&#x27;])]:size-4 bg-card my-4 text-chart-3 *:data-[slot=alert-description]:text-chart-3/90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg><div data-slot="alert-title" class="font-medium group-has-[&gt;svg]/alert:col-start-2 [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground">警告</div><div data-slot="alert-description" class="text-sm text-balance text-muted-foreground md:text-pretty [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground [&amp;_p:not(:last-child)]:mb-4 [&amp;_p:first-child]:mt-1">数据无价，在格式化硬盘前请先确认已备份重要数据</div></div>
<h2 id="live系统安装">live系统安装</h2>
<p>按自己主板方法进入live系统后，如果你是使用网线，可以一步到位直接使用archinstall命令。对于需使用无线网络的，使用iwctl。具体安装可以去B站自己搜索，这里给一个链接<a href="https://b23.tv/qo9xusQ" target="_blank" rel="noreferrer noopener">https://b23.tv/qo9xusQ</a></p>
<h2 class="markdown-h1" id="换源">换源</h2>
<p>安装系统后对于我们中国用户，第一件事必须是换源，这里推荐直接用成品一键脚本<a href="https://linuxmirrors.cn/" target="_blank" rel="noreferrer noopener">https://linuxmirrors.cn</a></p>
<p>镜像源按自己喜好选</p>
<h2 class="markdown-h1" id="输入法">输入法</h2>
<p>安装中文输入法应该算是第二步，b站教程也有，但这里说一下我踩的坑，我用的是GHOME桌面，设置里全翻了一遍也没找到pinyin，问豆沙包还让我选汉语，这里正确方式应该去应用列表里找到fcitx5配置，在这个应用里去选汉语</p>
<h2 class="markdown-h1" id="槽点">槽点</h2>
<p>用惯了windows/debian系这些系统后，我相信下载应用习惯应该都是去浏览器搜索应用，而arch系由于没有使用apt，但拥有yay库，就出现了一个处境：<em>官网没有安装包，得单独搜yay包</em></p>
<p>对于已经习惯用户，这个yay方式真的很麻烦</p></div>`,t=[{level:2,text:`缘起`,id:`缘起`},{level:2,text:`安装`,id:`安装`},{level:2,text:`分盘`,id:`分盘`},{level:3,text:`windows`,id:`windows`},{level:3,text:`linux`,id:`linux`},{level:2,text:`live系统安装`,id:`live系统安装`},{level:2,text:`换源`,id:`换源`},{level:2,text:`输入法`,id:`输入法`},{level:2,text:`槽点`,id:`槽点`}],n={html:e,toc:t};export{n as default,e as html,t as toc};