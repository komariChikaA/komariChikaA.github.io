# GuraNirei (@komariChikaA) // 个人空间、作品集与 Bangumi 收藏志

纯 HTML + 向下兼容 ES3/ES5 JavaScript 构建的多页面个人展示站（**零 CSS**）。

## 页面结构

- [index.html](index.html)（`home.js`）：**首页概览** — 个人简介、三大创作方向、6 个精选原创项目展示，以及 Bangumi 近期动画/游戏更新速览。
- [projects.html](projects.html)（`projects.js` + `projects_data.js`）：**项目作品集** — 展示 12 个公开原创项目（Galgame 猜谜《旮一把》、实景恐怖视觉小说《下午的节目》、MAD/Storybrew 渲染工程、Karuta 听歌猜作品、Draw2Guess 接龙画猜、Watch Room 放映室、HITA 插件等），支持分类筛选、搜索与详情档案面板。
- [bangumi.html](bangumi.html)（`app.js` + `data.js`）：**Bangumi 动画与游戏志** — 完整展示 UID `993671` 的 484 部动画与 194 部游戏，支持多维筛选、双视图、统计图谱与 `XMLHttpRequest` 实时同步。
- [about.html](about.html)（`about.js`）：**关于与历程** — 技术栈比例条、2026 开发时间线与在线阵地导航。

## 设计与兼容特性

- **零 CSS**：不使用 `<style>`、外链 `.css`、`style="..."` 或 `.style.` 操作；全部布局、细线网格、卡片等宽等高对齐与柱状图均由纯 HTML 表格、`bgcolor` 与 `spacer.gif` 完成，并消除文本超链接下划线。
- **向下兼容 JS**：全站仅使用 ES3/ES5 语法（`var`、`function`、`XMLHttpRequest` / `ActiveXObject`），无需任何打包构建工具。
- **自动同步**：GitHub Actions（`.github/workflows/sync-bangumi.yml`）每日自动更新 `data.js`，浏览器端亦会自动静默检测 Bangumi API 最新动态。
