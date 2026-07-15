---
layout: ../layouts/PageLayout.astro
title: "歌单"
description: "偶尔听听"
---

这里以后放自己喜欢的歌单。

当前还没有配置网易云 / QQ 音乐歌单。若要启用，在 `config/site.yaml` 的 `bgm.audio` 中填入你的歌单链接，或在本页使用：

```markdown
{% media audio %}
- title: 我的歌单
  list:
    - https://music.163.com/#/playlist?id=你的歌单ID
{% endmedia %}
```
