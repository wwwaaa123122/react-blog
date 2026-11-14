var e=`<div class="markdown"><h2 id="缘起">缘起</h2>
<p>博客已经运行了很长一段时间，最初选择的是 Fuwari 主题。Fuwari 确实是一个不错的主题，简洁美观，但随着使用深入，我逐渐发现一些问题，最终促使我迁移到了 Firefly。</p>
<h2 id="fuwari-想要的功能需要自己加">Fuwari：想要的功能需要自己加</h2>
<p>Fuwari 的设计理念是<strong>轻量、简洁</strong>，这既是优点也是局限。当我想要为博客添加一些功能时，发现：</p>
<ul>
<li><strong>评论系统</strong>需要自己集成，Fuwari 并没有内置支持</li>
<li><strong>说说/动态页面</strong>没有现成方案</li>
<li><strong>赞助页面、打赏功能</strong>需要从零开始</li>
<li><strong>音乐播放器、实验室页面</strong>等高级功能全部要自己动手</li>
</ul>
<p>每一次「想要什么功能就自己加」的过程，实际上是在消耗大量的时间和精力。对于一个希望专注于内容创作的博主来说，这无疑是一种负担。</p>
<h2 id="自定义之路-改着改着-功能就废了">自定义之路：改着改着，功能就废了</h2>
<p>更让人头疼的是自定义过程中的问题。Fuwari 的代码结构在经过多次修改后，<strong>依赖冲突、样式覆盖、功能失效</strong>接踵而来：</p>
<ul>
<li>升级主题版本后，之前手动添加的功能全部需要重新适配</li>
<li>为了实现某个功能修改了核心代码，结果导致其他功能异常</li>
<li>CSS 样式互相覆盖，调试起来苦不堪言</li>
</ul>
<p>每次折腾完，都感觉「杀敌一千，自损八百」。</p>
<h2 id="firefly-开箱即用-面面俱到">Firefly：开箱即用，面面俱到</h2>
<p>迁移到 Firefly 后，这些问题迎刃而解。Firefly 最大的优势在于其<strong>功能丰富且开箱即用</strong>：</p>
<table><thead><tr><th>功能</th><th>Fuwari</th><th>Firefly</th></tr></thead><tbody><tr><td>评论系统</td><td>❌ 需自行集成</td><td>✅ 内置支持</td></tr><tr><td>说说/动态</td><td>❌ 需自行开发</td><td>✅ 已有方案</td></tr><tr><td>赞助页面</td><td>❌ 需自行实现</td><td>✅ 已有功能</td></tr><tr><td>实验室/工具</td><td>❌ 需自行开发</td><td>✅ 多种工具可用</td></tr><tr><td>主题配置</td><td>⚠️ 需要魔改</td><td>✅ 配置文件搞定</td></tr></tbody></table>
<p>Firefly 几乎覆盖了我所有的使用需求，不需要再为了一个功能而耗费大量时间研究、调试。对于我这样的博主来说，<strong>把时间花在内容创作上，远比花在折腾主题上更有价值</strong>。</p>
<h2 id="写在最后">写在最后</h2>
<p>选择博客主题就像选择工具：合适的才是最好的。Fuwari 适合喜欢折腾、追求极简的用户；而 Firefly 则适合希望专注于内容、同时需要丰富功能的博主。</p>
<p>如果你也在 Fuwari 中挣扎于各种自定义，不妨试试 Firefly，说不定会打开新世界的大门。</p></div>`,t=[{level:2,text:`缘起`,id:`缘起`},{level:2,text:`Fuwari：想要的功能需要自己加`,id:`fuwari-想要的功能需要自己加`},{level:2,text:`自定义之路：改着改着，功能就废了`,id:`自定义之路-改着改着-功能就废了`},{level:2,text:`Firefly：开箱即用，面面俱到`,id:`firefly-开箱即用-面面俱到`},{level:2,text:`写在最后`,id:`写在最后`}],n={html:e,toc:t};export{n as default,e as html,t as toc};