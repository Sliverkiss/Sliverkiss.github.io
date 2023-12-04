---
layout:     post
title:      UNRAID无公网ip搭建Cloudflare Zero trust隧道穿透反向代理
subtitle:   " \"记录一次将没有公网ip的本地服务器通过cloudlfare内网穿透到公网的过程\""
date:       2023-12-04 10:29:00
author:     "Sliverkiss"
header-img: "img/bg/image_2.jpg"
catalog: true
tags:
    - Code
---

> “If you care about me at all, please don't say anything to anyone. ”

### 碎碎念

前阵子申请的几个`free.hr`域名还没用完，趁着这几天有空，便想着让自己的unraid内网穿透，实现随时随地都能访问。

### 准备条件

1. 一个任意域名，并使用Cloudflare进行DNS解析
2. 一台家庭网络无公网IPv4，且有远程穿透链接家庭服务需求的本地服务器
3. 一个Zero Trust账户,具体如何申请，详见[申请CloudFlare Teams(Zero Trust)账户教程](https://blog.misaka.rest/2023/02/08/cf-teams/?highlight=warp)

### Cloudflare Zero Trust配置

1. 首先登录`cloudflare`,进入Cloudflare Zero Trust页面,点击`Access`->`Tunnels`创建一个新的隧道。
2. 输入任意隧道名称，点击`Save tunel`保存。
3. 进入隧道配置页面，复制Docker配置

```shell
tunnel --no-autoupdate run --token 你的token
```

### UNRAID端配置cloudflared

1. 登录进入UNRAID，在应用市场搜索`cloudflared`，选择`aeleo`的库，点击安装。

![IMG_3953.png](https://pic.ziyuan.wang/2023/12/04/guest_46a3393691196.png)

2. 修改容器配置，开启高级视图，将存储库修改为`cloudflare/cloudflared:latest`，获取最新版本，并添加发布参数

```shell
tunnel --no-autoupdate run --token 你的token
```

![IMG_3954.png](https://pic.ziyuan.wang/2023/12/04/guest_e96ab60ff4ea1.png)

3. 完成配置后，返回Cloudflare Zero Trust页面，等待1～2分钟，此时的隧道状态变为`HEALTHY`，说明隧道配置已完成。

![IMG_3955.png](https://pic.ziyuan.wang/2023/12/04/guest_ee952a0cb77b0.png)

### 完成隧道配置，设置反向代理
1. 进入隧道配置页面，创建新的`public hostname`，设置反向代理。

![IMG_3956.png](https://pic.ziyuan.wang/2023/12/04/guest_e4745511429e8.png)

### 总结
unraid配置隧道+反向代理操作比较简单，10分钟就能完成所有操作。在设置反向代理时，unraid的面板是通过https进行访问的，需要在unraid自行配置stl证书等相关设置，才能正常访问，我目前还能找到办法解决，只能暂留以后再进行研究了😊


<!-- *———      __ 后记于 __* -->