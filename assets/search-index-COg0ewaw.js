var e={"warp-ip-kp":`使用tunnelbroker隧道与warp获取任意地区ip（朝鲜）
使用tunnel broker ipv6 隧道与cloudflare warp获取任意地区的ip地址
## ip属地

在原理上并没有归属地，只是各个数据库为它标记了国家地区，你可以使用[https://ippure.com](https://ippure.com)等检测工具

## tunelbroker

### 注册

打开[tunnelbroker注册页面](https://tunnelbroker.net/register.php)邮箱使用你的域名，邮箱国家，选择你想要ip地址的国家，也可以后续在个人信息页面修改

创建完账号登录后，打开[个人信息页面](https://tunnelbroker.net/account.php)，这里可以抓包，也可以直接用[脚本（推荐）](https://greasyfork.org/zh-cn/scripts/541616-tunnelbroker-%e6%9b%b4%e5%a4%9a%e5%9c%b0%e5%8c%ba)安装插件后再次选择国家，就会出现朝鲜、南极洲等原来不可见地区，脚本需要记住国家代码，f12将原有的国家代码改为你要的国家的代码。

### 创建隧道

打开创建[隧道页面](https://tunnelbroker.net/new_tunnel.php)，ipv4 endpoint填你的公网ipv4 地址，下面选择一个隧道服务器，可以直接选择你服务器附近地区的隧道服务器，也可以全部 ping 一遍，选择延迟最低的。推荐使用/48 作为服务器ipv6 段，但由于新账号的原因，可能需要 24~72 小时才能分配，就像这样 

![](/images/screenshot2026-09-06-12-45-14-660commicrosoftemmx.webp)

这段时间可以先用/64 做连通性测试

## 配置vps

**此部分为ai生成**  
选择 **example configurations** 一栏，选择你的操作系统，这里以 **linux** 为例，然后选择 **router2**。tunnelbroker 会生成类似下面的配置：

\`\`\`bash
modprobe ipv6
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip addr add 2001:470:23:844::2/64 dev he-ipv6
ip route add ::/0 dev he-ipv6
ip -f inet6 addr
\`\`\`

其中 \`74.82.46.6\` 是 tunnelbroker 服务器 ipv4，\`47.86.38.16\` 是 vps 公网 ipv4，\`2001:470:23:844::1\` 是 tunnelbroker 服务器 ipv6，\`2001:470:23:844::2\` 是分配给 vps 的 ipv6。实际配置时以 tunnelbroker 页面显示的参数为准。

### 临时测试

正式配置之前建议先执行 tunnelbroker 提供的配置测试隧道是否正常：

\`\`\`bash
modprobe sit
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 47.86.38.16 ttl 255
ip link set he-ipv6 up
ip -6 addr add 2001:470:23:844::2/64 dev he-ipv6
ip -6 route add default via 2001:470:23:844::1 dev he-ipv6
\`\`\`

测试 tunnelbroker 节点：

\`\`\`bash
ping -6 2001:470:23:844::1
\`\`\`

测试公网 ipv6：

\`\`\`bash
ping -6 2001:4860:4860::8888
\`\`\`

查看公网 ipv6：

\`\`\`bash
curl -6 https://api64.ipify.org
\`\`\`

如果能够正常返回 ipv6 地址，说明隧道配置成功。

> 如果无法连接，首先检查 vps 防火墙和云厂商安全组是否允许 **ipv4 protocol 41**。注意 protocol 41 不是 tcp/udp 端口 41，而是 ipv4 协议号。

### 配置持久化

上面的 \`ip tunnel add\` 配置只在当前运行周期有效，vps 重启后会消失。debian 12 推荐使用 **systemd-networkd** 进行持久化。

首先让系统开机自动加载 sit 模块：

\`\`\`bash
echo sit > /etc/modules-load.d/sit.conf
\`\`\`

创建 tunnel 配置：

\`\`\`bash
nano /etc/systemd/network/10-he-ipv6.netdev
\`\`\`

写入：

\`\`\`ini
[netdev]
name=he-ipv6
kind=sit
mtubytes=1480

[tunnel]
local=47.86.38.16
remote=74.82.46.6
ttl=255
\`\`\`

其中 \`local\` 填 vps 公网 ipv4，\`remote\` 填 tunnelbroker 的 server ipv4。

然后创建 ipv6 网络配置：

\`\`\`bash
nano /etc/systemd/network/20-he-ipv6.network
\`\`\`

写入：

\`\`\`ini
[match]
name=he-ipv6

[network]
address=2001:470:23:844::2/64
gateway=2001:470:23:844::1
\`\`\`

其中 \`address\` 填 tunnelbroker 分配的 client ipv6，\`gateway\` 填 server ipv6。

启用 \`systemd-networkd\`：

\`\`\`bash
systemctl enable --now systemd-networkd
\`\`\`

如果服务器已经使用 \`systemd-networkd\`，不要覆盖原有网络配置。需要在物理网卡对应的 \`.network\` 文件中的 \`[network]\` 部分加入：

\`\`\`ini
tunnel=he-ipv6
\`\`\`

例如网卡为 \`eth0\`：

\`\`\`ini
[match]
name=eth0

[network]
dhcp=yes
tunnel=he-ipv6
\`\`\`

配置完成后重新加载：

\`\`\`bash
systemctl restart systemd-networkd
\`\`\`

检查隧道：

\`\`\`bash
networkctl status he-ipv6
\`\`\`

检查 ipv6：

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

确认正常后重启 vps：

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

如果重启后 \`he-ipv6\` 仍然存在并且可以正常访问 ipv6，说明持久化配置成功。

### 防火墙

tunnelbroker 使用 **ipv4 protocol 41** 建立 6in4 隧道，因此 vps 本机防火墙以及云厂商安全组都不能拦截该协议。如果使用 nftables，可以允许 ipv4 protocol 41：

\`\`\`bash
nft add rule inet filter input ip protocol 41 accept
\`\`\`

具体规则需要根据服务器现有的 nftables 配置进行调整。

### routed /64和/48

tunnelbroker 创建隧道后通常还会提供 routed \`/64\` 或 \`/48\`。隧道本身使用的 \`/64\` 主要用于 vps 与 tunnelbroker 节点通信，而 routed prefix 可以用于其他服务器、虚拟机、docker 容器等设备。

如果只是让当前 vps 获得 ipv6，使用 tunnelbroker 提供的 tunnel \`/64\` 即可；如果需要给多个设备分配 ipv6，则推荐使用 \`/48\`。例如：

\`\`\`text
2001:470:xxxx::/48
├── 2001:470:xxxx:1::/64
├── 2001:470:xxxx:2::/64
├── 2001:470:xxxx:3::/64
└── ...
\`\`\`

这样可以从 \`/48\` 中划分多个 \`/64\`，分别用于不同的服务器、虚拟机或网络。

## 配置warp

不推荐直接使用warp cli，建议使用3x-ui，能在面板直观创建入站、出站。

创建入站及配置客户端后，点击侧栏出站 

![](/images/screenshot2026-09-06-13-05-07-556commicrosoftemmx.webp)

编辑配置中只需要改为ipv6 优先 

![](/images/screenshot2026-09-06-13-07-18-743commicrosoftemmx.webp)

再将warp移动到第一个，至此，配置完成，只需等待同步

## 体验

等待了接近半个月，b站终于将warp的ip标为朝鲜

![](/images/screenshot2026-09-06-13-10-55-395markvia.webp)

![](/images/screenshot2026-09-06-13-11-09-365markvia.webp)

b站评论区文章ip归属都会显示为朝鲜，主页需要1~3 周才会改变

这里贴一张b站评论测试图

![](/images/screenshot2026-09-06-13-14-38-528tvdanmakubili.webp)

也是可以愉快地发评论了😋

cloudflare warp tunelbroker ipv6 tunnel`,archlinux:`archlinux使用体验
关于我的archlinux的使用体验
# 缘起

偶然间在b站上看到一个archlinux的使用视频，在观看完后，b站开始推送更多的arch视频，我也就开始了尝试

# 安装

arch安装对于安装到整个硬盘/虚拟机用户无疑是方便的，但在实际使用中，可能是windows/linux或想从debian/ubuntu迁移到archlinux。

## 分盘

### windows

windows装双系统算是简单的了，进pe分一个100g的盘基本就够archlinux的日常使用了。

### linux

linux想要安装双系统，分盘时给我的感觉非常麻烦，他不能像windows一样进pe（大部分pe都是windows内核，所以对ext4分区不太友好，显示错误）。经过我一个多小时各种尝试，最终选择整盘安装😅。这玩意用linux应用分区又提示不支持，我整盘安装是因为这个盘就是给linux的原debian没什么重要数据。

:::warning  
数据无价，在格式化硬盘前请先确认已备份重要数据  
:::

## live系统安装

按自己主板方法进入live系统后，如果你是使用网线，可以一步到位直接使用archinstall命令。对于需使用无线网络的，使用iwctl。具体安装可以去b站自己搜索，这里给一个链接[https://b23.tv/qo9xusq](https://b23.tv/qo9xusq)

# 换源

安装系统后对于我们中国用户，第一件事必须是换源，这里推荐直接用成品一键脚本[https://linuxmirrors.cn](https://linuxmirrors.cn/)

镜像源按自己喜好选

# 输入法

安装中文输入法应该算是第二步，b站教程也有，但这里说一下我踩的坑，我用的是ghome桌面，设置里全翻了一遍也没找到pinyin，问豆沙包还让我选汉语，这里正确方式应该去应用列表里找到fcitx5配置，在这个应用里去选汉语

# 槽点

用惯了windows/debian系这些系统后，我相信下载应用习惯应该都是去浏览器搜索应用，而arch系由于没有使用apt，但拥有yay库，就出现了一个处境：*官网没有安装包，得单独搜yay包*

对于已经习惯用户，这个yay方式真的很麻烦
arch linux thoughts`,"kick-live-notify":`kick 开播提醒：用 python 监控直播并推送 qq 通知
基于 kick 私有 api 监控主播开播状态，通过 napcat (onebot 11) 发送 qq 消息通知
# 前言
kick 是一个比较新的直播平台，虽然没有 twitch 那么火，但也吸引了不少主播。

如果你想关注某个 kick 主播，但又不想一直开着网页等他开播，那就可以用脚本自动监控，开播了直接推消息到 qq。

本文介绍一个用 python 写的 kick 开播提醒工具，通过 napcat 对接 qq，支持私聊和群聊通知。

# kick api 介绍
kick 有一个私有 api 可以查询主播的直播状态：

\`\`\`
get https://api.kick.com/private/v1/channels/{channel}/livestream
\`\`\`

其中 \`{channel}\` 是主播的用户名（频道名），比如 \`xctraveller\`。

请求示例：
\`\`\`bash
curl "https://api.kick.com/private/v1/channels/xctraveller/livestream" \\
  -h "user-agent: mozilla/5.0" \\
  -h "accept: application/json"
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
这是 kick 的私有 api，没有官方文档，随时可能变动。目前不需要认证，但未来可能需要。
:::

# napcat (onebot 11) 简介
napcat 是一个基于 qqnt 的 bot 框架，实现了 onebot 11 协议。通过它可以：
- 发送私聊消息
- 发送群聊消息
- 以及更多 qq bot 功能

onebot 11 提供了 http api，我们只需要调用 \`send_private_msg\` 或 \`send_group_msg\` 接口就能发送消息。

# 工作原理
整体流程很简单：

1. 定时请求 kick api 查询主播状态
2. 如果检测到开播且之前未通知 → 发送开播通知
3. 如果检测到下播且之前已通知 → 发送下播通知
4. 使用一个 \`set\` 记录已通知的主播，避免重复通知

为了防止程序重启时误发通知，启动时会先同步一次当前状态，只记录不通知。

# 代码实现

## 检查直播状态
\`\`\`python
def check_live(channel: str) -> tuple[bool, dict | none]:
    url = f"https://api.kick.com/private/v1/channels/{channel}/livestream"
    req = urllib.request.request(url, headers={
        "user-agent": "mozilla/5.0 (linux; android 14) applewebkit/537.36",
        "accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read().decode())
            livestream = body.get("data", {}).get("livestream")
            if livestream and livestream.get("id"):
                return (false, livestream)
            return (false, none)
    except (urllib.error.urlerror, urllib.error.httperror, 
            json.jsondecodeerror, oserror) as e:
        print(f"[错误] 检查 {channel} 失败: {e}", file=sys.stderr)
        return (true, none)
\`\`\`

返回值设计：
- \`(false, livestream)\` — 正在直播
- \`(false, none)\` — 确认未开播
- \`(true, none)\` — 查询失败，跳过本轮

## 发送 napcat 消息
\`\`\`python
def napcat_send(config: dict, endpoint: str, params: dict) -> bool:
    napcat = config["napcat"]
    url = f"http://{napcat['host']}:{napcat['port']}/{endpoint}"
    body = json.dumps(params).encode("utf-8")
    headers = {"content-type": "application/json"}
    if napcat.get("token"):
        headers["authorization"] = f"bearer {napcat['token']}"
    req = urllib.request.request(url, data=body, headers=headers, method="post")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
            return result.get("retcode") == 0
    except (urllib.error.urlerror, urllib.error.httperror, oserror):
        return false
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

while true:
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
| \`napcat.host\` | napcat http 服务地址 |
| \`napcat.port\` | napcat http 服务端口 |
| \`napcat.token\` | napcat 访问令牌（可选） |
| \`notify.private\` | 私聊通知的 qq 号列表 |
| \`notify.group\` | 群聊通知的群号列表 |
| \`streamers\` | 要监控的 kick 主播用户名列表 |
| \`check_interval\` | 检查间隔（秒） |

# 部署运行

## 环境要求
- python 3.10+
- napcat 已部署并运行

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
screen -s kick
python3 kick_notify.py
# ctrl+a d 断开
\`\`\`

# 效果示例
开播通知：
\`\`\`
🔴 xctraveller 开播了!
标题: 晚上打游戏
分类: gta v
观众: 42
链接: https://kick.com/xctraveller
\`\`\`

下播通知：
\`\`\`
⚫ xctraveller 下播了
链接: https://kick.com/xctraveller
\`\`\`

# 注意事项
- kick 的私有 api 没有官方保证，可能随时失效或变更
- 检查间隔不要太短，30 秒到 1 分钟比较合理，避免被限流
- napcat 需要先部署好，具体部署方法请参考 napcat 官方文档
- 程序重启时不会发送重复通知，会先同步当前状态

# end
一个简单但实用的小工具。如果你也想监控 kick 主播的开播状态，可以直接用这个脚本，改改配置就行。

# 额外感想
在制作之初，我是直接问chatgpt如何做，甚至都没用搜索引擎查一下，chatgpt说用webhook并使用fastapi封装，翻了十几分钟文档没咋看明白，直到直接用opencode+免费的mimo说了我要做开播提醒，mimo一开始其实也没多好，甚至想出来轮询每页找到目标，在他自己fetch几遍后直接用了kick的api，不过也算是完美完成了。

python kick qq onebot napcat`,"mc-srv-worker":`mc免端口域名生成器使用与部署教程
基于cloudflare workers的minecraft免端口域名服务，让你的mc服务器玩家无需输入端口号
# 前言
玩minecraft的都知道，开服的时候如果用了非默认端口（不是25565），连接的时候就得在域名后面加个冒号再填端口号，比如 \`play.example.com:25566\`，对于不熟悉的人来说还挺麻烦的。

有没有办法让玩家只输域名就能连上？有的兄弟，有的。

今天介绍的 **mc-srv-worker** 就是干这个的——基于 cloudflare workers 自动创建 dns srv 记录，让 minecraft java 版服务器实现"免端口"连接。

# 这东西怎么工作的
minecraft java 版在连接服务器时支持 dns srv 记录查询。简单来说，就是可以在 dns 层面把一个域名映射到指定的地址和端口，客户端会自动解析并连接。

mc-srv-worker 就是利用了这个特性：
- 你提供服务器地址和端口
- 它在 cloudflare dns 上自动创建 srv 记录
- 如果目标是 ip 地址，还会额外创建一个 a 记录（因为 cloudflare 的 srv 不支持直接填 ip）
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
- **删除**：填入前缀和授权码，点击删除即可清理 dns 记录

## 在 minecraft 中使用
拿到域名后，玩家在 minecraft java 版中直接输入这个域名就能连接，不需要加端口号。

# 自己部署
不想用公共实例？自己部署也很简单。

## 先决条件
- 一个 [cloudflare](https://dash.cloudflare.com) 账号
- 一个托管在 cloudflare 上的域名
- cloudflare api token（需要 **编辑 dns** 权限，仅目标域名所在区域即可）
- [node.js](https://nodejs.org/) 环境

## 步骤

### 1. 克隆项目
\`\`\`bash
git clone https://github.com/wwwaaa123122/mc-srv-worker.git
cd mc-srv-worker
\`\`\`

### 2. 创建 kv 命名空间
\`\`\`bash
npx wrangler kv:namespace create mc_kv
\`\`\`
执行后会返回一个 kv 命名空间 id，记下来。

### 3. 配置 wrangler.toml
编辑 \`wrangler.toml\`，填入你的信息：

\`\`\`toml
name = "mc-srv-worker"
main = "src/index.js"
compatibility_date = "2025-08-11"

[[kv_namespaces]]
binding = "mc_kv"
id = "上一步获取的kv_id"

[vars]
cf_api_token = ""    # 留空，后面用 secret 设置
cf_zone_id = ""      # 留空，后面用 secret 设置
base_domain = "你的域名"  # 例如 example.com
rate_limit = "5"      # 每ip每分钟最大创建次数

[assets]
directory = "./public"
binding = "assets"
\`\`\`

### 4. 设置 secrets
敏感信息不要写在配置文件里，用 wrangler secret 设置：

\`\`\`bash
npx wrangler secret put cf_api_token
# 输入你的 cloudflare api token

npx wrangler secret put cf_zone_id
# 输入你的域名区域 id（在 cloudflare 域名概览页面底部可以找到）
\`\`\`

### 5. 部署
\`\`\`bash
npx wrangler deploy
\`\`\`

部署成功后会给你一个 \`*.workers.dev\` 的域名，也可以在 cloudflare 面板绑定自定义域名。

## api 接口
如果你想自己写前端或者集成到其他地方，可以直接调用 api：

### 创建域名
\`\`\`bash
curl -x post https://你的域名/api/create \\
  -h "content-type: application/json" \\
  -d '{"address": "1.2.3.4:25566", "prefix": "myserver"}'
\`\`\`

返回：
\`\`\`json
{
  "success": true,
  "domain": "myserver.example.com",
  "authcode": "a1b2c3d4e5f67890"
}
\`\`\`

### 修改解析
\`\`\`bash
curl -x post https://你的域名/api/update \\
  -h "content-type: application/json" \\
  -d '{"sub": "myserver", "target": "5.6.7.8", "port": 25567, "authcode": "a1b2c3d4e5f67890"}'
\`\`\`

### 删除解析
\`\`\`bash
curl -x post https://你的域名/api/delete \\
  -h "content-type: application/json" \\
  -d '{"sub": "myserver", "authcode": "a1b2c3d4e5f67890"}'
\`\`\`

# 注意事项
- 每个域名创建后会生成一个 **授权码**，修改或删除时必须提供，请妥善保存
- 每 ip 每分钟有创建次数限制（默认 5 次），防止滥用
- 目标地址格式必须为 \`地址:端口\`
- 端口范围：\`1\` ~ \`65535\`
- 授权码是 16 位的十六进制字符串，丢了就没了，记得备份

# end
就这样，很简单的一个小工具。有公网服务器的可以自己部署一个，没有的用公共实例也行。祝大家开服愉快！

### 后记
纯纯不知道写啥了，稍稍水个文章qwq

minecraft cloudflare workers`,"Why-to-Firefly":`关于本站迁移至firefly
讲述从fuwari迁移至firefly的一些原因

## 缘起

博客已经运行了很长一段时间，最初选择的是 fuwari 主题。fuwari 确实是一个不错的主题，简洁美观，但随着使用深入，我逐渐发现一些问题，最终促使我迁移到了 firefly。

## fuwari：想要的功能需要自己加

fuwari 的设计理念是**轻量、简洁**，这既是优点也是局限。当我想要为博客添加一些功能时，发现：

- **评论系统**需要自己集成，fuwari 并没有内置支持
- **说说/动态页面**没有现成方案
- **赞助页面、打赏功能**需要从零开始
- **音乐播放器、实验室页面**等高级功能全部要自己动手

每一次「想要什么功能就自己加」的过程，实际上是在消耗大量的时间和精力。对于一个希望专注于内容创作的博主来说，这无疑是一种负担。

## 自定义之路：改着改着，功能就废了

更让人头疼的是自定义过程中的问题。fuwari 的代码结构在经过多次修改后，**依赖冲突、样式覆盖、功能失效**接踵而来：

- 升级主题版本后，之前手动添加的功能全部需要重新适配
- 为了实现某个功能修改了核心代码，结果导致其他功能异常
- css 样式互相覆盖，调试起来苦不堪言

每次折腾完，都感觉「杀敌一千，自损八百」。

## firefly：开箱即用，面面俱到

迁移到 firefly 后，这些问题迎刃而解。firefly 最大的优势在于其**功能丰富且开箱即用**：

| 功能 | fuwari | firefly |
|------|--------|----------|
| 评论系统 | ❌ 需自行集成 | ✅ 内置支持 |
| 说说/动态 | ❌ 需自行开发 | ✅ 已有方案 |
| 赞助页面 | ❌ 需自行实现 | ✅ 已有功能 |
| 实验室/工具 | ❌ 需自行开发 | ✅ 多种工具可用 |
| 主题配置 | ⚠️ 需要魔改 | ✅ 配置文件搞定 |

firefly 几乎覆盖了我所有的使用需求，不需要再为了一个功能而耗费大量时间研究、调试。对于我这样的博主来说，**把时间花在内容创作上，远比花在折腾主题上更有价值**。

## 写在最后

选择博客主题就像选择工具：合适的才是最好的。fuwari 适合喜欢折腾、追求极简的用户；而 firefly 则适合希望专注于内容、同时需要丰富功能的博主。

如果你也在 fuwari 中挣扎于各种自定义，不妨试试 firefly，说不定会打开新世界的大门。

firefly fuwari`,"ssh-by-tunnel":`通过cloudflare tunnel使用ssh
通过cloudflare tunnel连接无公网ip的服务
# 前言

在没有公网的条件下我们想访问无公网ip往往只能通过frp或ipv6，本篇文章将介绍使用cloudflare tunnel连接内网中的ssh服务  

# 准备

## 先决条件

- [cloudflare](https://dash.cloudflare.com)账号，没有的自行注册一个，并需绑定一张信用卡（不会扣费） 
- 一个托管在cloudflare上的域名

## 安装tunnel

打开[zero trust](https://one.dash.cloudflare.com)团队名随便写一个，在左侧边栏找到 **网络** ，选择 **连接器** 。进来后点击 **添加隧道** ，隧道类型选项 **cloudflared** ，名称依旧随便取，保存隧道后选择系统类型，下面我以ubuntu 64-bit 为例  

### 安装 cloudflared

可将给的shell脚本保存为.sh执行，连上需远程ssh的终端，执行  

\`\`\`bash
cat << 'eof' > install_cloudflared.sh
#!/bin/bash

# add cloudflare gpg key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fssl https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null

# add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
sudo apt-get update && sudo apt-get install cloudflared
eof
\`\`\`

赋予权限  

\`\`\`bash
chmod +x install_cloudflared.sh
\`\`\`

执行脚本安装  

\`\`\`bash
./install_cloudflared.sh
\`\`\`

### 连接

执行连接页面给的 *让计算机每次启动时自动运行隧道* 这条命令

\`\`\`bash
sudo cloudflared service install <你的令牌>
\`\`\`

若 **connectors** 列表中出现了您的设备，则说明安装成功。

# 配置tunnel及应用

### 发布应用程序路由

- 子域：随便填 示例：ssh  
- 域：选择你的域名  
- 路径：空着  
- 服务类型：ssh  
- url：127.0.0.1

### 配置应用程序

侧栏中选中 **访问控制** → **应用程序** → **添加应用程序**   

类型选择 **自托管** ，名称依旧随便写，会话持续时间看你自己，我这里选的是6小时  

点击 **添加公共主机名** 
输入方式默认，但子域及域要填写与***发布应用程序路由***  **一致的** ，展开下面的**浏览器呈现设置** 启用*允许自动 cloudflared 身份验证*  
浏览器呈现选择**ssh**  
下面需创建一个策略，名称依旧随便写，操作选择*允许*  
认证方式自己选一个方便的，我这里选的是email即邮箱，其它的看自己最后点保存，回到配置页面，选择好刚刚配置的规则，没其它要求一直点下一步，至此配置就结束了。  

# 最终体验

打开你的域名，此时应会跳转到cloudflare的验证界面，按照你自己选择的验证方式过后应该就会跳转到输入*user* 的界面，输入你的用户名提交后输入密码，至此就大功告成了。
cloudflare tunnel ssh`,"how-use-bot":`bot使用文档
星辰旅人bot使用文档
:::warning
变量部分均使用{}包裹，多选项用/分隔
:::
# llm
## deepseek
切换命令：**#deepseek**
常用模型，回复速度快，稳定
缺点：无法识别图片
## gemini
切换命令：#gemini
可以识别图片
缺点：有速率限制，超过范围会报错429
## gpt  
切换命令：#gpt4/#gpt
此模型为替代模型，可联网搜索
缺点：由于是非官方api，服务可能不稳

# rua
命令：#rua {@一个用户/qq号}
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
命令：#生图 {pixiv/acg}  {标签}
介绍：
* pixiv为从p站拉取一张图
* acg的标签只有：随机、电脑壁纸、头像、手机背景、壁纸
# http
命令：#http {网址}
介绍：测试网站是否能访问并返回状态码  

# banme
命令：banme
介绍：当bot为该群管理时会禁用1~5小时，适用于安心睡觉
 
# 今日运势
命令：今日运势
介绍：返回今日运势

# 名人名言
命令：#名人名言 {引用一条消息}
介绍：制作一个名言图片

# mc服务器状态
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
命令：#大头照 {@一个用户/qq号}
介绍：发送该用户的qq头像

# whois
命令：#whois {域名}
介绍：查询该域名信息

# 点赞
命令：赞我/超我
介绍：给你qq名片点赞

# 伪造消息
命令：#伪造消息 {qq号/@一个用户}说{内容}  
多条消息格式：#伪造消息 {qq号/@一个用户}说{消息1}|{qq号/@一个用户}说{消息2}  
更多条以此类推
介绍：转发伪造合并转发的消息

# 角色扮演
命令：#角色扮演  
介绍：查看bot的所有预设





bot`,"fuwari-rss":`fuwari修复rss图片不显示
修复rss图片链接问题
# 前言  
啊大家都知道，fuwari的rss如果你用的是相对路径，那么生成的rss将也是相对路径，但这样就看不了图了啊，所以本章将带你修复它  
# 修改rss配置文件  
打开**src/pages/rss.xml.ts**，当然你也可以直接删了  
直接一个全选删除再将下面的配置粘贴填入  
\`\`\`typescript
import rss from '@astrojs/rss';
import sanitizehtml from 'sanitize-html';
import markdownit from 'markdown-it';
import { getcollection } from 'astro:content';
import { siteconfig } from '@/config';
import { parse as htmlparser } from 'node-html-parser';
import { getimage } from 'astro:assets';
import type { apicontext, imagemetadata } from 'astro';
import type { rssfeeditem } from '@astrojs/rss';
import { getsortedposts } from '@/utils/content-utils';

const markdownparser = new markdownit();

// get dynamic import of images as a map collection
const imagesglob = import.meta.glob<{ default: imagemetadata }>(
	'/src/content/**/*.{jpeg,jpg,png,gif,webp}', // include posts and assets
);

export async function get(context: apicontext) {
	if (!context.site) {
		throw error('site not set');
	}

	// use the same ordering as site listing (pinned first, then by published desc)
	const posts = await getsortedposts();
	const feed: rssfeeditem[] = [];

	for (const post of posts) {
		// convert markdown to html string
		const body = markdownparser.render(post.body);
		// convert html string to dom-like structure
		const html = htmlparser.parse(body);
		// hold all img tags in variable images
		const images = html.queryselectorall('img');

		for (const img of images) {
			const src = img.getattribute('src');
			if (!src) continue;

			// handle content-relative images and convert them to built _astro paths
			if (src.startswith('./') || src.startswith('../')) {
				let importpath: string | null = null;

				if (src.startswith('./')) {
					// path relative to the post file directory
					const prefixremoved = src.slice(2);
					importpath = \`/src/content/posts/\${prefixremoved}\`;
				} else {
					// path like ../assets/images/xxx -> relative to /src/content/
					const cleaned = src.replace(/^\\.\\.\\//, '');
					importpath = \`/src/content/\${cleaned}\`;
				}

				const imagemod = await imagesglob[importpath]?.()?.then((res) => res.default);
				if (imagemod) {
					const optimizedimg = await getimage({ src: imagemod });
					img.setattribute('src', new url(optimizedimg.src, context.site).href);
				}
			} else if (src.startswith('/')) {
				// images starting with \`/\` are in public dir
				img.setattribute('src', new url(src, context.site).href);
			}
		}

		feed.push({
			title: post.data.title,
			description: post.data.description,
			pubdate: post.data.published,
			link: \`/posts/\${post.slug}/\`,
			// sanitize the new html string with corrected image paths
			content: sanitizehtml(html.tostring(), {
				allowedtags: sanitizehtml.defaults.allowedtags.concat(['img']),
			}),
		});
	}

	return rss({
		title: siteconfig.title,
		description: siteconfig.subtitle || 'no description',
		site: context.site,
		items: feed,
		customdata: \`<language>\${siteconfig.lang}</language>\`,
	});
}
\`\`\`  
保存了，还需要安装一个pnpm包，不用管是什么，能帮我们转换成链接就是的了  
\`\`\`bash
pnpm add node-html-parser
\`\`\`  
:::warning
在推送到仓库时，你可能会遇到warning: in the working copy of 'pnpm-lock.yaml', lf will be replaced by crlf the next time git touches it 这是由于空格不同引起的，但并不会影响部署，忽略即可
:::  
fuwari rss`,"fuwari-404":`为fuwari增加一个404界面
为fuwari添加一个好看的404界面
# 本文章分为两部分  
### 适配多语言的404界面  
打开**src/i18n/i18nkey.ts**  
\`\`\`typescript
	license = "license",
	friends = "friends",

	// 404 page
	notfound = "notfound",
	notfoundtitle = "notfoundtitle",
	notfoundmessage = "notfoundmessage",
	backtohome = "backtohome",
	viewarchive = "viewarchive",
\`\`\`  
再分别打开languages下的**en.ts**和**zh_cn.ts**  
en.ts
\`\`\`typescript
	[key.license]: "license",
	[key.friends]: "friends",

	// 404 page
	[key.notfound]: "page not found",
	[key.notfoundtitle]: "oops! page not found",
	[key.notfoundmessage]: "the page you are looking for doesn't exist. it may have been moved or deleted.",
	[key.backtohome]: "back to home",
	[key.viewarchive]: "view archive",
\`\`\`  
zh_cn.ts
\`\`\`typescript
	[key.license]: "许可协议",
	[key.friends]: "友链",

	// 404 page
	[key.notfound]: "页面未找到",
	[key.notfoundtitle]: "哎呀！页面走丢了",
	[key.notfoundmessage]: "您访问的页面不存在，可能已被删除或链接有误。",
	[key.backtohome]: "返回首页",
	[key.viewarchive]: "查看归档",
\`\`\`  
最后在**src/pages**目录下创建**404.astro**  
\`\`\`astro
---
import { icon } from "astro-icon/components";
import maingridlayout from "../layouts/maingridlayout.astro";
import i18nkey from "../i18n/i18nkey";
import { i18n } from "../i18n/translation";
import { url } from "../utils/url-utils";
import { siteconfig } from "../config";
---

<maingridlayout title={i18n(i18nkey.notfound)} description={i18n(i18nkey.notfoundmessage)}>
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-96">
        <div class="card-base z-10 px-6 md:px-12 py-8 md:py-12 relative w-full">
            <!-- 404 content -->
            <div class="flex flex-col items-center text-center space-y-6">
                <!-- large 404 number -->
                <div class="relative opacity-0 animate-fade-in-up">
                    <div class="text-8xl md:text-9xl font-bold bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] bg-clip-text text-transparent select-none">
                        404
                    </div>
                    <!-- decorative elements -->
                    <div class="absolute -top-4 -right-4 w-8 h-8 bg-[var(--primary)] rounded-full opacity-20 animate-pulse"></div>
                    <div class="absolute -bottom-2 -left-2 w-6 h-6 bg-[var(--primary)] rounded-full opacity-30 animate-pulse" style="animation-delay: 0.5s;"></div>
                </div>

                <!-- title and message -->
                <div class="space-y-3 max-w-md opacity-0 animate-fade-in-up animate-delay-100">
                    <h1 class="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                        {i18n(i18nkey.notfoundtitle)}
                    </h1>
                    <p class="text-75 text-base md:text-lg leading-relaxed">
                        {i18n(i18nkey.notfoundmessage)}
                    </p>
                </div>

                <!-- illustration -->
                <div class="py-4 opacity-0 animate-fade-in-up animate-delay-200">
                    <div class="relative w-32 h-32 mx-auto animate-float">
                        <!-- simple geometric illustration -->
                        <div class="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[oklch(0.65_0.18_var(--hue))] rounded-full opacity-10"></div>
                        <div class="absolute inset-4 bg-[var(--card-bg)] rounded-full border-2 border-[var(--primary)] border-opacity-20"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <icon name="fa6-solid:location-crosshairs" class="w-12 h-12 text-[var(--primary)] opacity-60" />
                        </div>
                    </div>
                </div>

                <!-- action buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4 opacity-0 animate-fade-in-up animate-delay-300">
                    <a href={url("/")} 
                       class="btn-regular px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        <icon name="fa6-solid:house" class="w-4 h-4" />
                        {i18n(i18nkey.backtohome)}
                    </a>
                    <a href={url("/archive")} 
                       class="btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]">
                        <icon name="fa6-solid:box-archive" class="w-4 h-4" />
                        {i18n(i18nkey.viewarchive)}
                    </a>
                    <a href={url("/about")} 
                       class="btn-card px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[var(--line-divider)]">
                        <icon name="fa6-solid:circle-info" class="w-4 h-4" />
                        {i18n(i18nkey.about)}
                    </a>
                </div>

                <!-- additional help text -->
                <div class="pt-6 text-sm text-50">
                    <p class="transition-all duration-300">
                        {siteconfig.lang === 'zh_cn' ? '如果您认为这是一个错误，请联系网站管理员。' : 'if you believe this is an error, please contact the site administrator.'}
                    </p>
                </div>
            </div>
        </div>
    </div>
</maingridlayout>

<style>
    @keyframes float {
        0%, 100% { transform: translatey(0px); }
        50% { transform: translatey(-10px); }
    }
    
    @keyframes fadeinup {
        from {
            opacity: 0;
            transform: translatey(30px);
        }
        to {
            opacity: 1;
            transform: translatey(0);
        }
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .animate-fade-in-up {
        animation: fadeinup 0.6s ease-out forwards;
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
import layout from "@/layouts/layout.astro";
import maingridlayout from "@/layouts/maingridlayout.astro";
import { icon } from "astro-icon/components";
import { siteconfig } from "@/config";
---

<layout title="页面未找到">
        <maingridlayout>
                <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <!-- 404 图标 -->
                        <div class="mb-8">
                                <div class="relative">
                                        <div class="text-8xl md:text-9xl font-bold text-[var(--primary)] opacity-20">
                                                404
                                        </div>
                                        <div class="absolute inset-0 flex items-center justify-center">
                                                <icon name="fa6-solid:face-sad-tear" class="text-6xl md:text-7xl text-[var(--primary)]" />
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
                                        请检查url是否正确，或者返回首页继续浏览。
                                </p>

                                <!-- 导航按钮 -->
                                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a href="/" class="btn-regular-dark px-6 py-3 rounded-lg text-white font-medium">
                                                <icon name="fa6-solid:house" class="mr-2" />
                                                返回首页
                                        </a>
                                        <a href="/archive/" class="btn-regular px-6 py-3 rounded-lg font-medium">
                                                <icon name="fa6-solid:box-archive" class="mr-2" />
                                                文章归档
                                        </a>
                                </div>
                        </div>

                        <!-- 返回提示 -->
                        <div class="mt-8 text-50 text-sm">
                                <p class="flex items-center justify-center">
                                        <icon name="fa6-solid:clock-rotate-left" class="mr-2" />
                                        您也可以使用浏览器的后退按钮返回上一页
                                </p>
                        </div>
                </div>
        </maingridlayout>
</layout>
\`\`\`  

fuwari`,ba2th:`ba周年庆直接9个彩
两个亚子还有礼服日奈
快哉快哉
![亚子](../images/yazi.webp)  
![日奈](../images/rinai.webp)  
还有我的支付宝和qq主题😋  
![支付宝](../images/ba-alipay.webp)  
![qq](../images/ba-qq.webp)

blue archive`,comment:`fuwari接入评论功能
让你的fuwari接入评论，并让它在文章末显示出
# giscus
想要接入评论，肯定需要一个三方平台 [giscus](https://giscus.app/zh-cn)
giscus就是一个非常合适的平台  
# 配置giscus
首先去github创建一个存储库，**一定要是公开库**
然后在仓库设置中**启用**\`discussion\`功能  
前往https://giscus.app/zh-cn
在\`仓库\`一栏中点击第二步的蓝字安装giscus，最后填写自己的用户名及刚刚创建的仓库名称  
### 映射
我只建议使用\`pathname\`：以文章路径区分评论区，即使换域名也能匹配  
其它映射可以看官方介绍  
分类选择**公告（announcements）**  
特性个人建议勾选**1 3 4**  
主题默认即可，也可以尝试官方的其它主题  
最后将给出的js复制  
# 配置fuwari
在\`src/pages/posts/\`目录下找到\`[...slug].astro\`，在它的**135行**插入
\`\`\`astro
<div id="giscus-comments" style="margin-top: 3rem;">
  你的js
</div>
\`\`\`

最后本地测试一下，没问题就可以部署到服务器了
fuwari`,"edgeone-worker":`edgeone加速worker
如何使用edgeone加速cf worker
有人问：主包主包cloudflare worker访问速度太慢了，有没有更强势的访问速度呢？

有的兄弟，有的

去 [edgeone](https://edgeone.ai/zh/get-free-plan) 拿下不要钱的计划，添加你的域名，验证所有权，这步如果不会请退出

回到我们的cloudflare，选择你想加速的worker，添加自定义域，**选择路由**，选择你要加速的根域名，在你想要加速的子域+eo（方便区分），如我要加速www.91sssvip.top，就填wwweo.91sssvip.top/\\*，在去cloudflare添加dns解析a记录随便指向一个ip，但**一定要开小黄云**，保存回到edgeone

添加加速域名，我就填www，v6随便，我个人选择关闭，源站就写刚刚路由的域名协议https即可，**回源host头一定要选使用源站域名**，最后保存就好啦

end

cloudflare edgeone`};export{e as default};