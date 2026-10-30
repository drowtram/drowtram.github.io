# Alee Notebook

使用 Jekyll 与 GitHub Pages 构建的个人博客，采用 AstroPaper 风格排版。

## 本地预览

安装 Jekyll 与 jekyll-paginate 后，在项目目录运行：

```sh
jekyll serve
```

打开 http://127.0.0.1:4000/ 。发布前可运行 `jekyll build` 检查生成结果。

## 内容与样式

- 文章放在 `_posts/`，使用 `post` 布局；`catalog: true` 开启目录。
- `_layouts/` 和 `_includes/` 管理页面布局与公共导航。
- `css/paper.css` 管理排版，`css/paper-syntax.css` 管理代码配色，无需额外的 CSS 构建步骤。
- `js/paper.js` 处理目录、标题链接和响应式内容；`js/search.js` 搜索由 `search.json` 生成的文章索引。
- 字体在 `fonts/` 中本地加载：英文为 Google Sans Code，中文为霞鹜文楷屏幕版。许可文件与字体一同保留。
- `img/` 保留站点图标与文章实际使用的图片，`pwa/` 与 `sw.js` 提供安装和离线支持。
- `_config.yml` 管理域名、分页、评论与统计；保留现有文章路径即可延续历史链接与评论关联。

## 致谢与许可

原站基于 [Hux Blog](https://github.com/Huxpro/huxpro.github.io)；当前视觉参考 [AstroPaper](https://github.com/satnaing/astro-paper)。

项目许可见 `LICENSE`，字体许可见 `fonts/*-OFL.txt`。
