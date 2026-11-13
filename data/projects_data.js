/* Creator Portfolio & Projects Catalog for GuraNirei / komariChikaA */
window.CREATOR_DATA = {
  profile: {
    handle: 'komariChikaA',
    displayName: 'GuraNirei / Guraぐら',
    tagline: 'ACG 爱好者 · 独立网页与小工具开发者 · MAD / Storybrew 分镜制作者',
    intro: '喜欢做把技术与二次元兴趣结合起来的东西：在线 Galgame 猜谜对战、实景摄影恐怖视觉小说、MAD 与 osu! Storyboard 全片渲染管线、朋友开黑用的你画我猜和同步放映室，以及零 CSS 纯 HTML 的个人空间与 Bangumi 收藏志。',
    github: 'https://github.com/komariChikaA',
    bangumi: 'https://bangumi.tv/user/993671',
    notesBlog: 'https://komarichikaa.github.io/my-notes/',
    siteUrl: 'https://komarichikaa.github.io/',
    heroImage: 'assets/img/shot-galyiba.jpg',
    heroCaption: '《旮一把 Gal Yi Ba》实机界面截图'
  },
  pillars: [
    {
      title: 'ACG 与视觉小说开发',
      color: '#F09199',
      tag: 'GALGAME · VNUI',
      image: 'assets/img/shot-sakura.jpg',
      desc: '围绕 Galgame 与视觉小说制作交互作品：从联机猜谜网站《旮一把》到实景摄影短篇恐怖视觉小说《下午的节目》。',
      targetPage: 'projects.html#cat=acg',
      actionLabel: '查看 ACG 项目'
    },
    {
      title: 'MAD / 分镜与音画工程',
      color: '#34D399',
      tag: 'STORYBREW · GODOT',
      image: 'assets/img/shot-mad-night.jpg',
      desc: '用 Godot、Storybrew (C#) 与 Python 构建《夜もすがら君恋ふ》等 MAD 分镜及视频渲染管线，并在博客记录制作心得。',
      targetPage: 'projects.html#cat=mad',
      actionLabel: '查看音画工程'
    },
    {
      title: '多人联机与实用插件',
      color: '#60A5FA',
      tag: 'MULTIPLAYER · TOOLS',
      image: 'assets/img/shot-draw2guess.jpg',
      desc: '为朋友聚会与日常使用造轮子：接龙你画我猜、私人同步放映室、Karuta 听歌猜作品机与 HITA 课表壁纸插件。',
      targetPage: 'projects.html#cat=tools',
      actionLabel: '查看联机与工具'
    }
  ],
  projects: [
    {
      id: 'gal-yiba',
      name: '旮一把 / Gal Yi Ba',
      category: 'acg',
      categoryLabel: 'ACG · 游戏',
      lang: 'TypeScript',
      stars: 5,
      updated: '2026-09-07',
      featured: true,
      image: 'assets/img/shot-galyiba.jpg',
      summary: '以 VNDB 与 Bangumi 为数据源、支持自定义比较项与在线房间对战的 Galgame 猜谜网站。',
      highlights: [
        '接入 VNDB 与 Bangumi 双数据源，自动比对发售年份、开发商、标签、平台等维度的线索提示',
        '支持创建联机房间进行多人对战猜谜，适合同好开黑检验 Galgame 阅历',
        '支持自定义题库与比较规则，面向社区玩法持续迭代'
      ],
      tags: ['TypeScript', 'VNDB', 'Bangumi', '在线对战'],
      repoUrl: 'https://github.com/komariChikaA/gal-yiba',
      liveUrl: ''
    },
    {
      id: 'afternoon-program',
      name: '下午的节目 / afternoon_program',
      category: 'acg',
      categoryLabel: 'ACG · 视觉小说',
      lang: 'JavaScript',
      stars: 1,
      updated: '2026-10-17',
      featured: true,
      image: 'assets/img/shot-afternoon.jpg',
      summary: '基于自研 VNUI 模板制作的实景摄影日式恐怖短篇视觉小说，开箱即玩并适配手机、平板与桌面端。',
      highlights: [
        '采用实景摄影素材结合手绘电视与异常细节演出，构建循环式日常恐怖叙事',
        '完整十幕流程：第一次入住 → 异常下午 → 记忆切断 → 再次入住 → 衣物结局',
        '纯网页零依赖运行，支持 GitHub Pages 在线直接游玩'
      ],
      tags: ['JavaScript', 'VNUI', '视觉小说', '实景恐怖'],
      repoUrl: 'https://github.com/komariChikaA/afternoon-program',
      liveUrl: 'https://komariChikaA.github.io/afternoon-program/'
    },
    {
      id: 'komari-portal',
      name: 'GuraNirei 个人空间与 Bangumi 志',
      category: 'acg',
      categoryLabel: 'ACG · 个人主站',
      lang: 'HTML / ES5 JS',
      stars: 0,
      updated: '2026-11-14',
      featured: true,
      image: 'assets/img/shot-aokana.jpg',
      summary: '完全禁用 CSS、仅使用纯 HTML 与向下兼容 ES3/ES5 JavaScript 构建的多页面个人展示与 Bangumi 收藏站。',
      highlights: [
        '零 CSS 实现暗色细线网格、像素级柱状图、实景截图画廊与等宽等高同步卡片排版',
        '内置 484 部动画与 194 部游戏本地快照，并通过 XMLHttpRequest 自动静默比对 Bangumi API 更新',
        '规范化多页结构（index / projects / bangumi / about）与 GitHub Actions 每日自动同步'
      ],
      tags: ['纯 HTML', 'ES5 JS', '零 CSS', '个人主站'],
      repoUrl: 'https://github.com/komariChikaA/komariChikaA.github.io',
      liveUrl: 'https://komarichikaa.github.io/'
    },
    {
      id: 'yoru-mo-koi',
      name: '「夜もすがら君恋ふ」MAD 工程',
      category: 'mad',
      categoryLabel: 'MAD · 分镜渲染',
      lang: 'Python / Godot / C#',
      stars: 0,
      updated: '2026-10-25',
      featured: true,
      image: 'assets/img/shot-mad-night.jpg',
      summary: 'MAD《夜もすがら君恋ふ》的 Godot 场景工程、Storybrew 分镜脚本与全片视频渲染器。',
      highlights: [
        '包含神户街景、CG 木偶试验、副歌镜头与手机分镜等 6 个独立 Godot 工程',
        '自研 renderer/ 管线，可从同一批 Storybrew 精灵直接渲染全片视频与原生 OSB',
        '配套详细工程复盘文章发布于个人笔记站 my-notes'
      ],
      tags: ['Storybrew', 'Godot', 'Python', 'MAD渲染'],
      repoUrl: 'https://github.com/komariChikaA/yoru-mo-koi',
      liveUrl: 'https://komarichikaa.github.io/my-notes/posts/yomosugara-storybrew'
    },
    {
      id: 'karuta',
      name: 'Karuta Jukebox 听歌猜作品',
      category: 'mad',
      categoryLabel: '音画 · 桌面应用',
      lang: 'Java / JavaFX',
      stars: 5,
      updated: '2026-04-27',
      featured: true,
      image: 'assets/img/shot-from-blue.jpg',
      summary: '基于 JavaFX 的“听歌猜作品”对局桌面应用，集成歌单数据集管理、选卡控制与音频播放。',
      highlights: [
        '支持 GUI 可视化管理 CSV 歌单数据集，单作品可关联多首曲目',
        '导入 flac 等无损音频时自动调用转码与裁剪管线，支持回合控制与休息音乐',
        '面向线下/社群听歌猜番、猜 Galgame 活动设计'
      ],
      tags: ['Java', 'JavaFX', '音频', '歌牌对局'],
      repoUrl: 'https://github.com/komariChikaA/karuta',
      liveUrl: ''
    },
    {
      id: 'draw2guess',
      name: 'Draw2Guess 多人接龙画猜',
      category: 'tools',
      categoryLabel: '联机 · 多人游戏',
      lang: 'Python / JS',
      stars: 1,
      updated: '2026-11-02',
      featured: true,
      image: 'assets/img/shot-draw2guess.jpg',
      summary: '模仿 Steam《Draw & Guess》的开源多人你画我猜接龙网页游戏，零第三方后端依赖。',
      highlights: [
        '后端纯用 Python 标准库编写，前端原生 HTML/JS，支持 4–16 人固定队列接龙画猜',
        '内置 HttpOnly Cookie 会话保持、跨设备重连回席、断线全员暂停与房主自动迁移',
        '支持赛后逐棒复盘，完整回看每条题目如何一路走偏'
      ],
      tags: ['Python标准库', '多人联机', '你画我猜', 'Web应用'],
      repoUrl: 'https://github.com/komariChikaA/draw2guess',
      liveUrl: ''
    },
    {
      id: 'my-notes',
      name: 'My Notes · MAD 与分镜笔记站',
      category: 'mad',
      categoryLabel: 'MAD · 博客',
      lang: 'JavaScript / Valaxy',
      stars: 0,
      updated: '2026-10-26',
      featured: false,
      image: 'assets/img/shot-mad-sketch.jpg',
      summary: '围绕 MAD 分镜、Storybrew 制作与工程复盘打造的极简 Valaxy 静态博客，内置本地写作台。',
      highlights: [
        '使用 Markdown 维护技术笔记与分镜复盘，由 Valaxy 静态生成并部署至 GitHub Pages',
        '自建本地写作台脚本（127.0.0.1:4317），支持分屏预览与一键发布构建'
      ],
      tags: ['Valaxy', 'Markdown', 'MAD笔记', 'GitHub Pages'],
      repoUrl: 'https://github.com/komariChikaA/my-notes',
      liveUrl: 'https://komarichikaa.github.io/my-notes/'
    },
    {
      id: 'tsukinami-storyboard',
      name: 'Tsukinami Storyboard',
      category: 'mad',
      categoryLabel: 'MAD · Storyboard',
      lang: 'C#',
      stars: 0,
      updated: '2026-10-14',
      featured: false,
      image: 'assets/img/shot-mad-night.jpg',
      summary: '基于 C# 与 Storybrew 编写的 osu! Storyboard 分镜与特效工程。',
      highlights: [
        '探索面向音游谱面的程序化图形、镜头运动与歌词/粒子编排',
        '与《夜もすがら君恋ふ》等工程共同沉淀复用脚本库'
      ],
      tags: ['C#', 'Storybrew', 'osu!'],
      repoUrl: 'https://github.com/komariChikaA/tsukinami-storyboard',
      liveUrl: ''
    },
    {
      id: 'watch-room',
      name: 'Watch Room 私人同步放映室',
      category: 'tools',
      categoryLabel: '联机 · 屏幕共享',
      lang: 'JavaScript',
      stars: 0,
      updated: '2026-11-03',
      featured: false,
      image: 'assets/img/shot-mystery.jpg',
      summary: '面向小型社群、朋友一起看番或演示的自托管同步放映室与低延迟屏幕直播项目。',
      highlights: [
        '支持共享桌面、指定应用窗口及系统音频/麦克风，观众浏览器直接进房观看',
        '面向中国大陆网络环境优化，摆脱商业会议软件时长与画质限制'
      ],
      tags: ['JavaScript', 'WebRTC/流媒体', '一起看番'],
      repoUrl: 'https://github.com/komariChikaA/watch-room',
      liveUrl: ''
    },
    {
      id: 'hita-timetable-wallpaper',
      name: 'OH-MY-HITA 课表壁纸插件',
      category: 'tools',
      categoryLabel: '插件 · Android',
      lang: 'Kotlin',
      stars: 0,
      updated: '2026-11-05',
      featured: false,
      image: 'assets/img/shot-sakura.jpg',
      summary: '为 OH-MY-HITA 校园课表应用开发的原生课表壁纸与外观样式设置插件。',
      highlights: [
        '采用 Kotlin 编写，面向 OH-MY-HITA 插件化架构扩展个性化背景与课表视觉样式',
        '同步参与了 OH-MY-HITA 与社区番剧插件仓库的适配探索'
      ],
      tags: ['Kotlin', 'Android', '插件开发'],
      repoUrl: 'https://github.com/komariChikaA/hita-timetable-wallpaper',
      liveUrl: ''
    },
    {
      id: 'cpu-design-hitsz',
      name: 'HITSZ CPU 设计工程',
      category: 'systems',
      categoryLabel: '硬件 · 课程',
      lang: 'VHDL',
      stars: 0,
      updated: '2026-07-31',
      featured: false,
      image: '',
      summary: '使用 VHDL 完成的计算机组成原理处理器硬件描述与仿真设计工程。',
      highlights: [
        '从底层数字逻辑、数据通路与控制单元出发实现指令执行流程',
        '记录校园硬件实验与体系结构实践'
      ],
      tags: ['VHDL', '数字逻辑', '体系结构'],
      repoUrl: 'https://github.com/komariChikaA/cpu-design-hitsz',
      liveUrl: ''
    },
    {
      id: 'planewar',
      name: 'PlaneWar 桌面飞行射击',
      category: 'systems',
      categoryLabel: '课程 · 桌面游戏',
      lang: 'Java',
      stars: 0,
      updated: '2026-05-07',
      featured: false,
      image: '',
      summary: '基于 Java 面向对象课程完成的经典飞机大战桌面小游戏作业工程。',
      highlights: [
        '实现玩家操控、敌机波次生成、碰撞检测、道具与积分系统',
        '早期的游戏循环与面向对象架构练习'
      ],
      tags: ['Java', '面向对象', '2D游戏'],
      repoUrl: 'https://github.com/komariChikaA/planewar',
      liveUrl: ''
    }
  ],
  skills: [
    { name: 'JavaScript / TypeScript / 原生 Web', level: 92, color: '#F09199', note: 'VNUI、联机前端、零 CSS 向下兼容架构' },
    { name: 'Python (标准库服务端 / 自动化 / 渲染脚本)', level: 88, color: '#60A5FA', note: 'Draw2Guess 零依赖后端、数据抓取与媒体管线' },
    { name: 'C# / Godot / Storybrew (MAD 与分镜制作)', level: 84, color: '#34D399', note: '程序化分镜、场景构建与全片渲染器' },
    { name: 'Java / JavaFX / Kotlin (桌面与 Android 插件)', level: 78, color: '#A78BFA', note: 'Karuta 桌面应用、OH-MY-HITA 课表插件' },
    { name: 'VHDL / 计算机底层硬件设计', level: 70, color: '#FBBF24', note: 'CPU 数据通路与控制单元仿真实现' }
  ],
  timeline: [
    { date: '2026-11', title: '个人主站重构升级 & 联机工具密集迭代', detail: '完成零 CSS 多页面个人主站与 Bangumi 收藏志（komariChikaA.github.io）、Watch Room 同步放映室、Draw2Guess 接龙画猜及 HITA 壁纸插件。', color: '#F09199' },
    { date: '2026-10', title: '《夜もすがら君恋ふ》MAD 与《下午的节目》', detail: '发布基于实景摄影的恐怖短篇视觉小说《下午的节目》在线版；完成 Godot/Storybrew MAD 工程、全片渲染器及个人笔记博客 my-notes。', color: '#34D399' },
    { date: '2026-09', title: '上线《旮一把》Galgame 联机猜谜', detail: '结合 VNDB 与 Bangumi 数据源打造可自定义比较项的多人在线 Galgame 猜谜网站（gal-yiba）。', color: '#60A5FA' },
    { date: '2026-07', title: '完成 VHDL CPU 硬件设计', detail: '使用 VHDL 实现处理器硬件结构与指令仿真（cpu-design-hitsz）。', color: '#FBBF24' },
    { date: '2026-04', title: 'Karuta 听歌猜作品桌面应用', detail: '使用 JavaFX 构建支持无损音频处理与 CSV 歌单管理的听歌猜作品对局器（karuta）。', color: '#A78BFA' }
  ]
};
