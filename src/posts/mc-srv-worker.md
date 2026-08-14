---
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
玩Minecraft的都知道，开服的时候如果用了非默认端口（不是25565），连接的时候就得在域名后面加个冒号再填端口号，比如 `play.example.com:25566`，对于不熟悉的人来说还挺麻烦的。

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
1. 在输入框填入你的服务器地址和端口，格式为 `地址:端口`，例如：
   - `play.example.com:25565`
   - `1.2.3.4:25566`
2. 可选填自定义前缀，不填会自动生成一个 `mc-xxxxxx` 格式的前缀
3. 点击「生成域名」
4. 成功后会返回一个类似 `mc-abc123.zako.mom` 的域名和一个 **16位授权码**

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
```bash
git clone https://github.com/wwwaaa123122/mc-srv-worker.git
cd mc-srv-worker
```

### 2. 创建 KV 命名空间
```bash
npx wrangler kv:namespace create MC_KV
```
执行后会返回一个 KV 命名空间 ID，记下来。

### 3. 配置 wrangler.toml
编辑 `wrangler.toml`，填入你的信息：

```toml
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
```

### 4. 设置 Secrets
敏感信息不要写在配置文件里，用 wrangler secret 设置：

```bash
npx wrangler secret put CF_API_TOKEN
# 输入你的 Cloudflare API Token

npx wrangler secret put CF_ZONE_ID
# 输入你的域名区域 ID（在 Cloudflare 域名概览页面底部可以找到）
```

### 5. 部署
```bash
npx wrangler deploy
```

部署成功后会给你一个 `*.workers.dev` 的域名，也可以在 Cloudflare 面板绑定自定义域名。

## API 接口
如果你想自己写前端或者集成到其他地方，可以直接调用 API：

### 创建域名
```bash
curl -X POST https://你的域名/api/create \
  -H "Content-Type: application/json" \
  -d '{"address": "1.2.3.4:25566", "prefix": "myserver"}'
```

返回：
```json
{
  "success": true,
  "domain": "myserver.example.com",
  "authCode": "a1b2c3d4e5f67890"
}
```

### 修改解析
```bash
curl -X POST https://你的域名/api/update \
  -H "Content-Type: application/json" \
  -d '{"sub": "myserver", "target": "5.6.7.8", "port": 25567, "authCode": "a1b2c3d4e5f67890"}'
```

### 删除解析
```bash
curl -X POST https://你的域名/api/delete \
  -H "Content-Type: application/json" \
  -d '{"sub": "myserver", "authCode": "a1b2c3d4e5f67890"}'
```

# 注意事项
- 每个域名创建后会生成一个 **授权码**，修改或删除时必须提供，请妥善保存
- 每 IP 每分钟有创建次数限制（默认 5 次），防止滥用
- 目标地址格式必须为 `地址:端口`
- 端口范围：`1` ~ `65535`
- 授权码是 16 位的十六进制字符串，丢了就没了，记得备份

# END
就这样，很简单的一个小工具。有公网服务器的可以自己部署一个，没有的用公共实例也行。祝大家开服愉快！

#### 后记  
纯纯不知道写啥了，稍稍水个文章qwq
