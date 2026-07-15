# Sliverkiss Blog

基于 [Mizuki](https://github.com/LyraVoid/Mizuki)（Astro）的个人博客。

- 站点：https://blog.xn--ug8h.eu.org
- 备用：https://sliverkiss.github.io
- 旧版快照 tag：`legacy-jekyll`

## 本地开发

```bash
pnpm install
pnpm dev
```

## 部署

推送到 `main` 后，GitHub Actions 构建并发布到 `pages` 分支。

仓库 Settings → Pages：Source = **Deploy from a branch**，Branch = **`pages` / root**。
