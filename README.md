# GuraNirei (@komariChikaA) // 个人主站、作品集与 Bangumi 收藏志

纯 HTML + 向下兼容 ES3/ES5 JavaScript 构建的多页面个人展示站（**零 CSS**），托管于 **https://komarichikaa.github.io/**。

## 目录结构

```text
komariChikaA.github.io/
├── index.html                  # 01 首页概览（个人简介、实机预览、三大方向、高分海报墙、近期更新）
├── projects.html               # 02 项目作品集（12 个开源项目分类检索、关键词过滤与档案面板）
├── bangumi.html                # 03 Bangumi 动画与游戏志（多维筛选、双视图、随机漫步、统计直方图）
├── about.html                  # 04 关于与历程（实机图文墙、技术栈比例条、2026 时间线、在线阵地）
├── assets/img/                 # 本地实机截图、创作工程图、像素小元件与 spacer.gif
├── js/
│   ├── common.js               # 共享母版、导航、页脚与零 CSS 表格组件库
│   ├── home.js                 # 首页控制器
│   ├── projects.js             # 作品集控制器
│   ├── bangumi.js              # Bangumi 收藏志控制器
│   └── about.js                # 关于页控制器
├── data/
│   ├── projects_data.js        # 创作者资料、项目清单、技能栈与里程碑
│   └── bangumi_data.js         # Bangumi 离线静态快照（484 动画 + 194 游戏）
├── scripts/
│   └── fetch_bangumi.py        # Python 标准库同步脚本
└── .github/workflows/
    └── sync-bangumi.yml        # 每日定时同步 data/bangumi_data.js
```

## 设计与兼容特性

- **零 CSS**：不使用 `<style>`、外链 `.css`、`style="..."` 或 `.style.` 操作；全部布局、暗色细线网格、卡片等宽等高对齐与柱状图均由纯 HTML 表格、`bgcolor` 与 `assets/img/spacer.gif` 完成，并消除文本超链接下划线。
- **实机视觉配合**：项目封面与预览优先采用本地实机截图、自研作品工程图及 Bangumi 官方封面，搭配 `16x16` 像素小元件。
- **向下兼容 JS**：全站仅使用 ES3/ES5 语法（`var`、`function`、`XMLHttpRequest` / `ActiveXObject`），无需任何打包构建工具。
- **自动同步**：GitHub Actions 每日自动更新 `data/bangumi_data.js`，浏览器端亦会自动静默检测 Bangumi API 最新动态。
