---
title: 用 AI Agent 薅 AI 羊毛：一个 Telegram 监控频道的搭建记录
date: '2026-07-16 08:15:00'
tags:
- Telegram
- AI
- LLM
- 自动化
- RSSHub
categories:
- 笔记
cover: /img/cover/23.webp
description: RSSHub 拉公开频道 → LLM 两段过滤 → 多角度改写 → Bot 推送，附带产品页截图兜底。一台 aarch64 上的 cron 折腾。
draft: false
---

> 能用 > 看起来能用。与其手动刷频道找免费额度，不如让 Agent 自己刷。

## 起因

关注了几个 TG 羊毛频道，每天消息不少，真正有用的 AI 免费额度 / 新模型上线 / IDE 送积分之类，混在抽奖、开卡、广告里，手动翻很烦。

于是想：能不能让 AI 帮我盯着，过滤掉噪音，只推一条干净的摘要到自己的频道？

答案是可以，而且不贵——跑在自家 aarch64 小机器上，cron 每 15 分钟一轮，LLM 用免费模型，零额外成本。

## 架构

整体链路长这样：

```
公开TG频道
  → RSSHub 拉消息
  → SQLite 去重（source:msgId）
  → 关键词硬过滤（标题级）
  → LLM 预过滤（频道短文本，不爬论坛）
  → 仅对 KEEP 项：Scrapling 抓论坛首楼正文
  → LLM 二次过滤（正文级，杀软广/折扣）
  → 跨频道去重
  → LLM 多角度改写（3 角度 + 1 整合）
  → Bot 推送到目标群
  → 无图有产品链 → Playwright 截图首屏兜底
  → SQLite 标记 pushed
```

一句话：**频道短文本先判要不要看，论坛正文再判要不要推，最后 AI 重写 + 截图，推完入库。**

## 各层做了什么

### 消息来源：RSSHub

公开 TG 频道不需要 Bot API 读权限，RSSHub 提供了 `rsshub.rssforever.com/telegram/channel/<name>` 端点，直接拉最近消息为 RSS。

每个频道限 10 条/轮，够用。RSSHub 有时不稳，多个实例轮换即可。

### 去重：SQLite

每条消息的 `source_channel:msg_id` 作为主键入 `channel_posts` 表，状态流转 `seen → filtered → pushed`。跨频道去重用 `dedupe_keys` 表，避免同一产品被两个频道各推一次。

14 天自动清理，`RETENTION_DAYS=14`，不用管膨胀。

### 关键词硬过滤

在 LLM 之前先跑一层正则：抽奖、开卡、虚拟卡、机场、节点、域名交易——直接丢。省 token，也减少误判。

### LLM 预过滤（Stage A）

只看频道标题 + 短文本（~800 字符），不爬论坛。prompt 让模型判断：

- **KEEP**：免费 API / 模型额度 / IDE 送积分 / 官方 free tier 上线
- **DROP**：抽奖、中转、反代、合租、广告、求助、 rant

输出 JSON：`useful` / `score` / `kind` / `reason` / `summary`。

这一层砍掉 80% 的消息，后面论坛爬取只对 KEEP 项做。

### 论坛正文抓取

Stage A 说 KEEP 的，才去爬论坛首楼。按站点分族：

| 族 | 站点 | 抓法 |
|----|------|------|
| discourse | linux.do, nodeloc | `/t/{id}.json` 首帖 `cooked` |
| nodeseek | nodeseek.com | 首个 `article.post-content` + `/jump?to=` 解包 |
| v2ex | v2ex.com | `topic_content` |
| generic | 其它 | article/main only |

硬规则：**只认首楼正文链接**，不扫整页——否则侧栏广告、站点规则页混进来就乱了。

### LLM 二次过滤（Stage B）

拿到论坛正文后，再跑一次 LLM。这次能看清全文，专门杀：

- 软广（折扣、专属价、充值套餐）
- 促销算力（Seedance 9折之类）
- 「怎么发羊毛」教程帖

同一个产品两个频道各发一次，dedupe_key 去重。

### 多角度改写推送

确定要推了，不直接发原文。跑 3 个角度分析师 + 1 个整合器：

| 角度 | 提取什么 |
|------|----------|
| hook | 白嫖价值 / 额度 / 模型 / 可否重复注册 |
| howto | 怎么领 / 门槛 / 有效期 |
| caveat | 坑 / 绑卡 / 限地区 / 不稳定 |

三个角度各出一组 bullet，整合成一条口语化短文。正文尽量 ≤80 字，点关键信息：额度、模型、无限注册、有效期。

有效期不写 `【有效期: xxx】` 这种机械标注，自然融进正文——「30天」「白嫖一个月」「前1万名」「长期有效」。

### 图片处理

推送时最多带一张图，优先级：

1. **频道真图**（RSS blockquote 里的论坛 OG 预览不算）
2. **论坛首楼正文图**（下载后检查尺寸，丢弃 logo/头像/小图标）
3. **产品页首屏截图**（无图但有 product_url 时，Playwright headless 截图 1280×900 @2x）
4. 都没有 → 纯文本

截图有个坑：最初用 `wait_until=networkidle`，结果阿里云那种 SPA 页背景请求不停，30s 超时白推纯文本。后来改成 `load → domcontentloaded → commit` 降级 + 4s settle，10s 内出图。

## 部署

```bash
# cron，每 15 分钟
*/15 * * * * /bin/bash /root/tg-ai-monitor/run_cron.sh
```

`run_cron.sh` 带 `flock` 防并发，日志写 `data/cron.log`。

LLM 走自己的 CPA 网关，模型用 `agnes-2.0-flash`（免费），4 次 LLM 调用/条 × 通常 ≤5 条/轮，成本可忽略。

## 效果

跑了一阵，推送到自己的频道。典型推送长这样：

```
注册送$40 AI + $360 VPS，支持Claude 4.6和GPT 5.2。单邮箱可无限注册。

http://signup.snowflake.com/cortex-code

#ai #白嫖
```

或者：

```
阿里云西湖论剑比赛，学生可领专属代金券，用于购买服务器和算力。

https://university.aliyun.com/action/dasctf

#ai #白嫖
```

短、直接、有链接有图。不写说明书腔，不标 ⏱ 有效期。

## 一些踩过的坑

| 坑 | 原因 | 解法 |
|----|------|------|
| 推了论坛 OG logo 当正文图 | RSS 把论坛链接预览图放 blockquote 里 | `strip_blockquote=True`；下载后尺寸校验丢弃小图 |
| 强行挂了无关产品链 | NodeLoc 整页扫链扫到站点 `community_rules` | 改成只扫首楼正文，不扫整页 |
| 截图超时纯文本推送 | `networkidle` 对 SPA 永远不 settle | 降级为 `load` + `domcontentloaded` |
| LLM 把有效期标成 `【有效期: xxx】` | publish prompt 没限制格式 | 要求口语化融入正文，禁机械标注 |
| 同一产品两个频道各推一次 | 无跨频道去重 | `dedupe_keys` 表，key 基于 product host |

## 小结

这东西本质是一个 **LLM 驱动的 pipeline**：拉消息 → 过滤 → 抓详情 → 再过滤 → 改写 → 推送。每一步都有明确的丢弃条件，AI 负责判断，不负责编造。

代码没开源——环境太特殊，泛用性不够。思路倒是通用的：RSSHub + SQLite + 任意 LLM API + Bot Token，谁都能搭。

如果你也在刷 AI 羊毛频道，不妨试试让 Agent 替你刷。省下来的时间，可以用来薅更多的羊毛。
