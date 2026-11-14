var e=`<div class="markdown"><div data-slot="alert" role="alert" class="group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[&gt;svg]:grid-cols-icon has-[&gt;svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=&#x27;size-&#x27;])]:size-4 bg-card my-4 text-chart-3 *:data-[slot=alert-description]:text-chart-3/90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg><div data-slot="alert-title" class="font-medium group-has-[&gt;svg]/alert:col-start-2 [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground">警告</div><div data-slot="alert-description" class="text-sm text-balance text-muted-foreground md:text-pretty [&amp;_a]:underline [&amp;_a]:underline-offset-3 [&amp;_a]:hover:text-foreground [&amp;_p:not(:last-child)]:mb-4 [&amp;_p:first-child]:mt-1">变量部分均使用{}包裹，多选项用/分隔</div></div>
<h2 class="markdown-h1" id="llm">LLM</h2>
<h2 id="deepseek">Deepseek</h2>
<p>切换命令：<strong>#Deepseek</strong>
常用模型，回复速度快，稳定
缺点：无法识别图片</p>
<h2 id="gemini">Gemini</h2>
<p>切换命令：#Gemini
可以识别图片
缺点：有速率限制，超过范围会报错429</p>
<h2 id="gpt">GPT</h2>
<p>切换命令：#GPT4/#GPT
此模型为替代模型，可联网搜索
缺点：由于是非官方API，服务可能不稳</p>
<h2 class="markdown-h1" id="rua">rua</h2>
<p>命令：#rua {@一个用户/QQ号}
介绍：生成rua表情</p>
<h2 class="markdown-h1" id="发电">发电</h2>
<p>命令：#发电{目标名称}
介绍：生成一段表白话(?</p>
<h2 class="markdown-h1" id="我今天棒不棒">我今天棒不棒</h2>
<p>命令：我今天棒不棒
介绍：给出你今天的分数</p>
<h2 class="markdown-h1" id="enc解密">enc解密</h2>
<p>命令：#enc解密 {解密内容}
介绍：解密被enc加密过的内容</p>
<h2 class="markdown-h1" id="生图">生图</h2>
<p>命令：#生图 {Pixiv/ACG}  {标签}
介绍：</p>
<ul>
<li>Pixiv为从p站拉取一张图</li>
<li>ACG的标签只有：随机、电脑壁纸、头像、手机背景、壁纸</li>
</ul>
<h2 class="markdown-h1" id="http">http</h2>
<p>命令：#http {网址}
介绍：测试网站是否能访问并返回状态码</p>
<h2 class="markdown-h1" id="banme">Banme</h2>
<p>命令：banme
介绍：当bot为该群管理时会禁用1~5小时，适用于安心睡觉</p>
<h2 class="markdown-h1" id="今日运势">今日运势</h2>
<p>命令：今日运势
介绍：返回今日运势</p>
<h2 class="markdown-h1" id="名人名言">名人名言</h2>
<p>命令：#名人名言 {引用一条消息}
介绍：制作一个名言图片</p>
<h2 class="markdown-h1" id="mc服务器状态">MC服务器状态</h2>
<p>命令：#mcs {服务器地址}
介绍：查看此服务器状态及在线人数</p>
<h2 class="markdown-h1" id="名言">名言</h2>
<p>命令：#名言 {引用一条消息}
介绍：同上名人名言</p>
<h2 class="markdown-h1" id="抖音解析">抖音解析</h2>
<p>命令：发送抖音链接触发
介绍：解析抖音视频并发送</p>
<h2 class="markdown-h1" id="点歌">点歌</h2>
<p>命令：#点歌 {歌名/歌曲id}
介绍：仅能解析网易云歌曲</p>
<h2 class="markdown-h1" id="狐狸图">狐狸图</h2>
<p>命令：狐狸图
介绍：随机发送一张狐狸图</p>
<h2 class="markdown-h1" id="一言">一言</h2>
<p>命令：#名言
介绍：找一句好听的名言</p>
<h2 class="markdown-h1" id="天气">天气</h2>
<p>命令：#天气 {城市名称}
介绍：当前天气及未来三天天气</p>
<h2 class="markdown-h1" id="签到">签到</h2>
<p>命令：签到
介绍：签到功能</p>
<h2 class="markdown-h1" id="转码">转码</h2>
<p>命令：#转码 {文字/网址(需带https)}
介绍：将文字或网页转换为二维码</p>
<h2 class="markdown-h1" id="ping">ping</h2>
<p>命令：#ping {域名/ip}
介绍：由bot所运行的服务器ping 4次目标地址</p>
<h2 class="markdown-h1" id="大头照">大头照</h2>
<p>命令：#大头照 {@一个用户/QQ号}
介绍：发送该用户的QQ头像</p>
<h2 class="markdown-h1" id="whois">whois</h2>
<p>命令：#whois {域名}
介绍：查询该域名信息</p>
<h2 class="markdown-h1" id="点赞">点赞</h2>
<p>命令：赞我/超我
介绍：给你QQ名片点赞</p>
<h2 class="markdown-h1" id="伪造消息">伪造消息</h2>
<p>命令：#伪造消息 {QQ号/@一个用户}说{内容}<br/>
多条消息格式：#伪造消息 {QQ号/@一个用户}说{消息1}|{QQ号/@一个用户}说{消息2}<br/>
更多条以此类推
介绍：转发伪造合并转发的消息</p>
<h2 class="markdown-h1" id="角色扮演">角色扮演</h2>
<p>命令：#角色扮演<br/>
介绍：查看Bot的所有预设</p></div>`,t=[{level:2,text:`LLM`,id:`llm`},{level:2,text:`Deepseek`,id:`deepseek`},{level:2,text:`Gemini`,id:`gemini`},{level:2,text:`GPT`,id:`gpt`},{level:2,text:`rua`,id:`rua`},{level:2,text:`发电`,id:`发电`},{level:2,text:`我今天棒不棒`,id:`我今天棒不棒`},{level:2,text:`enc解密`,id:`enc解密`},{level:2,text:`生图`,id:`生图`},{level:2,text:`http`,id:`http`},{level:2,text:`Banme`,id:`banme`},{level:2,text:`今日运势`,id:`今日运势`},{level:2,text:`名人名言`,id:`名人名言`},{level:2,text:`MC服务器状态`,id:`mc服务器状态`},{level:2,text:`名言`,id:`名言`},{level:2,text:`抖音解析`,id:`抖音解析`},{level:2,text:`点歌`,id:`点歌`},{level:2,text:`狐狸图`,id:`狐狸图`},{level:2,text:`一言`,id:`一言`},{level:2,text:`天气`,id:`天气`},{level:2,text:`签到`,id:`签到`},{level:2,text:`转码`,id:`转码`},{level:2,text:`ping`,id:`ping`},{level:2,text:`大头照`,id:`大头照`},{level:2,text:`whois`,id:`whois`},{level:2,text:`点赞`,id:`点赞`},{level:2,text:`伪造消息`,id:`伪造消息`},{level:2,text:`角色扮演`,id:`角色扮演`}],n={html:e,toc:t};export{n as default,e as html,t as toc};