import{ot as e,yt as t}from"./dist-BVtNLTZQ.js";var n=e(`book-open`,[[`path`,{d:`M12 5v16`,key:`1f6ucr`}],[`path`,{d:`M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z`,key:`1fyvmf`}]]),r=e(`circle-check`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),i=e(`clock`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]),a=`---
title: 关于本站迁移至Firefly
published: 2026-05-18
description: '讲述从fuwari迁移至Firefly的一些原因'
image: '/images/firefly.webp'
tags: [firefly,fuwari]
category: 'tech'
draft: false 
lang: 'zh_CN'
---

## 缘起

博客已经运行了很长一段时间，最初选择的是 Fuwari 主题。Fuwari 确实是一个不错的主题，简洁美观，但随着使用深入，我逐渐发现一些问题，最终促使我迁移到了 Firefly。

## Fuwari：想要的功能需要自己加

Fuwari 的设计理念是**轻量、简洁**，这既是优点也是局限。当我想要为博客添加一些功能时，发现：

- **评论系统**需要自己集成，Fuwari 并没有内置支持
- **说说/动态页面**没有现成方案
- **赞助页面、打赏功能**需要从零开始
- **音乐播放器、实验室页面**等高级功能全部要自己动手

每一次「想要什么功能就自己加」的过程，实际上是在消耗大量的时间和精力。对于一个希望专注于内容创作的博主来说，这无疑是一种负担。

## 自定义之路：改着改着，功能就废了

更让人头疼的是自定义过程中的问题。Fuwari 的代码结构在经过多次修改后，**依赖冲突、样式覆盖、功能失效**接踵而来：

- 升级主题版本后，之前手动添加的功能全部需要重新适配
- 为了实现某个功能修改了核心代码，结果导致其他功能异常
- CSS 样式互相覆盖，调试起来苦不堪言

每次折腾完，都感觉「杀敌一千，自损八百」。

## Firefly：开箱即用，面面俱到

迁移到 Firefly 后，这些问题迎刃而解。Firefly 最大的优势在于其**功能丰富且开箱即用**：

| 功能 | Fuwari | Firefly |
|------|--------|----------|
| 评论系统 | ❌ 需自行集成 | ✅ 内置支持 |
| 说说/动态 | ❌ 需自行开发 | ✅ 已有方案 |
| 赞助页面 | ❌ 需自行实现 | ✅ 已有功能 |
| 实验室/工具 | ❌ 需自行开发 | ✅ 多种工具可用 |
| 主题配置 | ⚠️ 需要魔改 | ✅ 配置文件搞定 |

Firefly 几乎覆盖了我所有的使用需求，不需要再为了一个功能而耗费大量时间研究、调试。对于我这样的博主来说，**把时间花在内容创作上，远比花在折腾主题上更有价值**。

## 写在最后

选择博客主题就像选择工具：合适的才是最好的。Fuwari 适合喜欢折腾、追求极简的用户；而 Firefly 则适合希望专注于内容、同时需要丰富功能的博主。

如果你也在 Fuwari 中挣扎于各种自定义，不妨试试 Firefly，说不定会打开新世界的大门。
`,o=`---
title: archlinux使用体验
published: 2026-08-14
draft: false
description: 关于我的archlinux的使用体验
image: /images/archlinux.webp
tags:
  - arch
  - linux
  - thoughts
category: tech
lang: zh_CN
updated: 2026-08-23
---
# 缘起

偶然间在B站上看到一个archlinux的使用视频，在观看完后，b站开始推送更多的arch视频，我也就开始了尝试

# 安装

arch安装对于安装到整个硬盘/虚拟机用户无疑是方便的，但在实际使用中，可能是windows/linux或想从debian/ubuntu迁移到archlinux。

## 分盘

### windows

windows装双系统算是简单的了，进PE分一个100G的盘基本就够archlinux的日常使用了。

### linux

linux想要安装双系统，分盘时给我的感觉非常麻烦，他不能像windows一样进PE（大部分pe都是windows内核，所以对ext4分区不太友好，显示错误）。经过我一个多小时各种尝试，最终选择整盘安装😅。这玩意用linux应用分区又提示不支持，我整盘安装是因为这个盘就是给linux的原debian没什么重要数据。

:::warning  
数据无价，在格式化硬盘前请先确认已备份重要数据  
:::

## live系统安装

按自己主板方法进入live系统后，如果你是使用网线，可以一步到位直接使用archinstall命令。对于需使用无线网络的，使用iwctl。具体安装可以去B站自己搜索，这里给一个链接[https://b23.tv/qo9xusQ](https://b23.tv/qo9xusQ)

# 换源

安装系统后对于我们中国用户，第一件事必须是换源，这里推荐直接用成品一键脚本[https://linuxmirrors.cn](https://linuxmirrors.cn/)

镜像源按自己喜好选

# 输入法

安装中文输入法应该算是第二步，b站教程也有，但这里说一下我踩的坑，我用的是GHOME桌面，设置里全翻了一遍也没找到pinyin，问豆沙包还让我选汉语，这里正确方式应该去应用列表里找到fcitx5配置，在这个应用里去选汉语

# 槽点

用惯了windows/debian系这些系统后，我相信下载应用习惯应该都是去浏览器搜索应用，而arch系由于没有使用apt，但拥有yay库，就出现了一个处境：*官网没有安装包，得单独搜yay包*

对于已经习惯用户，这个yay方式真的很麻烦`,s=`---
title: BA周年庆直接9个彩
published: 2025-08-07
description: '两个亚子还有礼服日奈'
image: '/images/ba3cai.webp'
tags: [blue archive]
category: 'daily'
draft: false 
lang: 'zh_CN'
---
快哉快哉
![亚子](../images/yazi.webp)  
![日奈](../images/rinai.webp)  
还有我的支付宝和QQ主题😋  
![支付宝](../images/ba-alipay.webp)  
![QQ](../images/ba-qq.webp)
`,c=`---
title: fuwari接入评论功能
published: 2025-08-04
description: '让你的fuwari接入评论，并让它在文章末显示出'
image: '/images/comment.webp'
tags: [fuwari]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
# Giscus
想要接入评论，肯定需要一个三方平台 [Giscus](https://giscus.app/zh-CN)
Giscus就是一个非常合适的平台  
# 配置Giscus
首先去github创建一个存储库，**一定要是公开库**
然后在仓库设置中**启用**\`Discussion\`功能  
前往https://giscus.app/zh-CN
在\`仓库\`一栏中点击第二步的蓝字安装giscus，最后填写自己的用户名及刚刚创建的仓库名称  
### 映射
我只建议使用\`pathname\`：以文章路径区分评论区，即使换域名也能匹配  
其它映射可以看官方介绍  
分类选择**公告（announcements）**  
特性个人建议勾选**1 3 4**  
主题默认即可，也可以尝试官方的其它主题  
最后将给出的JS复制  
# 配置fuwari
在\`src/pages/posts/\`目录下找到\`[...slug].astro\`，在它的**135行**插入
\`\`\`astro
<div id="giscus-comments" style="margin-top: 3rem;">
  你的JS
</div>
\`\`\`

最后本地测试一下，没问题就可以部署到服务器了`,l=`---
title: edgeone加速worker
published: 2025-07-29
description: '如何使用edgeone加速cf worker'
image: '/images/aluona.webp'
tags: [cloudflare,edgeone]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
有人问：主包主包cloudflare worker访问速度太慢了，有没有更强势的访问速度呢？

有的兄弟，有的

去 [edgeone](https://edgeone.ai/zh/get-free-plan) 拿下不要钱的计划，添加你的域名，验证所有权，这步如果不会请退出

回到我们的cloudflare，选择你想加速的worker，添加自定义域，**选择路由**，选择你要加速的根域名，在你想要加速的子域+eo（方便区分），如我要加速www.91sssvip.top，就填wwweo.91sssvip.top/\\*，在去cloudflare添加dns解析A记录随便指向一个IP，但**一定要开小黄云**，保存回到edgeone

添加加速域名，我就填www，v6随便，我个人选择关闭，源站就写刚刚路由的域名协议https即可，**回源Host头一定要选使用源站域名**，最后保存就好啦

END
`,u=`---
title: 为fuwari增加一个404界面
published: 2025-09-24
description: '为fuwari添加一个好看的404界面'
image: '/images/fuwari-404.webp'
tags: [fuwari]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
# 本文章分为两部分  
### 适配多语言的404界面  
打开**src/i18n/i18nKey.ts**  
\`\`\`typescript
	license = "license",
	friends = "friends",

	// 404 page
	notFound = "notFound",
	notFoundTitle = "notFoundTitle",
	notFoundMessage = "notFoundMessage",
	backToHome = "backToHome",
	viewArchive = "viewArchive",
\`\`\`  
再分别打开languages下的**en.ts**和**zh_CN.ts**  
en.ts
\`\`\`typescript
	[Key.license]: "License",
	[Key.friends]: "Friends",

	// 404 page
	[Key.notFound]: "Page Not Found",
	[Key.notFoundTitle]: "Oops! Page Not Found",
	[Key.notFoundMessage]: "The page you are looking for doesn't exist. It may have been moved or deleted.",
	[Key.backToHome]: "Back to Home",
	[Key.viewArchive]: "View Archive",
\`\`\`  
zh_CN.ts
\`\`\`typescript
	[Key.license]: "许可协议",
	[Key.friends]: "友链",

	// 404 page
	[Key.notFound]: "页面未找到",
	[Key.notFoundTitle]: "哎呀！页面走丢了",
	[Key.notFoundMessage]: "您访问的页面不存在，可能已被删除或链接有误。",
	[Key.backToHome]: "返回首页",
	[Key.viewArchive]: "查看归档",
\`\`\`  
最后在**src/pages**目录下创建**404.astro**  
\`\`\`astro
---
import { Icon } from "astro-icon/components";
import MainGridLayout from "../layouts/MainGridLayout.astro";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { url } from "../utils/url-utils";
import { siteConfig } from "../config";
---

<MainGridLayout title={i18n(I18nKey.notFound)} description={i18n(I18nKey.notFoundMessage)}>
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-96">
        <div class="card-base z-10 px-6 md:px-12 py-8 md:py-12 relative w-full">
            <!-- 404 Content -->
            <div class="flex flex-col items-center text-center space-y-6">
                <!-- Large 404 Number -->
                <div class="relative opacity-0 animate-fade-in-up">
                    <div class="text-8xl md:text-9xl font-bold bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] bg-clip-text text-transparent select-none">
                        404
                    </div>
                    <!-- Decorative elements -->
                    <div class="absolute -top-4 -right-4 w-8 h-8 bg-[var(--primary)] rounded-full opacity-20 animate-pulse"></div>
                    <div class="absolute -bottom-2 -left-2 w-6 h-6 bg-[var(--primary)] rounded-full opacity-30 animate-pulse" style="animation-delay: 0.5s;"></div>
                </div>

                <!-- Title and Message -->
                <div class="space-y-3 max-w-md opacity-0 animate-fade-in-up animate-delay-100">
                    <h1 class="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                        {i18n(I18nKey.notFoundTitle)}
                    </h1>
                    <p class="text-75 text-base md:text-lg leading-relaxed">
                        {i18n(I18nKey.notFoundMessage)}
                    </p>
                </div>

                <!-- Illustration -->
                <div class="py-4 opacity-0 animate-fade-in-up animate-delay-200">
                    <div class="relative w-32 h-32 mx-auto animate-float">
                        <!-- Simple geometric illustration -->
                        <div class="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] rounded-full opacity-10"></div>
                        <div class="absolute inset-4 bg-[var(--card-bg)] rounded-full border-2 border-[var(--primary)] border-opacity-20"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <Icon name="fa6-solid:location-crosshairs" class="w-12 h-12 text-[var(--primary)] opacity-60" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4 opacity-0 animate-fade-in-up animate-delay-300">
                    <a href={url("/")} 
                       class="btn-regular px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        <Icon name="fa6-solid:house" class="w-4 h-4" />
                        {i18n(I18nKey.backToHome)}
                    </a>
                    <a href={url("/archive")} 
                       class="btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]">
                        <Icon name="fa6-solid:box-archive" class="w-4 h-4" />
                        {i18n(I18nKey.viewArchive)}
                    </a>
                    <a href={url("/about")} 
                       class="btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]">
                        <Icon name="fa6-solid:circle-info" class="w-4 h-4" />
                        {i18n(I18nKey.about)}
                    </a>
                </div>

                <!-- Additional Help Text -->
                <div class="pt-6 text-sm text-50">
                    <p class="transition-all duration-300">
                        {siteConfig.lang === 'zh_CN' ? '如果您认为这是一个错误，请联系网站管理员。' : 'If you believe this is an error, please contact the site administrator.'}
                    </p>
                </div>
            </div>
        </div>
    </div>
</MainGridLayout>

<style>
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-delay-100 {
        animation-delay: 0.1s;
    }
    
    .animate-delay-200 {
        animation-delay: 0.2s;
    }
    
    .animate-delay-300 {
        animation-delay: 0.3s;
    }
    
    .animate-delay-400 {
        animation-delay: 0.4s;
    }
</style>
\`\`\`  

### 单语言404.astro  
此方法直接在**src/pages**目录下创建404.astro即可  
由于我没有语言的404，这里附上二叉树树的404界面  
预览：![2x-404](../images/2x-404.webp)
\`\`\`astro
---
import Layout from "@/layouts/Layout.astro";
import MainGridLayout from "@/layouts/MainGridLayout.astro";
import { Icon } from "astro-icon/components";
import { siteConfig } from "@/config";
---

<Layout title="页面未找到">
        <MainGridLayout>
                <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <!-- 404 图标 -->
                        <div class="mb-8">
                                <div class="relative">
                                        <div class="text-8xl md:text-9xl font-bold text-[var(--primary)] opacity-20">
                                                404
                                        </div>
                                        <div class="absolute inset-0 flex items-center justify-center">
                                                <Icon name="fa6-solid:face-sad-tear" class="text-6xl md:text-7xl text-[var(--primary)]" />
                                        </div>
                                </div>
                        </div>

                        <!-- 错误信息 -->
                        <div class="card-base p-8 max-w-md mx-auto mb-8">
                                <h1 class="text-2xl md:text-3xl font-bold text-90 mb-4">
                                        页面走丢了
                                </h1>
                                <p class="text-75 mb-6 leading-relaxed">
                                        抱歉，您访问的页面不存在或已被移动。
                                        <br>
                                        请检查URL是否正确，或者返回首页继续浏览。
                                </p>

                                <!-- 导航按钮 -->
                                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a href="/" class="btn-regular-dark px-6 py-3 rounded-lg text-white font-medium">
                                                <Icon name="fa6-solid:house" class="mr-2" />
                                                返回首页
                                        </a>
                                        <a href="/archive/" class="btn-regular px-6 py-3 rounded-lg font-medium">
                                                <Icon name="fa6-solid:box-archive" class="mr-2" />
                                                文章归档
                                        </a>
                                </div>
                        </div>

                        <!-- 返回提示 -->
                        <div class="mt-8 text-50 text-sm">
                                <p class="flex items-center justify-center">
                                        <Icon name="fa6-solid:clock-rotate-left" class="mr-2" />
                                        您也可以使用浏览器的后退按钮返回上一页
                                </p>
                        </div>
                </div>
        </MainGridLayout>
</Layout>
\`\`\`  
`,d=`---
title: Fuwari 主题背景图功能教程
published: 2026-03-29
description: 为 Fuwari 主题添加背景图、高斯模糊和半透明效果的完整配置教程
image: /homeground.webp
tags:
  - fuwari
category: tech
draft: true
lang: zh_CN
updated: 2026-09-12
---
本教程将介绍如何为 Fuwari 主题添加背景图功能，包括高斯模糊效果和用户可调节的模糊程度。

## 功能特性

- ✨ 全屏背景图显示
- 🎨 高斯模糊效果
- 🎚️ 用户可调节模糊程度（0-50px）
- 🧊 半透明卡片效果
- 💾 设置自动保存到本地存储

## 配置步骤

### 1. 配置背景图

打开 \`src/config.ts\` 文件，找到 \`siteConfig\` 对象，添加或修改 \`background\` 配置：

\`\`\`typescript
export const siteConfig: SiteConfig = {
  // ... 其他配置
  
  background: {
    enable: true,              // 是否启用背景图
    src: "/homeground.webp",   // 背景图片路径
    blur: 10,                  // 默认模糊程度（像素）
  },
  
  // ... 其他配置
};
\`\`\`

**参数说明：**

- \`enable\`: 布尔值，控制是否显示背景图
- \`src\`: 图片路径，以 \`/\` 开头表示相对于 \`/public\` 目录，否则相对于 \`/src\` 目录
- \`blur\`: 数字，默认模糊程度，范围建议 0-50

### 2. 添加背景图片

将你的背景图片放到 \`/public\` 目录下（如果路径以 \`/\` 开头）或 \`/src\` 目录下。建议使用高分辨率的图片以获得最佳效果。

**推荐图片规格：**

- 分辨率：至少 1920x1080
- 格式：WebP（推荐）、JPG、PNG
- 大小：建议小于 2MB

### 3. 自定义模糊度

用户可以在网页上通过导航栏的模糊图标调节背景模糊度：

1. 点击导航栏右侧的模糊图标
2. 使用滑块调节模糊程度（0-50px）
3. 设置会自动保存，刷新页面后保持

## 样式自定义

如果需要调整半透明效果，可以修改 \`src/styles/variables.styl\` 文件：

\`\`\`stylus
define({
  // 卡片背景透明度（85% 不透明）
  --card-bg-transparent: oklch(1 0 0 / 0.85) oklch(0.23 0.015 var(--hue) / 0.85)
  
  // 导航栏背景透明度（80% 不透明）
  --navbar-bg: oklch(1 0 0 / 0.8) oklch(0.23 0.015 var(--hue) / 0.8)
})
\`\`\`

修改 \`0.85\` 和 \`0.8\` 可以调整透明度（0-1 之间，越小越透明）。

## 禁用背景图

如果不想要背景图效果，只需在配置中设置 \`enable: false\`：

\`\`\`typescript
background: {
  enable: false,
  src: "/homeground.webp",
  blur: 10,
},
\`\`\`

## 效果展示

启用背景图后，整个网站将拥有：

- 固定在底层的全屏背景图
- 可调节的高斯模糊效果
- 半透明的卡片和导航栏
- 保持良好的文字可读性

## 代码实现

如果你想从零开始实现这个功能，或者了解具体的技术细节，请按照以下步骤操作：

### 步骤 1: 定义配置类型

首先在 \`src/types/config.ts\` 中添加背景图配置的类型定义：

\`\`\`typescript
export type SiteConfig = {
  // ... 其他配置

  background: {
    enable: boolean;
    src: string;
    blur?: number;
  };

  // ... 其他配置
};
\`\`\`

### 步骤 2: 添加配置项

在 \`src/config.ts\` 中添加背景图配置：

\`\`\`typescript
export const siteConfig: SiteConfig = {
  // ... 其他配置

  background: {
    enable: true,
    src: "/homeground.webp",
    blur: 10,
  },

  // ... 其他配置
};
\`\`\`

### 步骤 3: 实现设置存储和读取

在 \`src/utils/setting-utils.ts\` 中添加模糊度的存储和读取函数：

\`\`\`typescript
// 获取默认模糊度
export function getDefaultBlur(): number {
  const fallback = "10";
  const configCarrier = document.getElementById("config-carrier");
  return Number.parseInt(configCarrier?.dataset.blur || fallback);
}

// 获取存储的模糊度
export function getBlur(): number {
  const stored = localStorage.getItem("blur");
  return stored ? Number.parseInt(stored) : getDefaultBlur();
}

// 设置模糊度
export function setBlur(blur: number): void {
  localStorage.setItem("blur", String(blur));
  const r = document.querySelector(":root") as HTMLElement;
  if (!r) {
    return;
  }
  r.style.setProperty("--bg-blur", String(blur) + "px");
}
\`\`\`

### 步骤 4: 创建模糊设置组件

创建 \`src/components/widget/BlurSettings.svelte\` 文件：

\`\`\`svelte
<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultBlur, getBlur, setBlur } from "@utils/setting-utils";

let blur = getBlur();
const defaultBlur = getDefaultBlur();

function resetBlur() {
  blur = getDefaultBlur();
}

$: if (blur || blur === 0) {
  setBlur(blur);
}
<\/script>

<div id="blur-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            背景模糊
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                    class:opacity-0={blur === defaultBlur} class:pointer-events-none={blur === defaultBlur} on:click={resetBlur}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="blurValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {blur}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
        <input aria-label="Background Blur" type="range" min="0" max="50" bind:value={blur}
               class="slider" id="blurSlider" step="1" style="width: 100%">
    </div>
</div>
\`\`\`

### 步骤 5: 更新 ConfigCarrier 组件

修改 \`src/components/ConfigCarrier.astro\` 以传递模糊度配置：

\`\`\`astro
---
import { siteConfig } from "../config";

interface Props {
  blur?: number;
}

const { blur = siteConfig.background.blur || 10 } = Astro.props;
---

<div id="config-carrier" data-hue={siteConfig.themeColor.hue} data-blur={blur}>
</div>
\`\`\`

### 步骤 6: 在 Layout 中添加背景图

在 \`src/layouts/Layout.astro\` 中添加背景图元素和初始化脚本：

\`\`\`astro
<body>
  <ConfigCarrier blur={siteConfig.background.blur || 10}></ConfigCarrier>
  {siteConfig.background.enable && (
    <div id="background-wrapper" class="fixed inset-0 -z-10 overflow-hidden">
      <img
        id="background-image"
        src={url(siteConfig.background.src)}
        alt="Background image"
        class="absolute inset-0 w-full h-full object-cover"
        style={\`filter: blur(var(--bg-blur, 10px))\`}
      />
    </div>
  )}
  <slot />
</body>
\`\`\`

并在内联脚本中添加模糊度加载：

\`\`\`astro
<script is:inline>
  // 加载模糊度
  const configCarrier = document.getElementById('config-carrier');
  const defaultBlur = configCarrier?.dataset.blur || '10';
  const blur = localStorage.getItem('blur') || defaultBlur;
  document.documentElement.style.setProperty('--bg-blur', \`\${blur}px\`);
<\/script>
\`\`\`

### 步骤 7: 添加 CSS 变量

在 \`src/styles/variables.styl\` 中添加 CSS 变量：

\`\`\`stylus
:root
  --radius-large 1rem
  --content-delay 150ms
  --bg-blur 10px

define({
  // 背景图相关的变量
  --card-bg-transparent: oklch(1 0 0 / 0.85) oklch(0.23 0.015 var(--hue) / 0.85)
  --navbar-bg: oklch(1 0 0 / 0.8) oklch(0.23 0.015 var(--hue) / 0.8)
})
\`\`\`

### 步骤 8: 在导航栏添加模糊设置按钮

修改 \`src/components/Navbar.astro\`，添加模糊设置按钮和面板：

\`\`\`astro
<Search client:only="svelte"></Search>
{siteConfig.background.enable && (
  <button aria-label="Blur Settings" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="blur-settings-switch">
    <Icon name="material-symbols:blur-on" class="text-[1.25rem]"></Icon>
  </button>
)}
<LightDarkSwitch client:only="svelte"></LightDarkSwitch>

<!-- ... -->

{siteConfig.background.enable && <BlurSettings client:only="svelte"></BlurSettings>}
\`\`\`

并添加按钮点击事件处理：

\`\`\`astro
<script>
function loadButtonScript() {
  // ... 其他按钮

  let blurSettingBtn = document.getElementById("blur-settings-switch");
  if (blurSettingBtn) {
    blurSettingBtn.onclick = function () {
      let blurSettingPanel = document.getElementById("blur-setting");
      if (blurSettingPanel) {
        blurSettingPanel.classList.toggle("float-panel-closed");
      }
    };
  }
}

loadButtonScript();
<\/script>
\`\`\`

### 步骤 9: 添加半透明卡片样式

在 \`src/styles/main.css\` 中添加半透明卡片样式：

\`\`\`css
@layer components {
  .card-base {
    @apply rounded-[var(--radius-large)] overflow-hidden bg-[var(--card-bg)] transition;
  }

  .card-base-transparent {
    @apply rounded-[var(--radius-large)] overflow-hidden bg-[var(--card-bg-transparent)] backdrop-blur-md transition;
  }
}
\`\`\`

然后将各个组件的 \`card-base\` 类替换为 \`card-base-transparent\` 以使用半透明效果。

## 技术实现

功能实现涉及以下文件：

- \`src/types/config.ts\` - 配置类型定义
- \`src/config.ts\` - 配置项
- \`src/layouts/Layout.astro\` - 背景图渲染
- \`src/components/Navbar.astro\` - 模糊设置按钮
- \`src/components/widget/BlurSettings.svelte\` - 模糊调节面板
- \`src/utils/setting-utils.ts\` - 设置存储和读取
- \`src/styles/variables.styl\` - 样式变量

## 注意事项

1. 背景图片会影响页面加载速度，建议使用压缩后的图片
2. 模糊程度过高可能会影响视觉体验
3. 半透明效果在浅色主题下可能需要调整
4. 移动设备上建议使用较小的背景图片

## 常见问题

**Q: 为什么背景图不显示？**  
A: 检查 \`background.enable\` 是否为 \`true\`，图片路径是否正确。

**Q: 如何让背景图固定不滚动？**  
A: 当前实现已经是固定的，背景图不会随页面滚动。

**Q: 可以为不同页面设置不同背景图吗？**  
A: 当前版本所有页面使用同一背景图，如需不同背景需要修改代码。

---

希望这个教程能帮助你更好地使用 Fuwari 主题的背景图功能！`,f=`---
title: fuwari修复RSS图片不显示
published: 2025-09-27
description: '修复RSS图片链接问题'
image: '/images/fuwari-rss-fix.webp'
tags: [fuwari,RSS]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
# 前言  
啊大家都知道，fuwari的RSS如果你用的是相对路径，那么生成的RSS将也是相对路径，但这样就看不了图了啊，所以本章将带你修复它  
# 修改RSS配置文件  
打开**src/pages/rss.xml.ts**，当然你也可以直接删了  
直接一个全选删除再将下面的配置粘贴填入  
\`\`\`typescript
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config';
import { parse as htmlParser } from 'node-html-parser';
import { getImage } from 'astro:assets';
import type { APIContext, ImageMetadata } from 'astro';
import type { RSSFeedItem } from '@astrojs/rss';
import { getSortedPosts } from '@/utils/content-utils';

const markdownParser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	'/src/content/**/*.{jpeg,jpg,png,gif,webp}', // include posts and assets
);

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error('site not set');
	}

	// Use the same ordering as site listing (pinned first, then by published desc)
	const posts = await getSortedPosts();
	const feed: RSSFeedItem[] = [];

	for (const post of posts) {
		// convert markdown to html string
		const body = markdownParser.render(post.body);
		// convert html string to DOM-like structure
		const html = htmlParser.parse(body);
		// hold all img tags in variable images
		const images = html.querySelectorAll('img');

		for (const img of images) {
			const src = img.getAttribute('src');
			if (!src) continue;

			// Handle content-relative images and convert them to built _astro paths
			if (src.startsWith('./') || src.startsWith('../')) {
				let importPath: string | null = null;

				if (src.startsWith('./')) {
					// Path relative to the post file directory
					const prefixRemoved = src.slice(2);
					importPath = \`/src/content/posts/\${prefixRemoved}\`;
				} else {
					// Path like ../assets/images/xxx -> relative to /src/content/
					const cleaned = src.replace(/^\\.\\.\\//, '');
					importPath = \`/src/content/\${cleaned}\`;
				}

				const imageMod = await imagesGlob[importPath]?.()?.then((res) => res.default);
				if (imageMod) {
					const optimizedImg = await getImage({ src: imageMod });
					img.setAttribute('src', new URL(optimizedImg.src, context.site).href);
				}
			} else if (src.startsWith('/')) {
				// images starting with \`/\` are in public dir
				img.setAttribute('src', new URL(src, context.site).href);
			}
		}

		feed.push({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.published,
			link: \`/posts/\${post.slug}/\`,
			// sanitize the new html string with corrected image paths
			content: sanitizeHtml(html.toString(), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
			}),
		});
	}

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || 'No description',
		site: context.site,
		items: feed,
		customData: \`<language>\${siteConfig.lang}</language>\`,
	});
}
\`\`\`  
保存了，还需要安装一个pnpm包，不用管是什么，能帮我们转换成链接就是的了  
\`\`\`bash
pnpm add node-html-parser
\`\`\`  
:::warning
在推送到仓库时，你可能会遇到warning: in the working copy of 'pnpm-lock.yaml', LF will be replaced by CRLF the next time Git touches it 这是由于空格不同引起的，但并不会影响部署，忽略即可
:::  `,p=`---
title: Bot使用文档
published: 2025-10-25
description: '星辰旅人Bot使用文档'
image: '/images/how-use-bot-cover.webp'
tags: [Bot]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
:::warning
变量部分均使用{}包裹，多选项用/分隔
:::
# LLM
## Deepseek
切换命令：**#Deepseek**
常用模型，回复速度快，稳定
缺点：无法识别图片
## Gemini
切换命令：#Gemini
可以识别图片
缺点：有速率限制，超过范围会报错429
## GPT  
切换命令：#GPT4/#GPT
此模型为替代模型，可联网搜索
缺点：由于是非官方API，服务可能不稳

# rua
命令：#rua {@一个用户/QQ号}
介绍：生成rua表情

# 发电
命令：#发电{目标名称}
介绍：生成一段表白话(?
# 我今天棒不棒
命令：我今天棒不棒
介绍：给出你今天的分数
# enc解密
命令：#enc解密 {解密内容}
介绍：解密被enc加密过的内容
# 生图 
命令：#生图 {Pixiv/ACG}  {标签}
介绍：
* Pixiv为从p站拉取一张图
* ACG的标签只有：随机、电脑壁纸、头像、手机背景、壁纸
# http
命令：#http {网址}
介绍：测试网站是否能访问并返回状态码  

# Banme
命令：banme
介绍：当bot为该群管理时会禁用1~5小时，适用于安心睡觉
 
# 今日运势
命令：今日运势
介绍：返回今日运势

# 名人名言
命令：#名人名言 {引用一条消息}
介绍：制作一个名言图片

# MC服务器状态
命令：#mcs {服务器地址}
介绍：查看此服务器状态及在线人数

# 名言
命令：#名言 {引用一条消息}
介绍：同上名人名言

# 抖音解析
命令：发送抖音链接触发
介绍：解析抖音视频并发送

# 点歌
命令：#点歌 {歌名/歌曲id}
介绍：仅能解析网易云歌曲

# 狐狸图
命令：狐狸图
介绍：随机发送一张狐狸图

# 一言
命令：#名言
介绍：找一句好听的名言

# 天气
命令：#天气 {城市名称}
介绍：当前天气及未来三天天气

# 签到
命令：签到
介绍：签到功能

# 转码
命令：#转码 {文字/网址(需带https)}
介绍：将文字或网页转换为二维码

# ping
命令：#ping {域名/ip}
介绍：由bot所运行的服务器ping 4次目标地址

# 大头照
命令：#大头照 {@一个用户/QQ号}
介绍：发送该用户的QQ头像

# whois
命令：#whois {域名}
介绍：查询该域名信息

# 点赞
命令：赞我/超我
介绍：给你QQ名片点赞

# 伪造消息
命令：#伪造消息 {QQ号/@一个用户}说{内容}  
多条消息格式：#伪造消息 {QQ号/@一个用户}说{消息1}|{QQ号/@一个用户}说{消息2}  
更多条以此类推
介绍：转发伪造合并转发的消息

# 角色扮演
命令：#角色扮演  
介绍：查看Bot的所有预设




`,m=`---
title: Kick 开播提醒：用 Python 监控直播并推送 QQ 通知
published: 2026-06-14
description: '基于 Kick 私有 API 监控主播开播状态，通过 NapCat (OneBot 11) 发送 QQ 消息通知'
image: '/images/kick.webp'
tags: [python,kick,qq,onebot,napcat]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
# 前言
Kick 是一个比较新的直播平台，虽然没有 Twitch 那么火，但也吸引了不少主播。

如果你想关注某个 Kick 主播，但又不想一直开着网页等他开播，那就可以用脚本自动监控，开播了直接推消息到 QQ。

本文介绍一个用 Python 写的 Kick 开播提醒工具，通过 NapCat 对接 QQ，支持私聊和群聊通知。

# Kick API 介绍
Kick 有一个私有 API 可以查询主播的直播状态：

\`\`\`
GET https://api.kick.com/private/v1/channels/{channel}/livestream
\`\`\`

其中 \`{channel}\` 是主播的用户名（频道名），比如 \`xctraveller\`。

请求示例：
\`\`\`bash
curl "https://api.kick.com/private/v1/channels/xctraveller/livestream" \\
  -H "User-Agent: Mozilla/5.0" \\
  -H "Accept: application/json"
\`\`\`

返回格式：
\`\`\`json
{
  "data": {
    "livestream": {
      "id": 123456,
      "viewers_count": 42,
      "metadata": {
        "title": "直播标题",
        "category": {
          "name": "游戏分类"
        }
      }
    }
  }
}
\`\`\`

- 如果 \`livestream\` 存在且有 \`id\` 字段，说明正在直播
- 如果 \`livestream\` 为 \`null\` 或没有 \`id\`，说明未开播

:::warning
这是 Kick 的私有 API，没有官方文档，随时可能变动。目前不需要认证，但未来可能需要。
:::

# NapCat (OneBot 11) 简介
NapCat 是一个基于 QQNT 的 Bot 框架，实现了 OneBot 11 协议。通过它可以：
- 发送私聊消息
- 发送群聊消息
- 以及更多 QQ Bot 功能

OneBot 11 提供了 HTTP API，我们只需要调用 \`send_private_msg\` 或 \`send_group_msg\` 接口就能发送消息。

# 工作原理
整体流程很简单：

1. 定时请求 Kick API 查询主播状态
2. 如果检测到开播且之前未通知 → 发送开播通知
3. 如果检测到下播且之前已通知 → 发送下播通知
4. 使用一个 \`set\` 记录已通知的主播，避免重复通知

为了防止程序重启时误发通知，启动时会先同步一次当前状态，只记录不通知。

# 代码实现

## 检查直播状态
\`\`\`python
def check_live(channel: str) -> tuple[bool, dict | None]:
    url = f"https://api.kick.com/private/v1/channels/{channel}/livestream"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read().decode())
            livestream = body.get("data", {}).get("livestream")
            if livestream and livestream.get("id"):
                return (False, livestream)
            return (False, None)
    except (urllib.error.URLError, urllib.error.HTTPError, 
            json.JSONDecodeError, OSError) as e:
        print(f"[错误] 检查 {channel} 失败: {e}", file=sys.stderr)
        return (True, None)
\`\`\`

返回值设计：
- \`(False, livestream)\` — 正在直播
- \`(False, None)\` — 确认未开播
- \`(True, None)\` — 查询失败，跳过本轮

## 发送 NapCat 消息
\`\`\`python
def napcat_send(config: dict, endpoint: str, params: dict) -> bool:
    napcat = config["napcat"]
    url = f"http://{napcat['host']}:{napcat['port']}/{endpoint}"
    body = json.dumps(params).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if napcat.get("token"):
        headers["Authorization"] = f"Bearer {napcat['token']}"
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
            return result.get("retcode") == 0
    except (urllib.error.URLError, urllib.error.HTTPError, OSError):
        return False
\`\`\`

## 构造通知消息
\`\`\`python
message = (
    f"🔴 {channel} 开播了!\\n"
    f"标题: {title}\\n"
    f"分类: {category}\\n"
    f"观众: {viewers}\\n"
    f"链接: https://kick.com/{channel}"
)
\`\`\`

## 主循环
\`\`\`python
notified: set[str] = set()

while True:
    for channel in streamers:
        is_error, live_info = check_live(channel)
        
        if is_error:
            continue  # 查询失败，跳过
        
        if live_info:
            if channel.lower() not in notified:
                send_notification(config, channel, live_info)
                notified.add(channel.lower())
        else:
            if channel.lower() in notified:
                notified.discard(channel.lower())
                send_offline_notification(config, channel)
    
    time.sleep(interval)
\`\`\`

# 配置说明
配置文件 \`config.json\`：

\`\`\`json
{
    "napcat": {
        "host": "127.0.0.1",
        "port": 3000,
        "token": ""
    },
    "notify": {
        "private": [],
        "group": [123456789]
    },
    "streamers": [
        "xctraveller",
        "another_streamer"
    ],
    "check_interval": 30
}
\`\`\`

| 字段 | 说明 |
|------|------|
| \`napcat.host\` | NapCat HTTP 服务地址 |
| \`napcat.port\` | NapCat HTTP 服务端口 |
| \`napcat.token\` | NapCat 访问令牌（可选） |
| \`notify.private\` | 私聊通知的 QQ 号列表 |
| \`notify.group\` | 群聊通知的群号列表 |
| \`streamers\` | 要监控的 Kick 主播用户名列表 |
| \`check_interval\` | 检查间隔（秒） |

# 部署运行

## 环境要求
- Python 3.10+
- NapCat 已部署并运行

## 运行
\`\`\`bash
# 直接运行
python3 kick_notify.py

# 或者用脚本启动
chmod +x run.sh
./run.sh
\`\`\`

## 后台运行
\`\`\`bash
# 使用 nohup
nohup python3 kick_notify.py > kick.log 2>&1 &

# 或者用 screen/tmux
screen -S kick
python3 kick_notify.py
# Ctrl+A D 断开
\`\`\`

# 效果示例
开播通知：
\`\`\`
🔴 xctraveller 开播了!
标题: 晚上打游戏
分类: GTA V
观众: 42
链接: https://kick.com/xctraveller
\`\`\`

下播通知：
\`\`\`
⚫ xctraveller 下播了
链接: https://kick.com/xctraveller
\`\`\`

# 注意事项
- Kick 的私有 API 没有官方保证，可能随时失效或变更
- 检查间隔不要太短，30 秒到 1 分钟比较合理，避免被限流
- NapCat 需要先部署好，具体部署方法请参考 NapCat 官方文档
- 程序重启时不会发送重复通知，会先同步当前状态

# END
一个简单但实用的小工具。如果你也想监控 Kick 主播的开播状态，可以直接用这个脚本，改改配置就行。

# 额外感想
在制作之初，我是直接问ChatGPT如何做，甚至都没用搜索引擎查一下，ChatGPT说用webhook并使用fastapi封装，翻了十几分钟文档没咋看明白，直到直接用opencode+免费的mimo说了我要做开播提醒，mimo一开始其实也没多好，甚至想出来轮询每页找到目标，在他自己fetch几遍后直接用了kick的api，不过也算是完美完成了。
`,h=`---
title: MC免端口域名生成器使用与部署教程
published: 2026-05-31
description: '基于Cloudflare Workers的Minecraft免端口域名服务，让你的MC服务器玩家无需输入端口号'
image: '/images/mc-srv.webp'
tags: [minecraft,cloudflare,workers]
category: 'tech'
draft: false 
lang: 'zh_CN'
---
# 前言
玩Minecraft的都知道，开服的时候如果用了非默认端口（不是25565），连接的时候就得在域名后面加个冒号再填端口号，比如 \`play.example.com:25566\`，对于不熟悉的人来说还挺麻烦的。

有没有办法让玩家只输域名就能连上？有的兄弟，有的。

今天介绍的 **mc-srv-worker** 就是干这个的——基于 Cloudflare Workers 自动创建 DNS SRV 记录，让 Minecraft Java 版服务器实现"免端口"连接。

# 这东西怎么工作的
Minecraft Java 版在连接服务器时支持 DNS SRV 记录查询。简单来说，就是可以在 DNS 层面把一个域名映射到指定的地址和端口，客户端会自动解析并连接。

mc-srv-worker 就是利用了这个特性：
- 你提供服务器地址和端口
- 它在 Cloudflare DNS 上自动创建 SRV 记录
- 如果目标是 IP 地址，还会额外创建一个 A 记录（因为 Cloudflare 的 SRV 不支持直接填 IP）
- 玩家在游戏中直接输入域名即可连接

# 使用方法
如果你只是想用别人部署好的服务，直接打开页面就行。

## 创建域名
1. 在输入框填入你的服务器地址和端口，格式为 \`地址:端口\`，例如：
   - \`play.example.com:25565\`
   - \`1.2.3.4:25566\`
2. 可选填自定义前缀，不填会自动生成一个 \`mc-xxxxxx\` 格式的前缀
3. 点击「生成域名」
4. 成功后会返回一个类似 \`mc-abc123.zako.mom\` 的域名和一个 **16位授权码**

:::warning
授权码很重要！修改和删除记录时都需要它，丢了就只能等记录过期了
:::

## 管理域名
页面下方有管理区域，可以对已创建的域名进行修改或删除：

- **修改**：填入前缀、新的服务器地址、端口和授权码，点击更新即可
- **删除**：填入前缀和授权码，点击删除即可清理 DNS 记录

## 在 Minecraft 中使用
拿到域名后，玩家在 Minecraft Java 版中直接输入这个域名就能连接，不需要加端口号。

# 自己部署
不想用公共实例？自己部署也很简单。

## 先决条件
- 一个 [Cloudflare](https://dash.cloudflare.com) 账号
- 一个托管在 Cloudflare 上的域名
- Cloudflare API Token（需要 **编辑 DNS** 权限，仅目标域名所在区域即可）
- [Node.js](https://nodejs.org/) 环境

## 步骤

### 1. 克隆项目
\`\`\`bash
git clone https://github.com/wwwaaa123122/mc-srv-worker.git
cd mc-srv-worker
\`\`\`

### 2. 创建 KV 命名空间
\`\`\`bash
npx wrangler kv:namespace create MC_KV
\`\`\`
执行后会返回一个 KV 命名空间 ID，记下来。

### 3. 配置 wrangler.toml
编辑 \`wrangler.toml\`，填入你的信息：

\`\`\`toml
name = "mc-srv-worker"
main = "src/index.js"
compatibility_date = "2025-08-11"

[[kv_namespaces]]
binding = "MC_KV"
id = "上一步获取的KV_ID"

[vars]
CF_API_TOKEN = ""    # 留空，后面用 secret 设置
CF_ZONE_ID = ""      # 留空，后面用 secret 设置
BASE_DOMAIN = "你的域名"  # 例如 example.com
RATE_LIMIT = "5"      # 每IP每分钟最大创建次数

[assets]
directory = "./public"
binding = "ASSETS"
\`\`\`

### 4. 设置 Secrets
敏感信息不要写在配置文件里，用 wrangler secret 设置：

\`\`\`bash
npx wrangler secret put CF_API_TOKEN
# 输入你的 Cloudflare API Token

npx wrangler secret put CF_ZONE_ID
# 输入你的域名区域 ID（在 Cloudflare 域名概览页面底部可以找到）
\`\`\`

### 5. 部署
\`\`\`bash
npx wrangler deploy
\`\`\`

部署成功后会给你一个 \`*.workers.dev\` 的域名，也可以在 Cloudflare 面板绑定自定义域名。

## API 接口
如果你想自己写前端或者集成到其他地方，可以直接调用 API：

### 创建域名
\`\`\`bash
curl -X POST https://你的域名/api/create \\
  -H "Content-Type: application/json" \\
  -d '{"address": "1.2.3.4:25566", "prefix": "myserver"}'
\`\`\`

返回：
\`\`\`json
{
  "success": true,
  "domain": "myserver.example.com",
  "authCode": "a1b2c3d4e5f67890"
}
\`\`\`

### 修改解析
\`\`\`bash
curl -X POST https://你的域名/api/update \\
  -H "Content-Type: application/json" \\
  -d '{"sub": "myserver", "target": "5.6.7.8", "port": 25567, "authCode": "a1b2c3d4e5f67890"}'
\`\`\`

### 删除解析
\`\`\`bash
curl -X POST https://你的域名/api/delete \\
  -H "Content-Type: application/json" \\
  -d '{"sub": "myserver", "authCode": "a1b2c3d4e5f67890"}'
\`\`\`

# 注意事项
- 每个域名创建后会生成一个 **授权码**，修改或删除时必须提供，请妥善保存
- 每 IP 每分钟有创建次数限制（默认 5 次），防止滥用
- 目标地址格式必须为 \`地址:端口\`
- 端口范围：\`1\` ~ \`65535\`
- 授权码是 16 位的十六进制字符串，丢了就没了，记得备份

# END
就这样，很简单的一个小工具。有公网服务器的可以自己部署一个，没有的用公共实例也行。祝大家开服愉快！

### 后记
纯纯不知道写啥了，稍稍水个文章qwq
`,g=`---
title: 通过Cloudflare Tunnel使用SSH
published: 2026-02-04
description: 通过Cloudflare Tunnel连接无公网IP的服务
image: /images/SSH_Cloudflare.webp
tags:
  - cloudflare
  - tunnel
  - ssh
category: tech
draft: false
lang: zh_CN
updated: 2026-08-15
---
# 前言

在没有公网的条件下我们想访问无公网IP往往只能通过FRP或IPv6，本篇文章将介绍使用Cloudflare Tunnel连接内网中的SSH服务  

# 准备

## 先决条件

- [Cloudflare](https://dash.cloudflare.com)账号，没有的自行注册一个，并需绑定一张信用卡（不会扣费） 
- 一个托管在Cloudflare上的域名

## 安装Tunnel

打开[Zero Trust](https://one.dash.cloudflare.com)团队名随便写一个，在左侧边栏找到 **网络** ，选择 **连接器** 。进来后点击 **添加隧道** ，隧道类型选项 **Cloudflared** ，名称依旧随便取，保存隧道后选择系统类型，下面我以ubuntu 64-bit 为例  

### 安装 cloudflared

可将给的shell脚本保存为.sh执行，连上需远程ssh的终端，执行  

\`\`\`bash
cat << 'EOF' > Install_cloudflared.sh
#!/bin/bash

# Add cloudflare gpg key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
sudo apt-get update && sudo apt-get install cloudflared
EOF
\`\`\`

赋予权限  

\`\`\`bash
chmod +x Install_cloudflared.sh
\`\`\`

执行脚本安装  

\`\`\`bash
./Install_cloudflared.sh
\`\`\`

### 连接

执行连接页面给的 *让计算机每次启动时自动运行隧道* 这条命令

\`\`\`bash
sudo cloudflared service install <你的令牌>
\`\`\`

若 **Connectors** 列表中出现了您的设备，则说明安装成功。

# 配置Tunnel及应用

### 发布应用程序路由

- 子域：随便填 示例：ssh  
- 域：选择你的域名  
- 路径：空着  
- 服务类型：SSH  
- URL：127.0.0.1

### 配置应用程序

侧栏中选中 **访问控制** → **应用程序** → **添加应用程序**   

类型选择 **自托管** ，名称依旧随便写，会话持续时间看你自己，我这里选的是6小时  

点击 **添加公共主机名** 
输入方式默认，但子域及域要填写与***发布应用程序路由***  **一致的** ，展开下面的**浏览器呈现设置** 启用*允许自动 Cloudflared 身份验证*  
浏览器呈现选择**SSH**  
下面需创建一个策略，名称依旧随便写，操作选择*允许*  
认证方式自己选一个方便的，我这里选的是EMAIL即邮箱，其它的看自己最后点保存，回到配置页面，选择好刚刚配置的规则，没其它要求一直点下一步，至此配置就结束了。  

# 最终体验

打开你的域名，此时应会跳转到Cloudflare的验证界面，按照你自己选择的验证方式过后应该就会跳转到输入*User* 的界面，输入你的用户名提交后输入密码，至此就大功告成了。`,_=`---
title: 使用tunnelbroker隧道与warp获取任意地区IP（朝鲜）
published: 2026-09-06
updated: 2026-09-06
draft: false
description: 使用Tunnel Broker IPv6 隧道与Cloudflare WARP获取任意地区的IP地址
image: /images/tunelbrokerwarp.webp
tags:
  - cloudflare
  - warp
  - tunelbroker
  - ipv6
  - tunnel
category: tech
lang: zh_CN
---
## ip属地

在原理上并没有归属地，只是各个数据库为它标记了国家地区，你可以使用[https://ippure.com](https://ippure.com)等检测工具

## tunelbroker

### 注册

打开[tunnelbroker注册页面](https://tunnelbroker.net/register.php)邮箱使用你的域名，邮箱国家，选择你想要IP地址的国家，也可以后续在个人信息页面修改

创建完账号登录后，打开[个人信息页面](https://tunnelbroker.net/account.php)，这里可以抓包，也可以直接用[脚本（推荐）](https://greasyfork.org/zh-CN/scripts/541616-tunnelbroker-%E6%9B%B4%E5%A4%9A%E5%9C%B0%E5%8C%BA)安装插件后再次选择国家，就会出现朝鲜、南极洲等原来不可见地区，脚本需要记住国家代码，f12将原有的国家代码改为你要的国家的代码。

### 创建隧道

打开创建[隧道页面](https://tunnelbroker.net/new_tunnel.php)，IPv4 Endpoint填你的公网IPv4 地址，下面选择一个隧道服务器，可以直接选择你服务器附近地区的隧道服务器，也可以全部 ping 一遍，选择延迟最低的。推荐使用/48 作为服务器IPv6 段，但由于新账号的原因，可能需要 24~72 小时才能分配，就像这样 

![](/images/screenshot2026-09-06-12-45-14-660commicrosoftemmx.webp)

这段时间可以先用/64 做连通性测试

## 配置VPS

**此部分为AI生成**  
选择 **Example Configurations** 一栏，选择你的操作系统，这里以 **Linux** 为例，然后选择 **router2**。TunnelBroker 会生成类似下面的配置：

\`\`\`bash
modprobe ipv6
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip addr add 2001:470:23:844::2/64 dev he-ipv6
ip route add ::/0 dev he-ipv6
ip -f inet6 addr
\`\`\`

其中 \`74.82.46.6\` 是 TunnelBroker 服务器 IPv4，\`47.86.38.16\` 是 VPS 公网 IPv4，\`2001:470:23:844::1\` 是 TunnelBroker 服务器 IPv6，\`2001:470:23:844::2\` 是分配给 VPS 的 IPv6。实际配置时以 TunnelBroker 页面显示的参数为准。

### 临时测试

正式配置之前建议先执行 TunnelBroker 提供的配置测试隧道是否正常：

\`\`\`bash
modprobe sit
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip -6 addr add 2001:470:23:844::2/64 dev he-ipv6
ip -6 route add default via 2001:470:23:844::1 dev he-ipv6
\`\`\`

测试 TunnelBroker 节点：

\`\`\`bash
ping -6 2001:470:23:844::1
\`\`\`

测试公网 IPv6：

\`\`\`bash
ping -6 2001:4860:4860::8888
\`\`\`

查看公网 IPv6：

\`\`\`bash
curl -6 https://api64.ipify.org
\`\`\`

如果能够正常返回 IPv6 地址，说明隧道配置成功。

> 如果无法连接，首先检查 VPS 防火墙和云厂商安全组是否允许 **IPv4 Protocol 41**。注意 Protocol 41 不是 TCP/UDP 端口 41，而是 IPv4 协议号。

### 配置持久化

上面的 \`ip tunnel add\` 配置只在当前运行周期有效，VPS 重启后会消失。Debian 12 推荐使用 **systemd-networkd** 进行持久化。

首先让系统开机自动加载 SIT 模块：

\`\`\`bash
echo sit > /etc/modules-load.d/sit.conf
\`\`\`

创建 Tunnel 配置：

\`\`\`bash
nano /etc/systemd/network/10-he-ipv6.netdev
\`\`\`

写入：

\`\`\`ini
[NetDev]
Name=he-ipv6
Kind=sit
MTUBytes=1480

[Tunnel]
Local=47.86.38.16
Remote=74.82.46.6
TTL=255
\`\`\`

其中 \`Local\` 填 VPS 公网 IPv4，\`Remote\` 填 TunnelBroker 的 Server IPv4。

然后创建 IPv6 网络配置：

\`\`\`bash
nano /etc/systemd/network/20-he-ipv6.network
\`\`\`

写入：

\`\`\`ini
[Match]
Name=he-ipv6

[Network]
Address=2001:470:23:844::2/64
Gateway=2001:470:23:844::1
\`\`\`

其中 \`Address\` 填 TunnelBroker 分配的 Client IPv6，\`Gateway\` 填 Server IPv6。

启用 \`systemd-networkd\`：

\`\`\`bash
systemctl enable --now systemd-networkd
\`\`\`

如果服务器已经使用 \`systemd-networkd\`，不要覆盖原有网络配置。需要在物理网卡对应的 \`.network\` 文件中的 \`[Network]\` 部分加入：

\`\`\`ini
Tunnel=he-ipv6
\`\`\`

例如网卡为 \`eth0\`：

\`\`\`ini
[Match]
Name=eth0

[Network]
DHCP=yes
Tunnel=he-ipv6
\`\`\`

配置完成后重新加载：

\`\`\`bash
systemctl restart systemd-networkd
\`\`\`

检查隧道：

\`\`\`bash
networkctl status he-ipv6
\`\`\`

检查 IPv6：

\`\`\`bash
ip -6 addr show dev he-ipv6
\`\`\`

检查路由：

\`\`\`bash
ip -6 route
\`\`\`

正常情况下应该能看到：

\`\`\`text
default via 2001:470:23:844::1 dev he-ipv6
\`\`\`

最后测试：

\`\`\`bash
curl -6 https://api64.ipify.org
\`\`\`

确认正常后重启 VPS：

\`\`\`bash
reboot
\`\`\`

重新连接后执行：

\`\`\`bash
ip link show he-ipv6
ip -6 addr show dev he-ipv6
ip -6 route
curl -6 https://api64.ipify.org
\`\`\`

如果重启后 \`he-ipv6\` 仍然存在并且可以正常访问 IPv6，说明持久化配置成功。

### 防火墙

TunnelBroker 使用 **IPv4 Protocol 41** 建立 6in4 隧道，因此 VPS 本机防火墙以及云厂商安全组都不能拦截该协议。如果使用 nftables，可以允许 IPv4 Protocol 41：

\`\`\`bash
nft add rule inet filter input ip protocol 41 accept
\`\`\`

具体规则需要根据服务器现有的 nftables 配置进行调整。

### Routed /64和/48

TunnelBroker 创建隧道后通常还会提供 Routed \`/64\` 或 \`/48\`。隧道本身使用的 \`/64\` 主要用于 VPS 与 TunnelBroker 节点通信，而 Routed Prefix 可以用于其他服务器、虚拟机、Docker 容器等设备。

如果只是让当前 VPS 获得 IPv6，使用 TunnelBroker 提供的 Tunnel \`/64\` 即可；如果需要给多个设备分配 IPv6，则推荐使用 \`/48\`。例如：

\`\`\`text
2001:470:xxxx::/48
├── 2001:470:xxxx:1::/64
├── 2001:470:xxxx:2::/64
├── 2001:470:xxxx:3::/64
└── ...
\`\`\`

这样可以从 \`/48\` 中划分多个 \`/64\`，分别用于不同的服务器、虚拟机或网络。

## 配置warp

不推荐直接使用warp CLI，建议使用3x-ui，能在面板直观创建入站、出站。

创建入站及配置客户端后，点击侧栏出站 

![](/images/screenshot2026-09-06-13-05-07-556commicrosoftemmx.webp)

编辑配置中只需要改为IPV6 优先 

![](/images/screenshot2026-09-06-13-07-18-743commicrosoftemmx.webp)

再将warp移动到第一个，至此，配置完成，只需等待同步

## 体验

等待了接近半个月，B站终于将warp的IP标为朝鲜

![](/images/screenshot2026-09-06-13-10-55-395markvia.webp)

![](/images/screenshot2026-09-06-13-11-09-365markvia.webp)

B站评论区文章IP归属都会显示为朝鲜，主页需要1~3 周才会改变

这里贴一张B站评论测试图

![](/images/screenshot2026-09-06-13-14-38-528tvdanmakubili.webp)

也是可以愉快地发评论了😋
`,v=typeof process<`u`&&!!process.versions?.node;async function y(){if(v){let e=await t(()=>import(`node:path`),[]),n={}.POSTS_DIR||globalThis.__POSTS_DIR__||e.join(process.cwd(),`src/posts`);if(n){let r=await t(()=>import(`node:fs`),[]),i={};if(r.existsSync(n))for(let t of r.readdirSync(n))t.endsWith(`.md`)&&(i[`../posts/`+t]=r.readFileSync(e.join(n,t),`utf-8`));return i}}return Object.assign({"../posts/Why-to-Firefly.md":a,"../posts/archlinux.md":o,"../posts/ba2th.md":s,"../posts/comment.md":c,"../posts/edgeone-worker.md":l,"../posts/fuwari-404.md":u,"../posts/fuwari-background-image.md":d,"../posts/fuwari-rss.md":f,"../posts/how-use-bot.md":p,"../posts/kick-live-notify.md":m,"../posts/mc-srv-worker.md":h,"../posts/ssh-by-tunnel.md":g,"../posts/warp-ip-kp.md":_})}var b=await y();function x(e){let t=e.split(`
`);if(t[0]?.trim()!==`---`)return{data:{},content:e};let n=1,r={};for(;n<t.length&&t[n].trim()!==`---`;){let e=t[n],i=e.indexOf(`:`);if(i>0){let a=e.slice(0,i).trim(),o=e.slice(i+1).trim();if(o===``&&t[n+1]?.trimStart().startsWith(`- `)){let e=[];for(n++;n<t.length;){let r=t[n];if(!r.trimStart().startsWith(`- `))break;e.push(r.trim().slice(2).trim().replace(/^['"]|['"]$/g,``)),n++}r[a]=e;continue}if(o===`|`||o===`>`||o===`|-`||o===`>-`){let e=o===`>`||o===`>-`,i=[];for(n++;n<t.length&&(t[n].startsWith(` `)||t[n]===``);)i.push(t[n]),n++;let s=i.join(`
`).replace(/^\s+/gm,``);e&&(s=s.replace(/\n+/g,` `)),r[a]=s;continue}r[a]=o.startsWith(`"`)&&o.endsWith(`"`)||o.startsWith(`'`)&&o.endsWith(`'`)?o.slice(1,-1):o.startsWith(`[`)&&o.endsWith(`]`)?o.slice(1,-1).split(`,`).map(e=>e.trim().replace(/^['"]|['"]$/g,``)).filter(Boolean):o===`true`||o===`false`?o===`true`:o===``||o===`null`||o===`~`?null:o}n++}return{data:r,content:t.slice(n+1).join(`
`)}}function S(e){return(e.match(/[\u4e00-\u9fa5]/g)||[]).length+e.replace(/[\u4e00-\u9fa5]/g,` `).split(/\s+/).filter(Boolean).length}function C(){let e=[];for(let[t,n]of Object.entries(b)){let r=(t.split(`/`).pop()||``).replace(/\.md$/,``),{data:i,content:a}=x(n),o=Array.isArray(i.tags)?i.tags.map(String):[];e.push({slug:r,title:String(i.title||r),published:String(i.published||``),updated:i.updated?String(i.updated):void 0,description:String(i.description||``),image:i.image?String(i.image):void 0,tags:o,category:String(i.category||``),draft:!!i.draft,lang:String(i.lang||`zh_CN`),content:a,words:S(a)})}return e}var w=C().filter(e=>!e.draft).sort((e,t)=>e.published<t.published?1:-1),T=e=>w.find(t=>t.slug===e),E=()=>{let e=new Set;for(let t of w)for(let n of t.tags)e.add(n);return Array.from(e).sort()},D=e=>{if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`})},O=e=>`约 ${Math.max(1,Math.round(e/300))} 分钟`,k=e=>e.replace(/\.\.\/images\//g,`/images/`);export{O as a,r as c,w as i,n as l,E as n,k as o,T as r,i as s,D as t};