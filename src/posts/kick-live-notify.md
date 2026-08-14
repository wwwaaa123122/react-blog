---
title: Kick 开播提醒：用 Python 监控直播并推送 QQ 通知
published: 2026-06-14
description: '基于 Kick 私有 API 监控主播开播状态，通过 NapCat (OneBot 11) 发送 QQ 消息通知'
image: '/images/kick.png'
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

```
GET https://api.kick.com/private/v1/channels/{channel}/livestream
```

其中 `{channel}` 是主播的用户名（频道名），比如 `xctraveller`。

请求示例：
```bash
curl "https://api.kick.com/private/v1/channels/xctraveller/livestream" \
  -H "User-Agent: Mozilla/5.0" \
  -H "Accept: application/json"
```

返回格式：
```json
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
```

- 如果 `livestream` 存在且有 `id` 字段，说明正在直播
- 如果 `livestream` 为 `null` 或没有 `id`，说明未开播

:::warning
这是 Kick 的私有 API，没有官方文档，随时可能变动。目前不需要认证，但未来可能需要。
:::

# NapCat (OneBot 11) 简介
NapCat 是一个基于 QQNT 的 Bot 框架，实现了 OneBot 11 协议。通过它可以：
- 发送私聊消息
- 发送群聊消息
- 以及更多 QQ Bot 功能

OneBot 11 提供了 HTTP API，我们只需要调用 `send_private_msg` 或 `send_group_msg` 接口就能发送消息。

# 工作原理
整体流程很简单：

1. 定时请求 Kick API 查询主播状态
2. 如果检测到开播且之前未通知 → 发送开播通知
3. 如果检测到下播且之前已通知 → 发送下播通知
4. 使用一个 `set` 记录已通知的主播，避免重复通知

为了防止程序重启时误发通知，启动时会先同步一次当前状态，只记录不通知。

# 代码实现

## 检查直播状态
```python
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
```

返回值设计：
- `(False, livestream)` — 正在直播
- `(False, None)` — 确认未开播
- `(True, None)` — 查询失败，跳过本轮

## 发送 NapCat 消息
```python
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
```

## 构造通知消息
```python
message = (
    f"🔴 {channel} 开播了!\n"
    f"标题: {title}\n"
    f"分类: {category}\n"
    f"观众: {viewers}\n"
    f"链接: https://kick.com/{channel}"
)
```

## 主循环
```python
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
```

# 配置说明
配置文件 `config.json`：

```json
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
```

| 字段 | 说明 |
|------|------|
| `napcat.host` | NapCat HTTP 服务地址 |
| `napcat.port` | NapCat HTTP 服务端口 |
| `napcat.token` | NapCat 访问令牌（可选） |
| `notify.private` | 私聊通知的 QQ 号列表 |
| `notify.group` | 群聊通知的群号列表 |
| `streamers` | 要监控的 Kick 主播用户名列表 |
| `check_interval` | 检查间隔（秒） |

# 部署运行

## 环境要求
- Python 3.10+
- NapCat 已部署并运行

## 运行
```bash
# 直接运行
python3 kick_notify.py

# 或者用脚本启动
chmod +x run.sh
./run.sh
```

## 后台运行
```bash
# 使用 nohup
nohup python3 kick_notify.py > kick.log 2>&1 &

# 或者用 screen/tmux
screen -S kick
python3 kick_notify.py
# Ctrl+A D 断开
```

# 效果示例
开播通知：
```
🔴 xctraveller 开播了!
标题: 晚上打游戏
分类: GTA V
观众: 42
链接: https://kick.com/xctraveller
```

下播通知：
```
⚫ xctraveller 下播了
链接: https://kick.com/xctraveller
```

# 注意事项
- Kick 的私有 API 没有官方保证，可能随时失效或变更
- 检查间隔不要太短，30 秒到 1 分钟比较合理，避免被限流
- NapCat 需要先部署好，具体部署方法请参考 NapCat 官方文档
- 程序重启时不会发送重复通知，会先同步当前状态

# END
一个简单但实用的小工具。如果你也想监控 Kick 主播的开播状态，可以直接用这个脚本，改改配置就行。

# 额外感想
在制作之初，我是直接问ChatGPT如何做，甚至都没用搜索引擎查一下，ChatGPT说用webhook并使用fastapi封装，翻了十几分钟文档没咋看明白，直到直接用opencode+免费的mimo说了我要做开播提醒，mimo一开始其实也没多好，甚至想出来轮询每页找到目标，在他自己fetch几遍后直接用了kick的api，不过也算是完美完成了。
