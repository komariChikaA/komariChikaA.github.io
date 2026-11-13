# GuraNirei // Bangumi Archive (UID 993671)

纯 HTML + 向下兼容 ES3/ES5 JavaScript 构建的 Bangumi 动画与游戏个人收藏展示站（**零 CSS**）。

## 设计特性

- **零 CSS 架构**：不使用 `<style>`、外链 `.css` 或任何 `style="..."` 属性，仅通过纯 HTML 表格结构、`bgcolor` 细线网格、`spacer.gif` 像素级进度条与 `<font>` 排版实现暗色主题与现代目录设计。
- **向下兼容 JS**：完全采用 ES3/ES5 语法（`var`、`function`、`XMLHttpRequest` / `ActiveXObject`），无箭头函数、无模板字符串、无 `fetch` / `Promise` 依赖。
- **双模式实时同步**：
  - 预置 `data.js` 全量快照，首屏零延迟渲染并支持离线/旧版浏览器。
  - 页面加载后自动通过 `XMLHttpRequest` 静默比对 `api.bgm.tv/v0/users/993671` 最新动态，并支持手动一键同步；同时配置 GitHub Actions 每日定时更新快照。
- **完整浏览体验**：
  - 动画 (`#F09199` Bangumi 樱粉) / 游戏 (`#60A5FA` 街机蓝) / 全部收录 / 数据图谱四大视图
  - 收藏状态筛选与比例条、评分分级筛选、多维度排序、关键词检索、热门标签直达
  - 画廊卡片与档案表格双视图，支持响应式列数自适应
  - 作品详情档案面板（`#subject=<id>`）与评分直方图、年代分布、高频标签排行、9–10 分神作殿堂
