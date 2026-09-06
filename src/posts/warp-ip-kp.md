---
title: 使用tunnelbroker隧道与warp获取任意地区IP（朝鲜）
published: 2026-09-06
updated: 2026-09-06
draft: false
description: 使用Tunnel Broker IPv6 隧道与Cloudflare WARP获取任意地区的IP地址
image: /images/tunelbrokerwarp.png
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

![](/images/screenshot2026-09-06-12-45-14-660commicrosoftemmx.png)

这段时间可以先用/64 做连通性测试

## 配置VPS

**此部分为AI生成**  
选择 **Example Configurations** 一栏，选择你的操作系统，这里以 **Linux** 为例，然后选择 **router2**。TunnelBroker 会生成类似下面的配置：

```bash
modprobe ipv6
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip addr add 2001:470:23:844::2/64 dev he-ipv6
ip route add ::/0 dev he-ipv6
ip -f inet6 addr
```

其中 `74.82.46.6` 是 TunnelBroker 服务器 IPv4，`47.86.38.16` 是 VPS 公网 IPv4，`2001:470:23:844::1` 是 TunnelBroker 服务器 IPv6，`2001:470:23:844::2` 是分配给 VPS 的 IPv6。实际配置时以 TunnelBroker 页面显示的参数为准。

### 临时测试

正式配置之前建议先执行 TunnelBroker 提供的配置测试隧道是否正常：

```bash
modprobe sit
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip -6 addr add 2001:470:23:844::2/64 dev he-ipv6
ip -6 route add default via 2001:470:23:844::1 dev he-ipv6
```

测试 TunnelBroker 节点：

```bash
ping -6 2001:470:23:844::1
```

测试公网 IPv6：

```bash
ping -6 2001:4860:4860::8888
```

查看公网 IPv6：

```bash
curl -6 https://api64.ipify.org
```

如果能够正常返回 IPv6 地址，说明隧道配置成功。

> 如果无法连接，首先检查 VPS 防火墙和云厂商安全组是否允许 **IPv4 Protocol 41**。注意 Protocol 41 不是 TCP/UDP 端口 41，而是 IPv4 协议号。

### 配置持久化

上面的 `ip tunnel add` 配置只在当前运行周期有效，VPS 重启后会消失。Debian 12 推荐使用 **systemd-networkd** 进行持久化。

首先让系统开机自动加载 SIT 模块：

```bash
echo sit > /etc/modules-load.d/sit.conf
```

创建 Tunnel 配置：

```bash
nano /etc/systemd/network/10-he-ipv6.netdev
```

写入：

```ini
[NetDev]
Name=he-ipv6
Kind=sit
MTUBytes=1480

[Tunnel]
Local=47.86.38.16
Remote=74.82.46.6
TTL=255
```

其中 `Local` 填 VPS 公网 IPv4，`Remote` 填 TunnelBroker 的 Server IPv4。

然后创建 IPv6 网络配置：

```bash
nano /etc/systemd/network/20-he-ipv6.network
```

写入：

```ini
[Match]
Name=he-ipv6

[Network]
Address=2001:470:23:844::2/64
Gateway=2001:470:23:844::1
```

其中 `Address` 填 TunnelBroker 分配的 Client IPv6，`Gateway` 填 Server IPv6。

启用 `systemd-networkd`：

```bash
systemctl enable --now systemd-networkd
```

如果服务器已经使用 `systemd-networkd`，不要覆盖原有网络配置。需要在物理网卡对应的 `.network` 文件中的 `[Network]` 部分加入：

```ini
Tunnel=he-ipv6
```

例如网卡为 `eth0`：

```ini
[Match]
Name=eth0

[Network]
DHCP=yes
Tunnel=he-ipv6
```

配置完成后重新加载：

```bash
systemctl restart systemd-networkd
```

检查隧道：

```bash
networkctl status he-ipv6
```

检查 IPv6：

```bash
ip -6 addr show dev he-ipv6
```

检查路由：

```bash
ip -6 route
```

正常情况下应该能看到：

```text
default via 2001:470:23:844::1 dev he-ipv6
```

最后测试：

```bash
curl -6 https://api64.ipify.org
```

确认正常后重启 VPS：

```bash
reboot
```

重新连接后执行：

```bash
ip link show he-ipv6
ip -6 addr show dev he-ipv6
ip -6 route
curl -6 https://api64.ipify.org
```

如果重启后 `he-ipv6` 仍然存在并且可以正常访问 IPv6，说明持久化配置成功。

### 防火墙

TunnelBroker 使用 **IPv4 Protocol 41** 建立 6in4 隧道，因此 VPS 本机防火墙以及云厂商安全组都不能拦截该协议。如果使用 nftables，可以允许 IPv4 Protocol 41：

```bash
nft add rule inet filter input ip protocol 41 accept
```

具体规则需要根据服务器现有的 nftables 配置进行调整。

### Routed /64和/48

TunnelBroker 创建隧道后通常还会提供 Routed `/64` 或 `/48`。隧道本身使用的 `/64` 主要用于 VPS 与 TunnelBroker 节点通信，而 Routed Prefix 可以用于其他服务器、虚拟机、Docker 容器等设备。

如果只是让当前 VPS 获得 IPv6，使用 TunnelBroker 提供的 Tunnel `/64` 即可；如果需要给多个设备分配 IPv6，则推荐使用 `/48`。例如：

```text
2001:470:xxxx::/48
├── 2001:470:xxxx:1::/64
├── 2001:470:xxxx:2::/64
├── 2001:470:xxxx:3::/64
└── ...
```

这样可以从 `/48` 中划分多个 `/64`，分别用于不同的服务器、虚拟机或网络。

## 配置warp

不推荐直接使用warp CLI，建议使用3x-ui，能在面板直观创建入站、出站。

创建入站及配置客户端后，点击侧栏出站 

![](/images/screenshot2026-09-06-13-05-07-556commicrosoftemmx.png)

编辑配置中只需要改为IPV6 优先 

![](/images/screenshot2026-09-06-13-07-18-743commicrosoftemmx.png)

再将warp移动到第一个，至此，配置完成，只需等待同步

## 体验

等待了接近半个月，B站终于将warp的IP标为朝鲜

![](/images/screenshot2026-09-06-13-10-55-395markvia.png)

![](/images/screenshot2026-09-06-13-11-09-365markvia.png)

B站评论区文章IP归属都会显示为朝鲜，主页需要1~3 周才会改变

这里贴一张B站评论测试图

![](/images/screenshot2026-09-06-13-14-38-528tvdanmakubili.png)

也是可以愉快地发评论了😋
