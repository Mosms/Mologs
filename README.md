# Mologs

Bo Fu 的个人博客，基于 Jekyll 与 GitHub Pages。

## 本地预览

```sh
docker compose up --build
```

打开 <http://localhost:4000/Mologs/>。停止服务使用 `docker compose down`。

## 生产构建

```sh
docker compose run --rm site bundle exec jekyll build
```

输出位于 `_site/`。GitHub Pages 可直接从默认分支构建；站点配置的 `baseurl` 为 `/Mologs`。

字体授权说明见 `assets/fonts/README.md` 与 `assets/fonts/licenses/`。

## 文章侧栏摘句

文章可以在 front matter 中添加可选的 `highlight` 字段，作为希望强调的一句话显示在左侧栏：

```yaml
---
layout: post
title: "文章标题"
highlight: "这里写希望读者记住的一句话。"
---
```

省略该字段时，侧栏不会显示“摘句”区块。

## 中西文间距

`assets/javascripts/cjk-spacing.js` 会在页面渲染完成后，将中文与相邻英文或数字之间的空白统一为一个半角空格。处理覆盖普通文本及跨行内标签的边界，并自动跳过代码、预格式文本、数学公式和 SVG。
