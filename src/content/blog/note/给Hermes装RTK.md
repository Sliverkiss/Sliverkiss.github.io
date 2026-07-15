---
title: 给 Hermes 装 RTK：终端输出瘦身，token 少烧一点
date: '2026-07-15 23:59:00'
tags:
- Hermes
- RTK
- AI Agent
- 运维
- token
categories:
- 笔记
cover: /img/cover/22.webp
description: 预编译要 GLIBC 2.39、本机只有 2.36 时源码编译；rtk init 对接插件；gateway 必须在会话外重启。
draft: false
---
> 能用 > 看起来能用。Agent 天天 `git status`、`docker ps`，上下文却被原始输出塞满——这种账，值得算一算。

## 起因

Hermes 跑久了会发现一件事：工具调用里 **`terminal` 占比极高**，而命令回吐会整段进上下文。

七天量级里 input token 可以上亿；其中一大块不是 system prompt，而是 **shell 噪音**——git 状态、docker 列表、测试日志……模型其实只要结论，却被迫读全文。

搜到 [rtk-ai/rtk](https://github.com/rtk-ai/rtk)（Rust Token Killer）：单二进制，把常见开发命令输出滤一滤、截一截，官方号称能省 **60%～90%** 命令侧 token。更关键的是——**官方支持 Hermes**：

```bash
rtk init --agent hermes
```

会装一个 `pre_tool_call` 插件：在 `terminal` 真正执行前，把 `git status` 改写成 `rtk git status`。Agent 不用改习惯，fail-open（rtk 挂了就原样跑）。

这比「再叠一套记忆 / 自进化 skill」实在得多。于是就装了。

## 环境

| 项 | 值 |
|----|-----|
| 机器 | Linux **aarch64** |
| glibc | **2.36**（Debian bookworm 一代） |
| Hermes | v0.18.x，gateway 用 systemd user 常驻 |
| 目标 | rtk **0.43.0** + 官方 Hermes 插件 |

## 踩坑 1：官方 aarch64 预编译跑不起来

按 README 下 release 里的：

`rtk-aarch64-unknown-linux-gnu.tar.gz`（v0.43.0）

一跑：

```text
/lib/aarch64-linux-gnu/libc.so.6: version `GLIBC_2.39' not found
```

`objdump` 看了一圈：预编译链到了 **GLIBC_2.39** 的 `pidfd_*` 一类符号。  
本机是 **2.36**。往回翻多个旧 tag（0.25～0.42）的 aarch64 gnu 包，**全是 2.39**——不是「换个旧版本」能解决的。

x86_64 倒有 musl 静态包；**aarch64 目前没有 musl 预编译**。install.sh 对 aarch64 也是指到同一套 gnu 包。

结论：**在 bookworm / 2.36 上，aarch64 只能源码编译。**

## 装二进制：本机 cargo release

```bash
# 装 rustup（若没有）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
. "$HOME/.cargo/env"

git clone --depth 1 --branch v0.43.0 https://github.com/rtk-ai/rtk.git /tmp/rtk-build
cd /tmp/rtk-build
cargo build --release   # 本机大约几分钟

install -m 755 target/release/rtk ~/.local/bin/rtk
install -m 755 target/release/rtk /usr/local/bin/rtk   # gateway PATH 更稳

rtk --version   # rtk 0.43.0
```

源码编出来的依赖大约到 **GLIBC_2.34**，本机 2.36 没问题。

注意：crates.io 上还有个同名「Rust Type Kit」。装完务必：

```bash
rtk gain    # 有 token 统计表头才是对的 rtk
```

## 对接 Hermes

```bash
# 建议先备份
cp -a ~/.hermes/config.yaml ~/.hermes/config.yaml.bak.rtk

rtk init --agent hermes
```

会做两件事：

1. 写入 `~/.hermes/plugins/rtk-rewrite/`  
   - `__init__.py`：钩 `pre_tool_call`，对 `terminal` 调 `rtk rewrite`  
   - `plugin.yaml`  
2. 在 `config.yaml` 加上：

```yaml
plugins:
  enabled:
    - rtk-rewrite
```

插件逻辑很薄：PATH 里找不到 `rtk` 就不注册钩子；rewrite 失败、非 `terminal`、已经是 `rtk …`、复合命令等——**原命令执行**。不会把整机搞瘫。

## 踩坑 2：插件要 gateway 重启；会话里不能重启

插件是进程启动时加载的。装完必须：

```bash
systemctl --user restart hermes-gateway
# 或
hermes gateway restart
```

**必须在 SSH / 本机 shell 跑。**  
在 Telegram 里让 Hermes 自己 `restart gateway`，会被拦——gateway 不能杀自己的父进程树。这是特性，不是 bug。

重启后核对：

```bash
systemctl --user is-active hermes-gateway
hermes plugins list | grep rtk
# 应看到：rtk-rewrite  enabled  user

# gateway 进程环境里也能找到 rtk
# PATH 里应有 /usr/local/bin 或 ~/.local/bin
```

## 验收（别只看「装上了」）

### 1）rewrite

```bash
rtk rewrite 'git status'
# → rtk git status
```

### 2）输出真的变短

同仓库对比（数字因仓库状态会变，看趋势即可）：

| 命令 | 原始 | rtk |
|------|------|-----|
| `git status` | ~618 B | ~134 B |
| `docker ps` | ~737 B | ~287 B |

### 3）插件钩子（不启 gateway 也能单测）

```python
# 加载 ~/.hermes/plugins/rtk-rewrite/__init__.py
# _pre_tool_call(tool_name='terminal', args={'command':'git status'})
# → args['command'] == 'rtk git status'
```

### 4）运行时

`hermes plugins list` 里 **enabled**，gateway **active**，且 gateway 的 `PATH` 能 `which rtk`。  
缺 PATH 时插件 fail-open，看起来像「装了但没生效」。

## 它不会帮你什么

写清楚边界，免得期待错位：

| 会 | 不会 |
|----|------|
| 压缩 **terminal 命令输出** | 压缩 system prompt / skills 索引 |
| 自动改写常见 git/docker/pytest… | 改写 `read_file` / `search_files` 等内置工具 |
| fail-open，坏了还能用 | 替代 `compression.threshold`、裁 MCP 等整体 token 治理 |

和「压缩阈值调到 0.5」「关掉 0 调用的大 MCP」是**互补**关系，不是二选一。

## 卸载

```bash
rtk init --uninstall --agent hermes
# 需要的话再删二进制
# rm -f ~/.local/bin/rtk /usr/local/bin/rtk
```

## 小结

1. **RTK 值得接 Hermes**：官方插件、路径清晰、对 terminal 重用户收益直观。  
2. **aarch64 + 旧 glibc 别死磕预编译**，直接 `cargo build --release`。  
3. **双路径安装**（`~/.local/bin` + `/usr/local/bin`）省得 gateway PATH 踩坑。  
4. **gateway 在会话外重启**，再用 `plugins list` + 一次真实 `git status` 验收。  

折腾半下午，换来的是以后每一次 `docker ps` 少塞一截废话进上下文——对长期挂着的 agent 来说，这比再装一百个 skill 实在。

---

*事实基于本机 2026-07-15 实装记录；版本与路径以你环境为准。欢迎 star [rtk](https://github.com/rtk-ai/rtk) 和 [Hermes](https://github.com/NousResearch/hermes-agent)，不欢迎催更本站。*
