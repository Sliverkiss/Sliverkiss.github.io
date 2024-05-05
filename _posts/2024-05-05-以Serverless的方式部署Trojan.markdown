---
layout:     post
title:     以 Serverless 的方式部署 Trojan
subtitle:   " \"\""
date:       2024-05-05 15:30:00
author:     "Sliverkiss"
header-img: "img/bg/image_3.jpg"
catalog: true
tags:
    - cloudflare
---

## 准备材料
1. ```cloudflare```账户
2. ```一个域名```


## 部署
1. 登录Cloudflare，在左边的侧边栏选择Workers和Pages，点击进入worker概述页面。

![IMG_4432.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4432_1b58dd799f746.jpeg)

2. 点击创建应用程序按钮，选择创建新的page项目

![IMG_4433.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4433_1411ec3f63a02.jpeg)
 
3. 输入项目名称，上传[_worker.js](https://gist.githubusercontent.com/Sliverkiss/e756e7712b7b6da843f9e28a1a2933fc/raw/_worker.js)文件,完成创建page项目。

![IMG_4434.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4434_c8b43296df7a5.jpeg)

4.进入创建好的page管理页面，选择自定义域，点击右上角的设置自定义域按钮，输入准备好的域名，并点击继续

![IMG_4435.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4435_c2a32bab3ab5c.jpeg)

5.确认DNS记录，选择激活域

![IMG_4436.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4436_57f0f7b9d32e9.jpeg)

6.点击检查DNS记录，等待几分钟，直到验证完成

![IMG_4437.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4437_23510f2882af1.jpeg)

7. 验证完成效果图如下

![IMG_4438.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4438_f8b174b47914c.jpeg)

8.访问https://刚刚绑定的域名/sub,获取节点订阅

![IMG_4439.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4439_139813bd53d4e.jpeg)


<!-- *———      __ 后记于 __* -->
