var e=`<div class="markdown"><p>有人问：主包主包cloudflare worker访问速度太慢了，有没有更强势的访问速度呢？</p>
<p>有的兄弟，有的</p>
<p>去 <a href="https://edgeone.ai/zh/get-free-plan" target="_blank" rel="noreferrer noopener">edgeone</a> 拿下不要钱的计划，添加你的域名，验证所有权，这步如果不会请退出</p>
<p>回到我们的cloudflare，选择你想加速的worker，添加自定义域，<strong>选择路由</strong>，选择你要加速的根域名，在你想要加速的子域+eo（方便区分），如我要加速www.91sssvip.top，就填wwweo.91sssvip.top/*，在去cloudflare添加dns解析A记录随便指向一个IP，但<strong>一定要开小黄云</strong>，保存回到edgeone</p>
<p>添加加速域名，我就填www，v6随便，我个人选择关闭，源站就写刚刚路由的域名协议https即可，<strong>回源Host头一定要选使用源站域名</strong>，最后保存就好啦</p>
<p>END</p></div>`,t=[],n={html:e,toc:t};export{n as default,e as html,t as toc};