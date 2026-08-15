---
title: archlinux使用体验
published: 2026-08-14
draft: false
description: 关于我的archlinux的使用体验
image: ../images/archlinux.png
tags:
  - arch
  - linux
  - thoughts
category: tech
lang: zh_CN
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

对于已经习惯用户，这个yay方式真的很麻烦
