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
2. 一个```域名```，没有也没关系，下面会教你如何白嫖域名。

## 获取域名
> 如果已经拥有域名，或配置订阅后能够正常使用，可以跳过这一步骤。

1.访问[cloudns](https://www.cloudns.net)，注册或登录账号。

2.在DNS Host页面选择```create zone```,点击```Free zone```

![IMG_4444.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4444_947046ed5abec.jpeg)

3.输入自己喜欢的域名，点击```Create```

![IMG_4445.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4445_94aa5dbe309f3.jpeg)

4.创建完成后，先把这个域名放到一边，进行下面的部署操作。

## 部署
1.登录Cloudflare，在左边的侧边栏选择Workers和Pages，点击进入worker概述页面。

![IMG_4432.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4432_aa4b1e6f8d9c7.jpeg)

2.点击创建应用程序按钮，选择创建新的page项目

![IMG_4433.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4433_1411ec3f63a02.jpeg)
 
3.输入项目名称，上传[_worker.js](https://gist.githubusercontent.com/Sliverkiss/e756e7712b7b6da843f9e28a1a2933fc/raw/_worker.js)文件,完成创建page项目。

![IMG_4434.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4434_c8b43296df7a5.jpeg)

4.进入创建好的page管理页面，选择自定义域，点击右上角的设置自定义域按钮，输入准备好的域名，并点击继续

![IMG_4435.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4435_c2a32bab3ab5c.jpeg)

5.确认DNS记录，选择激活域

![IMG_4436.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4436_57f0f7b9d32e9.jpeg)

6.点击检查DNS记录，等待几分钟，直到验证完成

7.验证完成效果图如下

![IMG_4438.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4438_f8b174b47914c.jpeg)

8.访问https://刚刚绑定的域名/sub,获取节点订阅

![IMG_4439.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4439_139813bd53d4e.jpeg)

### CloudNs域名绑定Page
> 如果没有进行之前的注册CloudNs域名操作，可以跳过这一步骤。

1.在之前的添加自定义域页面，输入之前注册的```CloudNs```域名，需要添加前缀。如：你注册的域名为```aaa.cloudns.ch```，则在自定义域输入```xxx.aaa.cloudns.ch```,其中```xxx```可以随意输入。

![IMG_4435.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4435_c2a32bab3ab5c.jpeg)

2.重复之前的激活域操作。

![IMG_4436.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4436_57f0f7b9d32e9.jpeg)

3.点击检查DNS记录，单击复制```目标内容```

4.打开[cloudns](https://www.cloudns.net)，进入之前注册域名的管理界面，点击```Add new record```按钮

![IMG_4446.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4446_2dbe4b8b0adb2.jpeg)

5.将```Type```选择为```CName```，并在host输入之前自定义域的前缀。如```xxx.aaa.cloudns.ch```,前缀则为```xxx```，```Point to```输入之前第三步复制的```目标```内容，最后点击```Save```。

6.返回Page管理页面，再次点击检查DNS记录，等待完成验证。

7.验证完成效果图如下

![IMG_4438.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4438_f8b174b47914c.jpeg)


### 裂变ip

1.打开```Sub-Store```,点击右下角的+号。如果不知道```Sub-Store```是什么，可以考虑跳过后面的步骤。

![IMG_2256.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_2256_8a6f6b652c65d.jpeg)

2.选择导入配置，需要导入的配置文件为[cf-trojan.json](https://gist.githubusercontent.com/Sliverkiss/298d1410dfbeb3b6882e23d9e616a525/raw/cf-trojan.json)

![IMG_4447.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4447_87e2b613ff9cb.jpeg)

3.选择需要使用的节点区域。裂变的节点很多，不建议选择太多区域，一个就好。

![IMG_4448.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4448_de032879395df.jpeg)

4.将脚本操作中的```_______.com```全部更改为自己刚刚绑定的自定义域名。如```xxx.aaa.cloudns.ch```。将```proxyip.sg.fxxk.dedyn.io```中的```sg```字段修改为所选区域，如```hk```、```JP```等。

![IMG_4449.jpeg](https://pic2.ziyuan.wang/user/tistzach/2024/05/IMG_4449_eea96d365d058.jpeg)

5.最后点击底部的保存，复制订阅链接，导入代理软件即可享用。

### 相关问题解答

如果获取了订阅之后，出现ping不通的情况，可以分别尝试以下操作：

1. 更换代理软件的测速链接，如```http://1.0.0.1/favicon.ico```、```http://www.gstatic.com/generate_204```、```http://www.apple.com/generate_204```
2. 更换域名
3. 关闭WIFI，切换为流量，即更换运营商。
4. 不用

<!-- *———      __ 后记于 __* -->
