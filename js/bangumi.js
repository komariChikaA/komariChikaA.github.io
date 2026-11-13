/* Bangumi Archive (UID 993671) - Zero-CSS Backwards-Compatible ES3/ES5 Application */
(function () {
  var USER_ID = '993671';
  var CACHE_KEY = 'bgm_archive_993671_v1';

  var THEME = {
    bgPage: '#0B0E14',
    bgCard: '#131722',
    bgAlt: '#171C2A',
    bgElevated: '#1A2030',
    bgDeep: '#090C11',
    border: '#242B3D',
    borderStrong: '#333D57',
    textMain: '#EEF2F8',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    pink: '#F09199',
    blue: '#60A5FA',
    violet: '#A78BFA',
    emerald: '#34D399',
    amber: '#FBBF24',
    red: '#F87171',
    cyan: '#38BDF8',
    ink: '#0B0E14'
  };

  var STATUS_META = {
    2: { anime: '看过', game: '玩过', all: '已完成', color: '#34D399', bg: '#132A24', text: '#6EE7B7' },
    3: { anime: '在看', game: '在玩', all: '进行中', color: '#38BDF8', bg: '#112638', text: '#7DD3FC' },
    1: { anime: '想看', game: '想玩', all: '计划中', color: '#FBBF24', bg: '#2C2312', text: '#FCD34D' },
    4: { anime: '搁置', game: '搁置', all: '已搁置', color: '#94A3B8', bg: '#1E2534', text: '#CBD5E1' },
    5: { anime: '抛弃', game: '抛弃', all: '已抛弃', color: '#F87171', bg: '#2E171D', text: '#FCA5A5' }
  };

  var STATUS_ORDER = [2, 3, 1, 4, 5];

  var state = {
    mode: 'anime',
    status: 0,
    rateFilter: 'all',
    sort: 'updated',
    tag: '',
    query: '',
    view: 'grid',
    page: 1,
    pageSize: 24,
    selectedId: 0,
    syncStatus: 'snapshot', // 'snapshot' | 'checking' | 'syncing' | 'live' | 'error'
    syncMessage: ''
  };

  var dataStore = {
    user: {
      id: 993671,
      username: '993671',
      nickname: 'GuraNirei',
      sign: '',
      url: 'https://bgm.tv/user/993671',
      avatar: 'https://lain.bgm.tv/pic/user/l/000/99/36/993671.jpg?r=1744245631&hd=1'
    },
    synced_at: '',
    anime: [],
    game: []
  };

  // --- ES3/ES5 Compatibility Helpers ---

  function trimStr(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/^\s+|\s+$/g, '');
  }

  function escHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escJsStr(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\r/g, '')
      .replace(/\n/g, ' ');
  }

  function safeUrl(u) {
    if (!u) return '';
    var s = trimStr(u);
    if (s.indexOf('https://') === 0 || s.indexOf('http://') === 0) {
      return s;
    }
    return '';
  }

  function inArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) return true;
    }
    return false;
  }

  function getViewportWidth() {
    var w = 1024;
    if (typeof window.innerWidth === 'number' && window.innerWidth > 0) {
      w = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      w = document.documentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
      w = document.body.clientWidth;
    }
    return w;
  }

  function getGridCols(vw) {
    if (vw >= 980) return 3;
    if (vw >= 640) return 2;
    return 1;
  }

  function getAccentColor(mode) {
    if (mode === 'game') return THEME.blue;
    if (mode === 'all') return THEME.violet;
    if (mode === 'analytics') return THEME.emerald;
    return THEME.pink;
  }

  function getStatusLabel(statusCode, subjectTypeOrMode) {
    var meta = STATUS_META[statusCode];
    if (!meta) return '未知';
    if (subjectTypeOrMode === 4 || subjectTypeOrMode === 'game') return meta.game;
    if (subjectTypeOrMode === 2 || subjectTypeOrMode === 'anime') return meta.anime;
    return meta.all;
  }

  function spacerImg(w, h) {
    return '<img src="assets/img/spacer.gif" width="' + w + '" height="' + h + '" align="left" border="0" alt="">';
  }

  function barHtml(pct, heightPx, fillColor, trackColor) {
    var p = Math.round(pct);
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    var rest = 100 - p;
    var h = heightPx || 6;
    var html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + (trackColor || THEME.bgDeep) + '"><tr>';
    if (p > 0) {
      html += '<td width="' + p + '%" height="' + h + '" bgcolor="' + fillColor + '">' + spacerImg(1, h) + '</td>';
    }
    if (rest > 0) {
      html += '<td width="' + rest + '%" height="' + h + '" bgcolor="' + (trackColor || THEME.bgDeep) + '">' + spacerImg(1, h) + '</td>';
    }
    html += '</tr></table>';
    return html;
  }

  function badgeHtml(text, bg, fg, useMono) {
    var fontOpen = useMono ? '<font size="1" color="' + fg + '" face="Consolas, \'Courier New\', monospace">' : '<font size="1" color="' + fg + '">';
    return '<table border="0" cellpadding="2" cellspacing="0" bgcolor="' + bg + '"><tr><td>' + fontOpen + '<b>&nbsp;' + escHtml(text) + '&nbsp;</b></font></td></tr></table>';
  }

  function getScoreColors(rate) {
    if (rate >= 9) return { bg: '#FBBF24', fg: '#0B0E14' };
    if (rate >= 8) return { bg: '#F09199', fg: '#0B0E14' };
    if (rate >= 7) return { bg: '#60A5FA', fg: '#0B0E14' };
    if (rate >= 5) return { bg: '#334155', fg: '#E2E8F0' };
    if (rate >= 1) return { bg: '#451A22', fg: '#FCA5A5' };
    return { bg: '#1B2233', fg: '#64748B' };
  }

  // --- Data & Stats Computation ---

  function loadInitialData() {
    var snap = window.BGM_ARCHIVE_DATA;
    if (snap && snap.anime && snap.game) {
      dataStore.user = snap.user || dataStore.user;
      dataStore.synced_at = snap.synced_at || '';
      dataStore.anime = snap.anime || [];
      dataStore.game = snap.game || [];
    }
    // Check if localStorage has a newer live-synced copy
    try {
      if (window.localStorage && typeof JSON !== 'undefined' && JSON.parse) {
        var raw = window.localStorage.getItem(CACHE_KEY);
        if (raw) {
          var cached = JSON.parse(raw);
          if (cached && cached.anime && cached.game) {
            if (!dataStore.synced_at || (cached.synced_at && cached.synced_at > dataStore.synced_at)) {
              dataStore.user = cached.user || dataStore.user;
              dataStore.synced_at = cached.synced_at || dataStore.synced_at;
              dataStore.anime = cached.anime;
              dataStore.game = cached.game;
              state.syncStatus = 'live';
              state.syncMessage = '已加载本地最新缓存 (' + dataStore.synced_at + ')';
            }
          }
        }
      }
    } catch (e) {}
  }

  function computeSummary(items) {
    var total = items.length;
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    var rated = 0;
    var rateSum = 0;
    var topRated = 0;
    var commented = 0;
    var rateHist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // index 1..10
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (counts[it.t] !== undefined) counts[it.t]++;
      if (it.r > 0) {
        rated++;
        rateSum += it.r;
        if (it.r >= 9) topRated++;
        if (it.r >= 1 && it.r <= 10) rateHist[it.r]++;
      }
      if (trimStr(it.c).length > 0) commented++;
    }
    return {
      total: total,
      counts: counts,
      rated: rated,
      avg: rated > 0 ? (rateSum / rated).toFixed(2) : '--',
      topRated: topRated,
      commented: commented,
      rateHist: rateHist
    };
  }

  function getActivePool() {
    if (state.mode === 'anime') return dataStore.anime;
    if (state.mode === 'game') return dataStore.game;
    var combined = [];
    var i;
    for (i = 0; i < dataStore.anime.length; i++) combined.push(dataStore.anime[i]);
    for (i = 0; i < dataStore.game.length; i++) combined.push(dataStore.game[i]);
    return combined;
  }

  function findItemById(id) {
    var i;
    for (i = 0; i < dataStore.anime.length; i++) {
      if (dataStore.anime[i].id === id) return dataStore.anime[i];
    }
    for (i = 0; i < dataStore.game.length; i++) {
      if (dataStore.game[i].id === id) return dataStore.game[i];
    }
    return null;
  }

  function getFilteredItems() {
    var pool = getActivePool();
    var q = trimStr(state.query).toLowerCase();
    var out = [];
    for (var i = 0; i < pool.length; i++) {
      var it = pool[i];
      if (state.status !== 0 && it.t !== state.status) continue;

      if (state.rateFilter === '9plus' && it.r < 9) continue;
      if (state.rateFilter === '8plus' && it.r < 8) continue;
      if (state.rateFilter === '7plus' && it.r < 7) continue;
      if (state.rateFilter === '6minus' && (it.r === 0 || it.r > 6)) continue;
      if (state.rateFilter === 'rated' && it.r <= 0) continue;
      if (state.rateFilter === 'unrated' && it.r > 0) continue;
      if (state.rateFilter === 'commented' && trimStr(it.c).length === 0) continue;

      if (state.tag) {
        if (!it.tags || !inArray(it.tags, state.tag)) continue;
      }

      if (q) {
        var hay = ((it.cn || '') + ' ' + (it.n || '') + ' ' + (it.c || '') + ' ' + (it.tags ? it.tags.join(' ') : '')).toLowerCase();
        if (hay.indexOf(q) === -1) continue;
      }

      out.push(it);
    }

    out.sort(function (a, b) {
      if (state.sort === 'rate_desc') {
        if (b.r !== a.r) return b.r - a.r;
        return (b.sc || 0) - (a.sc || 0);
      }
      if (state.sort === 'rate_asc') {
        var ar = a.r > 0 ? a.r : 99;
        var br = b.r > 0 ? b.r : 99;
        if (ar !== br) return ar - br;
        return (a.sc || 0) - (b.sc || 0);
      }
      if (state.sort === 'bgm_desc') {
        if ((b.sc || 0) !== (a.sc || 0)) return (b.sc || 0) - (a.sc || 0);
        return (b.r || 0) - (a.r || 0);
      }
      if (state.sort === 'rank_asc') {
        var ark = a.rk > 0 ? a.rk : 999999;
        var brk = b.rk > 0 ? b.rk : 999999;
        if (ark !== brk) return ark - brk;
        return (b.sc || 0) - (a.sc || 0);
      }
      if (state.sort === 'date_desc') {
        var ad = a.d || '0000-00-00';
        var bd = b.d || '0000-00-00';
        if (bd > ad) return 1;
        if (bd < ad) return -1;
        return 0;
      }
      if (state.sort === 'title_asc') {
        var at = (a.cn || a.n || '').toLowerCase();
        var bt = (b.cn || b.n || '').toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      }
      // Default: 'updated'
      var au = a.ua || a.u || '';
      var bu = b.ua || b.u || '';
      if (bu > au) return 1;
      if (bu < au) return -1;
      return 0;
    });

    return out;
  }

  function getTopTags(pool, statusFilter, limit) {
    var counts = {};
    var i, j;
    for (i = 0; i < pool.length; i++) {
      var it = pool[i];
      if (statusFilter && statusFilter !== 0 && it.t !== statusFilter) continue;
      if (!it.tags) continue;
      for (j = 0; j < it.tags.length; j++) {
        var tg = it.tags[j];
        if (!tg) continue;
        // Skip pure 4-digit year tags in hot chips so genre/studio tags shine
        if (/^\d{4}$/.test(tg)) continue;
        counts[tg] = (counts[tg] || 0) + 1;
      }
    }
    var arr = [];
    for (var k in counts) {
      if (counts.hasOwnProperty(k)) {
        arr.push({ name: k, count: counts[k] });
      }
    }
    arr.sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.name < b.name ? -1 : 1;
    });
    return arr.slice(0, limit || 14);
  }

  // --- Rendering Sections (Pure HTML, Zero CSS) ---

  function renderMasthead(vw) {
    var animeStats = computeSummary(dataStore.anime);
    var gameStats = computeSummary(dataStore.game);
    var allStats = computeSummary(dataStore.anime.concat(dataStore.game));
    var isCompact = vw < 760;

    var syncText = '快照时间: ' + (dataStore.synced_at || '未知');
    var syncDotColor = THEME.textDim;
    if (state.syncStatus === 'checking') {
      syncText = '正在检查 Bangumi 最新动态...';
      syncDotColor = THEME.amber;
    } else if (state.syncStatus === 'syncing') {
      syncText = state.syncMessage || '正在从 Bangumi 同步数据...';
      syncDotColor = THEME.cyan;
    } else if (state.syncStatus === 'live') {
      syncText = state.syncMessage || ('已实时同步 · ' + dataStore.synced_at);
      syncDotColor = THEME.emerald;
    } else if (state.syncStatus === 'error') {
      syncText = state.syncMessage || '实时同步受限，当前显示本地快照';
      syncDotColor = THEME.red;
    }

    var syncSide =
      '<img src="assets/img/px-heart.gif" width="14" height="14" border="0" align="absmiddle" alt=""> <font size="1" color="' + THEME.pink + '" face="Consolas, \'Courier New\', monospace"><b>BANGUMI COLLECTION // UID #' + USER_ID + '</b></font><br>' +
      '<img src="assets/img/spacer.gif" width="1" height="4" border="0" alt=""><br>' +
      '<font size="1" color="' + syncDotColor + '">●</font>&nbsp;<font size="1" color="' + THEME.textMuted + '" face="Consolas, \'Courier New\', monospace">' + escHtml(syncText) + '</font><br>' +
      '<img src="assets/img/spacer.gif" width="1" height="6" border="0" alt=""><br>' +
      '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td bgcolor="#132536" onclick="window.BGM_APP.syncNow()"><table border="0" cellpadding="4" cellspacing="0"><tr><td><font size="1" color="' + THEME.cyan + '"><b>&nbsp;↻ 从 Bangumi 实时同步&nbsp;</b></font></td></tr></table></td>' +
        '<td width="8">' + spacerImg(8, 1) + '</td>' +
        '<td bgcolor="#241C3A" onclick="window.BGM_APP.randomPick()"><table border="0" cellpadding="4" cellspacing="0"><tr><td><font size="1" color="' + THEME.violet + '"><b>&nbsp;🎲 随机抽选一部&nbsp;</b></font></td></tr></table></td>' +
      '</tr></table>';

    var kpiBlock =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center">' +
            '<table border="0" cellpadding="6" cellspacing="0" width="100%"><tr><td align="center">' +
              '<font size="1" color="' + THEME.pink + '"><b>动画 ANIME</b></font><br>' +
              '<font size="4" color="' + THEME.textMain + '" face="Consolas, \'Courier New\', monospace"><b>' + animeStats.total + '</b></font><br>' +
              '<nobr><font size="1" color="' + THEME.textMuted + '">看过 ' + animeStats.counts[2] + ' · 在看 ' + animeStats.counts[3] + '</font></nobr>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center">' +
            '<table border="0" cellpadding="6" cellspacing="0" width="100%"><tr><td align="center">' +
              '<font size="1" color="' + THEME.blue + '"><b>游戏 GAME</b></font><br>' +
              '<font size="4" color="' + THEME.textMain + '" face="Consolas, \'Courier New\', monospace"><b>' + gameStats.total + '</b></font><br>' +
              '<nobr><font size="1" color="' + THEME.textMuted + '">玩过 ' + gameStats.counts[2] + ' · 在玩 ' + gameStats.counts[3] + '</font></nobr>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center">' +
            '<table border="0" cellpadding="6" cellspacing="0" width="100%"><tr><td align="center">' +
              '<font size="1" color="' + THEME.emerald + '"><b>总均分 AVG</b></font><br>' +
              '<font size="4" color="' + THEME.textMain + '" face="Consolas, \'Courier New\', monospace"><b>' + allStats.avg + '</b></font><br>' +
              '<nobr><font size="1" color="' + THEME.textMuted + '">已评分 ' + allStats.rated + ' 部</font></nobr>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center">' +
            '<table border="0" cellpadding="6" cellspacing="0" width="100%"><tr><td align="center">' +
              '<font size="1" color="' + THEME.amber + '"><b>9分+ 殿堂</b></font><br>' +
              '<font size="4" color="' + THEME.textMain + '" face="Consolas, \'Courier New\', monospace"><b>' + allStats.topRated + '</b></font><br>' +
              '<nobr><font size="1" color="' + THEME.textMuted + '">短评 ' + allStats.commented + ' 篇</font></nobr>' +
            '</td></tr></table>' +
          '</td>' +
        '</tr>' +
      '</table>';

    var inner = isCompact
      ? ('<tr><td>' + syncSide + '</td></tr><tr><td height="10">' + spacerImg(1, 10) + '</td></tr><tr><td>' + kpiBlock + '</td></tr>')
      : ('<tr><td valign="middle">' + syncSide + '</td><td width="480" valign="middle" align="right">' + kpiBlock + '</td></tr>');

    var siteHeader = (window.SITE_COMMON && window.SITE_COMMON.renderSiteHeader)
      ? (window.SITE_COMMON.renderSiteHeader('bangumi', vw) + '<img src="assets/img/spacer.gif" width="1" height="10" border="0" alt=""><br>')
      : '';

    return (
      siteHeader +
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellspacing="0" cellpadding="10">' + inner + '</table>' +
        '</td></tr>' +
      '</table>'
    );
  }

  function renderNavTabs(vw) {
    var animeCount = dataStore.anime.length;
    var gameCount = dataStore.game.length;
    var allCount = animeCount + gameCount;

    var tabs = [
      { id: 'anime', label: '✦ 动画 ANIME', count: animeCount, color: THEME.pink },
      { id: 'game', label: '◈ 游戏 GAME', count: gameCount, color: THEME.blue },
      { id: 'all', label: '◎ 全部作品 ALL', count: allCount, color: THEME.violet },
      { id: 'analytics', label: '▤ 数据图谱 ANALYTICS', count: null, color: THEME.emerald }
    ];

    var html = '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr>';
    for (var i = 0; i < tabs.length; i++) {
      var tb = tabs[i];
      var active = state.mode === tb.id;
      var bg = active ? tb.color : THEME.bgCard;
      var fg = active ? THEME.ink : THEME.textMain;
      var subFg = active ? THEME.ink : tb.color;
      var countStr = tb.count !== null ? ' <font size="1" color="' + subFg + '" face="Consolas, \'Courier New\', monospace">(' + tb.count + ')</font>' : '';
      var topLine = active ? tb.color : THEME.border;

      html +=
        '<td width="25%" bgcolor="' + bg + '" align="center" valign="middle" onclick="window.BGM_APP.setMode(\'' + tb.id + '\')">' +
          '<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
            '<tr><td height="3" bgcolor="' + tb.color + '">' + spacerImg(1, 3) + '</td></tr>' +
            '<tr><td align="center">' +
              '<table border="0" cellpadding="9" cellspacing="0"><tr><td align="center">' +
                '<font size="' + (vw < 540 ? '2' : '3') + '" color="' + fg + '"><b>' + tb.label + '</b></font>' + countStr +
              '</td></tr></table>' +
            '</td></tr>' +
          '</table>' +
        '</td>';
    }
    html += '</tr></table>';
    return html;
  }

  function renderStatusAndControls(pool, filteredCount, vw) {
    var summary = computeSummary(pool);
    var accent = getAccentColor(state.mode);
    var total = summary.total > 0 ? summary.total : 1;

    // Status pills row (zero underline via td onclick)
    var statusTabs = '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr>';
    var allActive = state.status === 0;
    statusTabs +=
      '<td bgcolor="' + (allActive ? THEME.bgElevated : THEME.bgCard) + '" align="center" onclick="window.BGM_APP.setStatus(0)">' +
        '<table border="0" cellpadding="7" cellspacing="0" width="100%"><tr><td align="center">' +
          '<font size="2" color="' + (allActive ? accent : THEME.textMain) + '"><b>全部</b></font> ' +
          '<font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">(' + summary.total + ')</font>' +
        '</td></tr></table>' +
      '</td>';

    for (var i = 0; i < STATUS_ORDER.length; i++) {
      var stCode = STATUS_ORDER[i];
      var meta = STATUS_META[stCode];
      var isAct = state.status === stCode;
      var lbl = getStatusLabel(stCode, state.mode);
      var cnt = summary.counts[stCode] || 0;
      statusTabs +=
        '<td bgcolor="' + (isAct ? meta.bg : THEME.bgCard) + '" align="center" onclick="window.BGM_APP.setStatus(' + stCode + ')">' +
          '<table border="0" cellpadding="7" cellspacing="0" width="100%"><tr><td align="center">' +
            '<font size="1" color="' + meta.color + '">■</font> ' +
            '<font size="2" color="' + (isAct ? meta.text : THEME.textMain) + '"><b>' + lbl + '</b></font> ' +
            '<font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">(' + cnt + ')</font>' +
          '</td></tr></table>' +
        '</td>';
    }
    statusTabs += '</tr></table>';

    // Segmented visual proportion bar
    var segBar = '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + THEME.bgDeep + '"><tr>';
    var usedPct = 0;
    for (i = 0; i < STATUS_ORDER.length; i++) {
      var sc = STATUS_ORDER[i];
      var c = summary.counts[sc] || 0;
      if (c <= 0) continue;
      var p = (i === STATUS_ORDER.length - 1) ? (100 - usedPct) : Math.round((c * 100) / total);
      if (p < 1 && c > 0) p = 1;
      if (usedPct + p > 100) p = 100 - usedPct;
      usedPct += p;
      if (p > 0) {
        segBar += '<td width="' + p + '%" height="5" bgcolor="' + STATUS_META[sc].color + '" title="' + getStatusLabel(sc, state.mode) + ': ' + c + '">' + spacerImg(1, 5) + '</td>';
      }
    }
    segBar += '</tr></table>';

    // Compact single-row hot tag chips (zero underline) + full dropdown
    var allTags = getTopTags(pool, state.status, 30);
    var chipTags = allTags.slice(0, vw < 640 ? 5 : 8);
    var tagRowHtml = '';
    if (chipTags.length > 0 || state.tag) {
      tagRowHtml = '<table border="0" cellpadding="2" cellspacing="3"><tr><td valign="middle"><font size="1" color="' + THEME.textMuted + '"><b>快捷标签:</b></font></td>';
      if (state.tag) {
        tagRowHtml +=
          '<td bgcolor="' + THEME.red + '" onclick="window.BGM_APP.setTagExact(\'\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + THEME.ink + '"><b>&nbsp;× ' + escHtml(state.tag) + '&nbsp;</b></font>' +
          '</td></tr></table></td>';
      }
      for (i = 0; i < chipTags.length; i++) {
        var tg = chipTags[i];
        var tgAct = state.tag === tg.name;
        var tgBg = tgAct ? accent : THEME.bgAlt;
        var tgFg = tgAct ? THEME.ink : THEME.textMain;
        tagRowHtml +=
          '<td bgcolor="' + tgBg + '" onclick="window.BGM_APP.setTag(\'' + escJsStr(tg.name) + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + tgFg + '">&nbsp;' + escHtml(tg.name) + ' <font color="' + (tgAct ? THEME.ink : THEME.textDim) + '">(' + tg.count + ')</font>&nbsp;</font>' +
          '</td></tr></table></td>';
      }
      tagRowHtml += '</tr></table>';
    }

    var tagSelect = '<select id="ctrl-tag" onchange="window.BGM_APP.setTagExact(this.value)"><option value="">全部标签</option>';
    for (i = 0; i < allTags.length; i++) {
      var optTg = allTags[i];
      tagSelect += '<option value="' + escHtml(optTg.name) + '"' + (state.tag === optTg.name ? ' selected' : '') + '>' + escHtml(optTg.name) + ' (' + optTg.count + ')</option>';
    }
    if (state.tag) {
      var foundTag = false;
      for (i = 0; i < allTags.length; i++) {
        if (allTags[i].name === state.tag) { foundTag = true; break; }
      }
      if (!foundTag) {
        tagSelect += '<option value="' + escHtml(state.tag) + '" selected>' + escHtml(state.tag) + '</option>';
      }
    }
    tagSelect += '</select>';

    // Search + Sort + Filter + View Toolbar
    var rateOpts = [
      ['all', '全部评分'],
      ['9plus', '9–10 分 (神作殿堂)'],
      ['8plus', '8 分以上 (佳作)'],
      ['7plus', '7 分以上'],
      ['6minus', '6 分及以下'],
      ['rated', '仅看已评分'],
      ['unrated', '仅看未评分'],
      ['commented', '仅看有短评']
    ];
    var rateSelect = '<select id="ctrl-rate" onchange="window.BGM_APP.setRateFilter(this.value)">';
    for (i = 0; i < rateOpts.length; i++) {
      rateSelect += '<option value="' + rateOpts[i][0] + '"' + (state.rateFilter === rateOpts[i][0] ? ' selected' : '') + '>' + rateOpts[i][1] + '</option>';
    }
    rateSelect += '</select>';

    var sortOpts = [
      ['updated', '排序: 最近更新'],
      ['rate_desc', '排序: 个人评分 (高→低)'],
      ['rate_asc', '排序: 个人评分 (低→高)'],
      ['bgm_desc', '排序: Bangumi评分 (高→低)'],
      ['rank_asc', '排序: Bangumi排名 (前→后)'],
      ['date_desc', '排序: 发行/放送日 (新→旧)'],
      ['title_asc', '排序: 标题 (A→Z)']
    ];
    var sortSelect = '<select id="ctrl-sort" onchange="window.BGM_APP.setSort(this.value)">';
    for (i = 0; i < sortOpts.length; i++) {
      sortSelect += '<option value="' + sortOpts[i][0] + '"' + (state.sort === sortOpts[i][0] ? ' selected' : '') + '>' + sortOpts[i][1] + '</option>';
    }
    sortSelect += '</select>';

    var sizeOpts = [[24, '每页 24 条'], [48, '每页 48 条'], [0, '显示全部']];
    var sizeSelect = '<select id="ctrl-size" onchange="window.BGM_APP.setPageSize(this.value)">';
    for (i = 0; i < sizeOpts.length; i++) {
      sizeSelect += '<option value="' + sizeOpts[i][0] + '"' + (state.pageSize === sizeOpts[i][0] ? ' selected' : '') + '>' + sizeOpts[i][1] + '</option>';
    }
    sizeSelect += '</select>';

    var gridActive = state.view === 'grid';
    var viewSwitch =
      '<table border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.borderStrong + '"><tr>' +
        '<td bgcolor="' + (gridActive ? accent : THEME.bgCard) + '" onclick="window.BGM_APP.setView(\'grid\')">' +
          '<table border="0" cellpadding="5" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + (gridActive ? THEME.ink : THEME.textMain) + '"><b>&nbsp;▦ 画廊卡片&nbsp;</b></font>' +
          '</td></tr></table>' +
        '</td>' +
        '<td bgcolor="' + (!gridActive ? accent : THEME.bgCard) + '" onclick="window.BGM_APP.setView(\'table\')">' +
          '<table border="0" cellpadding="5" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + (!gridActive ? THEME.ink : THEME.textMain) + '"><b>&nbsp;☰ 档案表格&nbsp;</b></font>' +
          '</td></tr></table>' +
        '</td>' +
      '</tr></table>';

    var toolbar =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellspacing="0" cellpadding="10">' +
            '<tr><td>' +
              '<form onsubmit="window.BGM_APP.applySearch(); return false;">' +
                '<table width="100%" border="0" cellspacing="0" cellpadding="4">' +
                  '<tr>' +
                    '<td valign="middle">' +
                      '<font size="2" color="' + THEME.textMuted + '"><b>检索:</b></font> ' +
                      '<input type="text" id="ctrl-query" size="' + (vw < 640 ? '14' : '20') + '" value="' + escHtml(state.query) + '" placeholder="标题 / 原名 / 短评 / 标签"> ' +
                      '<button type="submit">搜索</button> ' +
                      '<button type="button" onclick="window.BGM_APP.resetFilters()">重置</button> ' +
                      '&nbsp;' + tagSelect + ' ' + rateSelect + ' ' + sortSelect + ' ' + sizeSelect +
                    '</td>' +
                    '<td align="right" valign="middle">' + viewSwitch + '</td>' +
                  '</tr>' +
                '</table>' +
              '</form>' +
            '</td></tr>' +
            (tagRowHtml ? '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="6" cellspacing="0"><tr><td>' + tagRowHtml + '</td></tr></table></td></tr>' : '') +
            '<tr><td bgcolor="' + THEME.bgDeep + '">' +
              '<table width="100%" border="0" cellpadding="6" cellspacing="0"><tr>' +
                '<td><font size="1" color="' + THEME.textMuted + '">当前筛选命中 <font color="' + accent + '" face="Consolas, monospace"><b>' + filteredCount + '</b></font> 部作品' +
                  (state.tag ? ' · 标签 [<font color="' + accent + '">' + escHtml(state.tag) + '</font>]' : '') +
                  (state.query ? ' · 关键词 [<font color="' + accent + '">' + escHtml(state.query) + '</font>]' : '') +
                '</font></td>' +
                '<td align="right"><font size="1" color="' + THEME.textDim + '">点击封面或标题查看详情档案</font></td>' +
              '</tr></table>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +
      '</table>';

    return statusTabs + segBar + '<img src="assets/img/spacer.gif" width="1" height="10" border="0" alt=""><br>' + toolbar;
  }

  function renderDossier(item, vw) {
    if (!item) return '';
    var accent = item.st === 4 ? THEME.blue : THEME.pink;
    var stMeta = STATUS_META[item.t] || STATUS_META[2];
    var stLabel = getStatusLabel(item.t, item.st);
    var scColors = getScoreColors(item.r);
    var coverW = vw < 640 ? 110 : 170;

    var tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      tagsHtml = '<table border="0" cellpadding="2" cellspacing="3"><tr>';
      for (var i = 0; i < item.tags.length; i++) {
        var tg = item.tags[i];
        tagsHtml +=
          '<td bgcolor="' + THEME.bgAlt + '" onclick="window.BGM_APP.jumpToTag(' + item.st + ', \'' + escJsStr(tg) + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + accent + '">&nbsp;#' + escHtml(tg) + '&nbsp;</font>' +
          '</td></tr></table></td>';
      }
      tagsHtml += '</tr></table>';
    }

    var epText = '';
    if (item.eps > 0) {
      var pct = Math.min(100, Math.round((item.ep * 100) / item.eps));
      epText =
        '<table width="260" border="0" cellpadding="2" cellspacing="0"><tr>' +
          '<td><font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">进度: ' + item.ep + ' / ' + item.eps + ' (' + pct + '%)</font></td>' +
        '</tr><tr><td>' + barHtml(pct, 6, accent, THEME.bgDeep) + '</td></tr></table>';
    }

    var commentBlock = '';
    if (trimStr(item.c)) {
      commentBlock =
        '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + accent + '"><tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + accent + '"><b>GuraNirei 的个人短评</b></font><br>' +
            '<font size="2" color="' + THEME.textMain + '">' + escHtml(item.c) + '</font>' +
          '</td></tr></table>' +
        '</td></tr></table><br>';
    }

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + accent + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
            '<tr><td bgcolor="' + THEME.bgElevated + '">' +
              '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
                '<td><font size="2" color="' + accent + '" face="Consolas, monospace"><b>SUBJECT DOSSIER // #' + item.id + ' · ' + (item.st === 4 ? 'GAME' : 'ANIME') + '</b></font></td>' +
                '<td align="right">' +
                  '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
                    '<td bgcolor="#1E273B" onclick="window.BGM_APP.openSubjectBgm(' + item.id + ')"><table border="0" cellpadding="5" cellspacing="0"><tr><td><font size="1" color="' + accent + '"><b>&nbsp;在 Bangumi 打开 ↗&nbsp;</b></font></td></tr></table></td>' +
                    '<td width="8">' + spacerImg(8, 1) + '</td>' +
                    '<td bgcolor="#2E171D" onclick="window.BGM_APP.closeDetail()"><table border="0" cellpadding="5" cellspacing="0"><tr><td><font size="1" color="#FCA5A5"><b>&nbsp;× 关闭详情&nbsp;</b></font></td></tr></table></td>' +
                  '</tr></table>' +
                '</td>' +
              '</tr></table>' +
            '</td></tr>' +
            '<tr><td>' +
              '<table width="100%" border="0" cellpadding="14" cellspacing="0"><tr>' +
                '<td width="' + (coverW + 12) + '" valign="top" align="center">' +
                  '<table border="0" cellpadding="3" cellspacing="0" bgcolor="' + THEME.bgDeep + '"><tr><td>' +
                    (item.img ? '<img src="' + escHtml(safeUrl(item.img)) + '" width="' + coverW + '" border="0" alt="' + escHtml(item.cn || item.n) + '">' : '<font size="2" color="' + THEME.textDim + '">无封面</font>') +
                  '</td></tr></table>' +
                '</td>' +
                '<td valign="top">' +
                  '<table border="0" cellpadding="0" cellspacing="4"><tr>' +
                    '<td>' + badgeHtml(stLabel, stMeta.bg, stMeta.text, false) + '</td>' +
                    '<td>' + badgeHtml(item.r > 0 ? ('个人评分 ★ ' + item.r + '/10') : '个人未评分', scColors.bg, scColors.fg, true) + '</td>' +
                    (item.sc > 0 ? '<td>' + badgeHtml('BGM ' + item.sc + (item.rk > 0 ? (' · #' + item.rk) : ''), THEME.bgAlt, THEME.textMuted, true) + '</td>' : '') +
                  '</tr></table>' +
                  '<img src="assets/img/spacer.gif" width="1" height="6" border="0" alt=""><br>' +
                  '<font size="5" color="' + THEME.textMain + '"><b>' + escHtml(item.cn || item.n) + '</b></font><br>' +
                  (item.cn && item.n && item.cn !== item.n ? '<font size="2" color="' + THEME.textMuted + '">' + escHtml(item.n) + '</font><br>' : '') +
                  '<img src="assets/img/spacer.gif" width="1" height="6" border="0" alt=""><br>' +
                  '<font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">发行/放送日期: ' + escHtml(item.d || '未知') + ' &nbsp;|&nbsp; 收藏更新: ' + escHtml(item.u || '未知') + ' &nbsp;|&nbsp; 收藏热度: ' + (item.ct || 0) + ' 人</font><br>' +
                  '<img src="assets/img/spacer.gif" width="1" height="8" border="0" alt=""><br>' +
                  (epText ? epText + '<img src="assets/img/spacer.gif" width="1" height="8" border="0" alt=""><br>' : '') +
                  commentBlock +
                  (item.sum ? '<font size="2" color="' + THEME.textMuted + '">' + escHtml(item.sum) + '</font><br><img src="assets/img/spacer.gif" width="1" height="8" border="0" alt=""><br>' : '') +
                  tagsHtml +
                '</td>' +
              '</tr></table>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +
      '</table><img src="assets/img/spacer.gif" width="1" height="12" border="0" alt=""><br>'
    );
  }

  function truncateStr(s, maxLen) {
    var str = trimStr(s);
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 1) + '…';
  }

  function renderCardParts(item, contentW) {
    var stMeta = STATUS_META[item.t] || STATUS_META[2];
    var stLabel = getStatusLabel(item.t, item.st);
    var typeTag = item.st === 4 ? 'GAME' : 'ANIME';
    var typeColor = item.st === 4 ? THEME.blue : THEME.pink;
    var scColors = getScoreColors(item.r);
    var titleMain = truncateStr(item.cn || item.n || ('#' + item.id), 28);
    var rawSub = (item.cn && item.n && item.cn !== item.n) ? item.n : '';
    var titleSub = truncateStr(rawSub, 30);
    var hasComment = trimStr(item.c).length > 0;

    // Progress row for anime/episodic works
    var progHtml = '';
    if (item.eps > 0 && (item.t === 3 || (item.ep > 0 && item.ep < item.eps))) {
      var pct = Math.min(100, Math.round((item.ep * 100) / item.eps));
      progHtml =
        '<img src="assets/img/spacer.gif" width="1" height="4" border="0" alt=""><br>' +
        '<font size="1" color="' + THEME.cyan + '" face="Consolas, monospace">进度 ' + item.ep + '/' + item.eps + '</font>' +
        barHtml(pct, 4, THEME.cyan, THEME.bgDeep);
    }

    // Tags (up to 3, truncated cleanly so width never overflows)
    var tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      tagsHtml = '<table border="0" cellpadding="1" cellspacing="2"><tr>';
      var usedChars = 0;
      var shown = 0;
      for (var i = 0; i < item.tags.length && shown < 3; i++) {
        var tgText = truncateStr(item.tags[i], 9);
        if (shown > 0 && usedChars + tgText.length > 16) break;
        usedChars += tgText.length;
        shown++;
        tagsHtml +=
          '<td bgcolor="' + THEME.bgElevated + '">' +
            '<font size="1" color="' + THEME.textMuted + '">&nbsp;' + escHtml(tgText) + '&nbsp;</font>' +
          '</td>';
      }
      tagsHtml += '</tr></table>';
    }

    var headerHtml =
      '<table width="100%" border="0" cellpadding="8" cellspacing="0"><tr>' +
        '<td align="left" valign="middle">' +
          '<table border="0" cellpadding="0" cellspacing="2"><tr>' +
            '<td>' + badgeHtml(stLabel, stMeta.bg, stMeta.text, false) + '</td>' +
            (state.mode === 'all' ? '<td>' + badgeHtml(typeTag, THEME.bgElevated, typeColor, true) + '</td>' : '') +
          '</tr></table>' +
        '</td>' +
        '<td align="right" valign="middle">' +
          badgeHtml(item.r > 0 ? ('★ ' + item.r) : '未评', scColors.bg, scColors.fg, true) +
        '</td>' +
      '</tr></table>';

    var bodyHtml =
      '<table width="100%" border="0" cellpadding="8" cellspacing="0"><tr>' +
        '<td width="88" valign="top" align="center" onclick="window.BGM_APP.openDetail(' + item.id + ')">' +
          '<table border="0" cellpadding="0" cellspacing="1" bgcolor="' + THEME.border + '"><tr>' +
            '<td width="86" height="122" valign="middle" align="center" bgcolor="' + THEME.bgDeep + '">' +
              (item.img ? '<img src="' + escHtml(safeUrl(item.img)) + '" width="80" border="0" alt="' + escHtml(titleMain) + '">' : '<font size="1" color="' + THEME.textDim + '">无图</font>') +
            '</td>' +
          '</tr></table>' +
        '</td>' +
        '<td width="8">' + spacerImg(8, 126) + '</td>' +
        '<td valign="top">' +
          '<span onclick="window.BGM_APP.openDetail(' + item.id + ')">' +
            '<font size="3" color="' + THEME.textMain + '"><b>' + escHtml(titleMain) + '</b></font>' +
          '</span><br>' +
          (titleSub ? '<font size="1" color="' + THEME.textMuted + '">' + escHtml(titleSub) + '</font><br>' : '') +
          '<img src="assets/img/spacer.gif" width="1" height="5" border="0" alt=""><br>' +
          '<font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">' +
            (item.d ? escHtml(item.d) : '未知日期') +
            (item.sc > 0 ? ' · BGM <font color="' + THEME.amber + '"><b>' + item.sc + '</b></font>' : '') +
            (item.rk > 0 ? ' · <font color="' + THEME.textDim + '">#' + item.rk + '</font>' : '') +
          '</font><br>' +
          progHtml +
          '<img src="assets/img/spacer.gif" width="1" height="6" border="0" alt=""><br>' +
          tagsHtml +
        '</td>' +
      '</tr></table>';

    var commentHtml = '';
    if (hasComment) {
      commentHtml =
        '<table width="100%" border="0" cellpadding="7" cellspacing="0"><tr><td>' +
          '<font size="1" color="' + typeColor + '"><b>💬</b></font> ' +
          '<font size="1" color="' + THEME.textMain + '">' + escHtml(truncateStr(item.c, 46)) + '</font>' +
        '</td></tr></table>';
    }

    var footerHtml =
      '<table width="100%" border="0" cellpadding="6" cellspacing="0"><tr>' +
        '<td valign="middle"><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">更新 ' + escHtml(item.u || '-') + '</font></td>' +
        '<td align="right" valign="middle">' +
          '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
            '<td bgcolor="#1E273B" onclick="window.BGM_APP.openDetail(' + item.id + ')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + typeColor + '"><b>&nbsp;详情&nbsp;</b></font></td></tr></table></td>' +
            '<td width="6">' + spacerImg(6, 1) + '</td>' +
            '<td bgcolor="#1B2233" onclick="window.BGM_APP.openSubjectBgm(' + item.id + ')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>&nbsp;BGM ↗&nbsp;</b></font></td></tr></table></td>' +
          '</tr></table>' +
        '</td>' +
      '</tr></table>';

    return {
      topColor: stMeta.color,
      header: headerHtml,
      body: bodyHtml,
      hasComment: hasComment,
      comment: commentHtml,
      footer: footerHtml,
      widthAttr: contentW > 0 ? (' width="' + contentW + '"') : ''
    };
  }

  function renderGrid(items, vw) {
    if (items.length === 0) {
      return renderEmptyState();
    }
    var cols = getGridCols(vw);
    var isFixedDesktop = (cols === 3 && vw >= 1140);
    var contentW = isFixedDesktop ? 350 : 0; // 3 * (350 + 2 borders) + 2 * 12 gutter = 1080 exact!
    var gutterW = 12;
    var totalTableCols = cols * 3 + (cols - 1);

    var html = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';

    // Column width strut row to lock identical card widths
    html += '<tr>';
    for (var c = 0; c < cols; c++) {
      if (c > 0) html += '<td width="' + gutterW + '">' + spacerImg(gutterW, 1) + '</td>';
      if (isFixedDesktop) {
        html += '<td width="1">' + spacerImg(1, 1) + '</td><td width="' + contentW + '">' + spacerImg(contentW, 1) + '</td><td width="1">' + spacerImg(1, 1) + '</td>';
      } else {
        var pctW = cols === 2 ? '49%' : '100%';
        html += '<td width="1">' + spacerImg(1, 1) + '</td><td width="' + pctW + '">' + spacerImg(1, 1) + '</td><td width="1">' + spacerImg(1, 1) + '</td>';
      }
    }
    html += '</tr>';

    for (var i = 0; i < items.length; i += cols) {
      if (i > 0) {
        html += '<tr><td colspan="' + totalTableCols + '" height="12">' + spacerImg(1, 12) + '</td></tr>';
      }
      var rowParts = [];
      var anyComment = false;
      for (c = 0; c < cols; c++) {
        var idx = i + c;
        if (idx < items.length) {
          var p = renderCardParts(items[idx], contentW);
          if (p.hasComment) anyComment = true;
          rowParts.push(p);
        } else {
          rowParts.push(null);
        }
      }

      // 1. Top 3px accent strip
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td width="' + gutterW + '"></td>';
        if (rowParts[c]) {
          html += '<td colspan="3" height="3" bgcolor="' + rowParts[c].topColor + '">' + spacerImg(1, 3) + '</td>';
        } else {
          html += '<td colspan="3" height="3"></td>';
        }
      }
      html += '</tr>';

      // 2. Card Header (Status + Score)
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (rowParts[c]) {
          html += '<td width="1" bgcolor="' + THEME.border + '"></td><td' + rowParts[c].widthAttr + ' bgcolor="' + THEME.bgCard + '" valign="middle">' + rowParts[c].header + '</td><td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 3. Card Body (Automatically equal height across all cards in this row!)
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (rowParts[c]) {
          html += '<td width="1" bgcolor="' + THEME.border + '"></td><td' + rowParts[c].widthAttr + ' bgcolor="' + THEME.bgCard + '" valign="top">' + rowParts[c].body + '</td><td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 4. Synchronized Comment Row (if any card in row has a comment)
      if (anyComment) {
        html += '<tr>';
        for (c = 0; c < cols; c++) {
          if (c > 0) html += '<td></td>';
          if (rowParts[c]) {
            var cHtml = rowParts[c].hasComment
              ? rowParts[c].comment
              : '<table width="100%" border="0" cellpadding="7" cellspacing="0"><tr><td><font size="1" color="' + THEME.textDim + '">&nbsp;</font></td></tr></table>';
            html += '<td width="1" bgcolor="' + THEME.border + '"></td><td' + rowParts[c].widthAttr + ' bgcolor="' + THEME.bgElevated + '" valign="middle">' + cHtml + '</td><td width="1" bgcolor="' + THEME.border + '"></td>';
          } else {
            html += '<td colspan="3"></td>';
          }
        }
        html += '</tr>';
      }

      // 5. Card Footer (Synchronized baseline!)
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (rowParts[c]) {
          html += '<td width="1" bgcolor="' + THEME.border + '"></td><td' + rowParts[c].widthAttr + ' bgcolor="' + THEME.bgAlt + '" valign="middle">' + rowParts[c].footer + '</td><td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 6. Bottom 1px border
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (rowParts[c]) {
          html += '<td colspan="3" height="1" bgcolor="' + THEME.border + '">' + spacerImg(1, 1) + '</td>';
        } else {
          html += '<td colspan="3" height="1"></td>';
        }
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }

  function renderTableView(items) {
    if (items.length === 0) {
      return renderEmptyState();
    }
    var html =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr bgcolor="' + THEME.bgElevated + '">' +
          '<th align="left"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>封面</b></font></td></tr></table></th>' +
          '<th align="left"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>作品标题</b></font></td></tr></table></th>' +
          '<th align="center"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>状态</b></font></td></tr></table></th>' +
          '<th align="center"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>个人评分</b></font></td></tr></table></th>' +
          '<th align="center"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>BGM评分/排名</b></font></td></tr></table></th>' +
          '<th align="center"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>日期 / 更新</b></font></td></tr></table></th>' +
          '<th align="left"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>个人短评</b></font></td></tr></table></th>' +
          '<th align="center"><table border="0" cellpadding="8" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>链接</b></font></td></tr></table></th>' +
        '</tr>';

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var rowBg = (i % 2 === 0) ? THEME.bgCard : THEME.bgAlt;
      var stMeta = STATUS_META[it.t] || STATUS_META[2];
      var scColors = getScoreColors(it.r);
      var typeColor = it.st === 4 ? THEME.blue : THEME.pink;
      var mainTitle = it.cn || it.n || ('#' + it.id);
      var subTitle = (it.cn && it.n && it.cn !== it.n) ? it.n : '';

      html +=
        '<tr bgcolor="' + rowBg + '">' +
          '<td width="46" align="center" valign="middle">' +
            '<table border="0" cellpadding="4" cellspacing="0"><tr><td>' +
              (it.img ? '<img src="' + escHtml(safeUrl(it.img)) + '" width="36" border="0" alt="">' : '-') +
            '</td></tr></table>' +
          '</td>' +
          '<td valign="middle">' +
            '<table border="0" cellpadding="6" cellspacing="0"><tr><td>' +
              (state.mode === 'all' ? '<font size="1" color="' + typeColor + '" face="Consolas, monospace"><b>[' + (it.st === 4 ? 'GAME' : 'ANIME') + ']</b></font> ' : '') +
              '<span onclick="window.BGM_APP.openDetail(' + it.id + ')"><font size="2" color="' + THEME.textMain + '"><b>' + escHtml(mainTitle) + '</b></font></span>' +
              (subTitle ? '<br><font size="1" color="' + THEME.textMuted + '">' + escHtml(subTitle) + '</font>' : '') +
            '</td></tr></table>' +
          '</td>' +
          '<td align="center" valign="middle">' + badgeHtml(getStatusLabel(it.t, it.st), stMeta.bg, stMeta.text, false) + '</td>' +
          '<td align="center" valign="middle">' +
            badgeHtml(it.r > 0 ? ('★ ' + it.r) : '未评', scColors.bg, scColors.fg, true) +
          '</td>' +
          '<td align="center" valign="middle">' +
            '<font size="1" color="' + THEME.amber + '" face="Consolas, monospace"><b>' + (it.sc > 0 ? it.sc : '--') + '</b></font>' +
            (it.rk > 0 ? '<br><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">#' + it.rk + '</font>' : '') +
          '</td>' +
          '<td align="center" valign="middle">' +
            '<font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">' + escHtml(it.d || '-') + '</font>' +
            '<br><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">更 ' + escHtml(it.u || '-') + '</font>' +
          '</td>' +
          '<td valign="middle">' +
            '<table border="0" cellpadding="6" cellspacing="0"><tr><td><font size="1" color="' + (trimStr(it.c) ? THEME.textMain : THEME.textDim) + '">' + (trimStr(it.c) ? escHtml(it.c) : '-') + '</font></td></tr></table>' +
          '</td>' +
          '<td align="center" valign="middle">' +
            '<table border="0" cellpadding="2" cellspacing="0" bgcolor="#1E273B"><tr><td onclick="window.BGM_APP.openSubjectBgm(' + it.id + ')"><font size="1" color="' + typeColor + '"><b>&nbsp;BGM ↗&nbsp;</b></font></td></tr></table>' +
          '</td>' +
        '</tr>';
    }
    html += '</table>';
    return html;
  }

  function renderEmptyState() {
    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '" align="center">' +
          '<table border="0" cellpadding="32" cellspacing="0"><tr><td align="center">' +
            '<font size="4" color="' + THEME.textMuted + '"><b>没有找到符合当前筛选条件的作品</b></font><br><br>' +
            '<button type="button" onclick="window.BGM_APP.resetFilters()">重置所有筛选条件</button>' +
          '</td></tr></table>' +
        '</td></tr>' +
      '</table>'
    );
  }

  function renderPagination(totalItems) {
    if (state.pageSize <= 0 || totalItems <= state.pageSize) return '';
    var totalPages = Math.ceil(totalItems / state.pageSize);
    var cur = state.page;
    var accent = getAccentColor(state.mode);

    var html =
      '<img src="assets/img/spacer.gif" width="1" height="10" border="0" alt=""><br>' +
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td align="left">' +
              '<font size="2" color="' + THEME.textMuted + '" face="Consolas, monospace">第 <b>' + cur + '</b> / ' + totalPages + ' 页 · 共 ' + totalItems + ' 部</font>' +
            '</td>' +
            '<td align="right">' +
              '<table border="0" cellpadding="0" cellspacing="3"><tr>';

    function pageBtn(label, targetPage, disabled, active) {
      var bg = active ? accent : (disabled ? THEME.bgCard : THEME.bgAlt);
      var fg = active ? THEME.ink : (disabled ? THEME.textDim : THEME.textMain);
      var clickAttr = disabled ? '' : (' onclick="window.BGM_APP.setPage(' + targetPage + ')"');
      return '<td bgcolor="' + bg + '"' + clickAttr + '><table border="0" cellpadding="5" cellspacing="0"><tr><td><font size="1" color="' + fg + '" face="Consolas, monospace"><b>&nbsp;' + label + '&nbsp;</b></font></td></tr></table></td>';
    }

    html += pageBtn('« 首页', 1, cur <= 1, false);
    html += pageBtn('‹ 上一页', cur - 1, cur <= 1, false);

    var startP = Math.max(1, cur - 2);
    var endP = Math.min(totalPages, cur + 2);
    for (var p = startP; p <= endP; p++) {
      html += pageBtn(String(p), p, false, p === cur);
    }

    html += pageBtn('下一页 ›', cur + 1, cur >= totalPages, false);
    html += pageBtn('末页 »', totalPages, cur >= totalPages, false);
    html += '</tr></table></td></tr></table></td></tr></table>';
    return html;
  }

  // --- Analytics Dashboard View (Pure HTML Data Visualizations!) ---

  function renderAnalytics(vw) {
    var animeStats = computeSummary(dataStore.anime);
    var gameStats = computeSummary(dataStore.game);
    var allItems = dataStore.anime.concat(dataStore.game);

    // Max bar value for 1-10 rating histogram
    var maxHist = 1;
    var s;
    for (s = 1; s <= 10; s++) {
      if (animeStats.rateHist[s] > maxHist) maxHist = animeStats.rateHist[s];
      if (gameStats.rateHist[s] > maxHist) maxHist = gameStats.rateHist[s];
    }

    var histRows = '';
    for (s = 10; s >= 1; s--) {
      var ac = animeStats.rateHist[s];
      var gc = gameStats.rateHist[s];
      var ap = Math.round((ac * 100) / maxHist);
      var gp = Math.round((gc * 100) / maxHist);
      var scCol = getScoreColors(s);
      histRows +=
        '<tr bgcolor="' + (s % 2 === 0 ? THEME.bgCard : THEME.bgAlt) + '">' +
          '<td width="52" align="center">' + badgeHtml(s + ' 分', scCol.bg, scCol.fg, true) + '</td>' +
          '<td width="46%" valign="middle">' +
            '<table width="100%" border="0" cellpadding="4" cellspacing="0"><tr>' +
              '<td>' + barHtml(ap, 8, THEME.pink, THEME.bgDeep) + '</td>' +
              '<td width="40" align="right"><font size="1" color="' + THEME.pink + '" face="Consolas, monospace"><b>' + ac + '</b></font></td>' +
            '</tr></table>' +
          '</td>' +
          '<td width="46%" valign="middle">' +
            '<table width="100%" border="0" cellpadding="4" cellspacing="0"><tr>' +
              '<td>' + barHtml(gp, 8, THEME.blue, THEME.bgDeep) + '</td>' +
              '<td width="40" align="right"><font size="1" color="' + THEME.blue + '" face="Consolas, monospace"><b>' + gc + '</b></font></td>' +
            '</tr></table>' +
          '</td>' +
        '</tr>';
    }

    var histPanel =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td><font size="3" color="' + THEME.emerald + '"><b>评分分布直方图 (1–10 分)</b></font></td>' +
            '<td align="right"><font size="1" color="' + THEME.pink + '">■ 动画 (均分 ' + animeStats.avg + ')</font> &nbsp; <font size="1" color="' + THEME.blue + '">■ 游戏 (均分 ' + gameStats.avg + ')</font></td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellspacing="1" cellpadding="2" bgcolor="' + THEME.border + '">' +
            '<tr bgcolor="' + THEME.bgDeep + '"><th align="center"><font size="1" color="' + THEME.textMuted + '">分数</font></th><th align="left"><font size="1" color="' + THEME.pink + '">&nbsp;动画评分人数</font></th><th align="left"><font size="1" color="' + THEME.blue + '">&nbsp;游戏评分人数</font></th></tr>' +
            histRows +
          '</table>' +
        '</td></tr>' +
      '</table>';

    // Era / Release Decade Breakdown
    var eras = [
      { label: '2024–2026', min: 2024, max: 2029, a: 0, g: 0 },
      { label: '2020–2023', min: 2020, max: 2023, a: 0, g: 0 },
      { label: '2015–2019', min: 2015, max: 2019, a: 0, g: 0 },
      { label: '2010–2014', min: 2010, max: 2014, a: 0, g: 0 },
      { label: '2000–2009', min: 2000, max: 2009, a: 0, g: 0 },
      { label: '1999 及更早', min: 0, max: 1999, a: 0, g: 0 }
    ];
    var i, j;
    for (i = 0; i < allItems.length; i++) {
      var yr = parseInt((allItems[i].d || '').slice(0, 4), 10);
      if (isNaN(yr)) continue;
      for (j = 0; j < eras.length; j++) {
        if (yr >= eras[j].min && yr <= eras[j].max) {
          if (allItems[i].st === 4) eras[j].g++; else eras[j].a++;
          break;
        }
      }
    }
    var maxEra = 1;
    for (j = 0; j < eras.length; j++) {
      if (eras[j].a + eras[j].g > maxEra) maxEra = eras[j].a + eras[j].g;
    }
    var eraRows = '';
    for (j = 0; j < eras.length; j++) {
      var totEra = eras[j].a + eras[j].g;
      var aPct = Math.round((eras[j].a * 100) / maxEra);
      var gPct = Math.round((eras[j].g * 100) / maxEra);
      var restPct = Math.max(0, 100 - aPct - gPct);
      eraRows +=
        '<tr>' +
          '<td width="92"><font size="1" color="' + THEME.textMain + '" face="Consolas, monospace"><b>' + eras[j].label + '</b></font></td>' +
          '<td>' +
            '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + THEME.bgDeep + '"><tr>' +
              (aPct > 0 ? '<td width="' + aPct + '%" height="10" bgcolor="' + THEME.pink + '">' + spacerImg(1, 10) + '</td>' : '') +
              (gPct > 0 ? '<td width="' + gPct + '%" height="10" bgcolor="' + THEME.blue + '">' + spacerImg(1, 10) + '</td>' : '') +
              (restPct > 0 ? '<td width="' + restPct + '%" height="10" bgcolor="' + THEME.bgDeep + '">' + spacerImg(1, 10) + '</td>' : '') +
            '</tr></table>' +
          '</td>' +
          '<td width="96" align="right"><font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">' + eras[j].a + ' + ' + eras[j].g + ' = <font color="' + THEME.textMain + '"><b>' + totEra + '</b></font></font></td>' +
        '</tr>';
    }

    var eraPanel =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '"><table border="0" cellpadding="10" cellspacing="0"><tr><td><font size="3" color="' + THEME.emerald + '"><b>作品发行/放送年代分布</b></font></td></tr></table></td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="8" cellspacing="4">' + eraRows + '</table></td></tr>' +
      '</table>';

    // Top 18 Tags Leaderboard
    var topTags = getTopTags(allItems, 0, 18);
    var maxTg = topTags.length > 0 ? topTags[0].count : 1;
    var tagRows = '';
    for (i = 0; i < topTags.length; i++) {
      var tg = topTags[i];
      var tPct = Math.round((tg.count * 100) / maxTg);
      tagRows +=
        '<tr>' +
          '<td width="24" align="right"><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">' + (i + 1) + '</font></td>' +
          '<td width="110" onclick="window.BGM_APP.jumpToTag(0, \'' + escJsStr(tg.name) + '\')"><font size="2" color="' + THEME.emerald + '"><b>' + escHtml(tg.name) + '</b></font></td>' +
          '<td>' + barHtml(tPct, 8, THEME.emerald, THEME.bgDeep) + '</td>' +
          '<td width="44" align="right"><font size="1" color="' + THEME.textMain + '" face="Consolas, monospace"><b>' + tg.count + '</b></font></td>' +
        '</tr>';
    }
    var tagPanel =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '"><table width="100%" border="0" cellpadding="10" cellspacing="0"><tr><td><font size="3" color="' + THEME.emerald + '"><b>高频题材标签 TOP 18</b></font></td><td align="right"><font size="1" color="' + THEME.textMuted + '">点击标签直达筛选</font></td></tr></table></td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="4" cellspacing="3">' + tagRows + '</table></td></tr>' +
      '</table>';

    // Hall of Fame (9-10 rated)
    var hof = [];
    for (i = 0; i < allItems.length; i++) {
      if (allItems[i].r >= 9) hof.push(allItems[i]);
    }
    hof.sort(function (a, b) {
      if (b.r !== a.r) return b.r - a.r;
      return (b.sc || 0) - (a.sc || 0);
    });

    var hofSection =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.amber + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td><font size="3" color="' + THEME.amber + '"><b>★ 个人 9–10 分高分殿堂 (' + hof.length + ' 部)</b></font></td>' +
            '<td align="right"><font size="1" color="' + THEME.textMuted + '">GuraNirei 最高评价动画与游戏</font></td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgDeep + '">' + renderGrid(hof, vw) + '</td></tr>' +
      '</table>';

    var midLayout = '';
    if (vw < 780) {
      midLayout = eraPanel + '<img src="assets/img/spacer.gif" width="1" height="12" border="0" alt=""><br>' + tagPanel;
    } else {
      midLayout =
        '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
          '<td width="49%" valign="top">' + eraPanel + '</td>' +
          '<td width="2%">' + spacerImg(12, 1) + '</td>' +
          '<td width="49%" valign="top">' + tagPanel + '</td>' +
        '</tr></table>';
    }

    return (
      histPanel +
      '<img src="assets/img/spacer.gif" width="1" height="12" border="0" alt=""><br>' +
      midLayout +
      '<img src="assets/img/spacer.gif" width="1" height="12" border="0" alt=""><br>' +
      hofSection
    );
  }

  function renderFooter() {
    if (window.SITE_COMMON && window.SITE_COMMON.renderSiteFooter) {
      return window.SITE_COMMON.renderSiteFooter();
    }
    return '';
  }

  function render() {
    var vw = getViewportWidth();
    var shell = document.getElementById('main-shell');
    if (shell) {
      shell.width = vw >= 1140 ? '1080' : '100%';
    }

    var selectedItem = state.selectedId ? findItemById(state.selectedId) : null;
    var dossierHtml = selectedItem ? renderDossier(selectedItem, vw) : '';

    var bodyHtml = '';
    if (state.mode === 'analytics') {
      bodyHtml = dossierHtml + renderAnalytics(vw);
    } else {
      var pool = getActivePool();
      var filtered = getFilteredItems();
      var pageItems = filtered;
      if (state.pageSize > 0) {
        var totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
        if (state.page > totalPages) state.page = totalPages;
        var start = (state.page - 1) * state.pageSize;
        pageItems = filtered.slice(start, start + state.pageSize);
      }
      var listHtml = state.view === 'table' ? renderTableView(pageItems) : renderGrid(pageItems, vw);
      bodyHtml =
        renderStatusAndControls(pool, filtered.length, vw) +
        '<img src="assets/img/spacer.gif" width="1" height="12" border="0" alt=""><br>' +
        dossierHtml +
        listHtml +
        renderPagination(filtered.length);
    }

    var fullHtml =
      renderMasthead(vw) +
      '<img src="assets/img/spacer.gif" width="1" height="10" border="0" alt=""><br>' +
      renderNavTabs(vw) +
      '<img src="assets/img/spacer.gif" width="1" height="10" border="0" alt=""><br>' +
      bodyHtml +
      renderFooter();

    var root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = fullHtml;
    }
  }

  // --- Backwards-Compatible XHR Live Sync with Bangumi API ---

  function createXhr() {
    if (typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e1) {}
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e2) {}
    return null;
  }

  function xhrGetJson(url, onSuccess, onError) {
    var xhr = createXhr();
    if (!xhr) {
      onError('浏览器不支持 XMLHttpRequest');
      return;
    }
    try {
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              var parsed = JSON.parse(xhr.responseText);
              onSuccess(parsed);
            } catch (parseErr) {
              onError('JSON 解析失败');
            }
          } else {
            onError('HTTP ' + xhr.status);
          }
        }
      };
      xhr.send(null);
    } catch (e) {
      onError('网络请求异常');
    }
  }

  function normalizeCollectionItem(x, subjectType) {
    var subj = x.subject || {};
    var imgs = subj.images || {};
    var rawTags = subj.tags || [];
    var userTags = x.tags || [];
    var merged = [];
    var i;
    for (i = 0; i < userTags.length; i++) {
      if (userTags[i] && !inArray(merged, userTags[i])) merged.push(userTags[i]);
    }
    for (i = 0; i < rawTags.length && merged.length < 8; i++) {
      var tn = rawTags[i] && rawTags[i].name;
      if (tn && !inArray(merged, tn)) merged.push(tn);
    }
    return {
      id: x.subject_id || subj.id || 0,
      st: subjectType,
      t: x.type || 0,
      r: x.rate || 0,
      c: x.comment || '',
      ep: x.ep_status || 0,
      u: (x.updated_at || '').slice(0, 10),
      ua: x.updated_at || '',
      n: subj.name || '',
      cn: subj.name_cn || '',
      d: subj.date || '',
      eps: subj.eps || 0,
      sc: subj.score || 0,
      rk: subj.rank || 0,
      ct: subj.collection_total || 0,
      img: imgs.common || imgs.medium || imgs.small || '',
      sum: trimStr(subj.short_summary || ''),
      tags: merged
    };
  }

  function fetchAllType(subjectType, label, onDone, onFail) {
    var items = [];
    var limit = 100;
    function fetchPage(offset) {
      var url = 'https://api.bgm.tv/v0/users/' + USER_ID + '/collections?subject_type=' + subjectType + '&limit=' + limit + '&offset=' + offset;
      xhrGetJson(
        url,
        function (res) {
          var batch = res.data || [];
          var total = res.total || 0;
          for (var i = 0; i < batch.length; i++) {
            items.push(normalizeCollectionItem(batch[i], subjectType));
          }
          state.syncMessage = '正在同步' + label + ' ' + items.length + '/' + total + '...';
          render();
          if (items.length < total && batch.length > 0) {
            fetchPage(offset + batch.length);
          } else {
            onDone(items);
          }
        },
        onFail
      );
    }
    fetchPage(0);
  }

  function formatNow() {
    var d = new Date();
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function syncFromBangumi(isAuto) {
    if (state.syncStatus === 'syncing') return;
    state.syncStatus = 'syncing';
    state.syncMessage = '正在连接 Bangumi API...';
    render();

    xhrGetJson(
      'https://api.bgm.tv/v0/users/' + USER_ID,
      function (userRes) {
        var av = userRes.avatar || {};
        var nextUser = {
          id: userRes.id || 993671,
          username: String(userRes.username || USER_ID),
          nickname: userRes.nickname || 'GuraNirei',
          sign: userRes.sign || '',
          url: userRes.url || ('https://bgm.tv/user/' + USER_ID),
          avatar: av.large || av.medium || av.small || dataStore.user.avatar
        };
        fetchAllType(
          2,
          '动画',
          function (animeList) {
            fetchAllType(
              4,
              '游戏',
              function (gameList) {
                var nowStr = formatNow();
                dataStore.user = nextUser;
                dataStore.anime = animeList;
                dataStore.game = gameList;
                dataStore.synced_at = nowStr;
                state.syncStatus = 'live';
                state.syncMessage = '实时同步完成 (' + nowStr + ')';
                try {
                  if (window.localStorage && typeof JSON !== 'undefined' && JSON.stringify) {
                    window.localStorage.setItem(CACHE_KEY, JSON.stringify(dataStore));
                  }
                } catch (e) {}
                render();
              },
              function (err) {
                state.syncStatus = isAuto ? 'snapshot' : 'error';
                state.syncMessage = isAuto ? '' : ('游戏同步失败: ' + err);
                render();
              }
            );
          },
          function (err) {
            state.syncStatus = isAuto ? 'snapshot' : 'error';
            state.syncMessage = isAuto ? '' : ('动画同步失败: ' + err);
            render();
          }
        );
      },
      function (err) {
        state.syncStatus = isAuto ? 'snapshot' : 'error';
        state.syncMessage = isAuto ? '' : ('连接 Bangumi 失败: ' + err);
        render();
      }
    );
  }

  function checkForRemoteUpdates() {
    if (typeof JSON === 'undefined' || !JSON.parse) return;
    // Lightweight 1-item check for anime and game
    xhrGetJson(
      'https://api.bgm.tv/v0/users/' + USER_ID + '/collections?subject_type=2&limit=1&offset=0',
      function (aRes) {
        var remoteAnimeTotal = aRes.total || 0;
        var remoteAnimeTop = (aRes.data && aRes.data[0] && aRes.data[0].updated_at) || '';
        var localAnimeTop = (dataStore.anime[0] && dataStore.anime[0].ua) || '';
        if (remoteAnimeTotal !== dataStore.anime.length || (remoteAnimeTop && remoteAnimeTop !== localAnimeTop)) {
          syncFromBangumi(true);
          return;
        }
        xhrGetJson(
          'https://api.bgm.tv/v0/users/' + USER_ID + '/collections?subject_type=4&limit=1&offset=0',
          function (gRes) {
            var remoteGameTotal = gRes.total || 0;
            var remoteGameTop = (gRes.data && gRes.data[0] && gRes.data[0].updated_at) || '';
            var localGameTop = (dataStore.game[0] && dataStore.game[0].ua) || '';
            if (remoteGameTotal !== dataStore.game.length || (remoteGameTop && remoteGameTop !== localGameTop)) {
              syncFromBangumi(true);
            } else {
              state.syncStatus = 'live';
              state.syncMessage = '已是最新数据 (快照 ' + (dataStore.synced_at || '') + ')';
              render();
            }
          },
          function () {}
        );
      },
      function () {}
    );
  }

  // --- Hash Routing & Actions ---

  function applyHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    if (!h) return;
    if (h === 'anime' || h === 'game' || h === 'all' || h === 'analytics') {
      state.mode = h;
      state.selectedId = 0;
      state.page = 1;
    } else if (h.indexOf('subject=') === 0) {
      var id = parseInt(h.slice(8), 10);
      if (!isNaN(id) && id > 0) {
        state.selectedId = id;
      }
    }
  }

  window.BGM_APP = {
    setMode: function (mode) {
      state.mode = mode;
      state.status = 0;
      state.tag = '';
      state.page = 1;
      state.selectedId = 0;
      try { window.location.hash = mode; } catch (e) {}
      render();
    },
    setStatus: function (st) {
      state.status = st;
      state.page = 1;
      render();
    },
    setRateFilter: function (val) {
      state.rateFilter = val;
      state.page = 1;
      render();
    },
    setSort: function (val) {
      state.sort = val;
      state.page = 1;
      render();
    },
    setPageSize: function (val) {
      state.pageSize = parseInt(val, 10) || 0;
      state.page = 1;
      render();
    },
    setView: function (v) {
      state.view = v;
      render();
    },
    setTag: function (tg) {
      state.tag = (state.tag === tg) ? '' : tg;
      state.page = 1;
      render();
    },
    setTagExact: function (tg) {
      state.tag = tg || '';
      state.page = 1;
      render();
    },
    jumpToTag: function (subjectType, tg) {
      if (subjectType === 4) state.mode = 'game';
      else if (subjectType === 2) state.mode = 'anime';
      else state.mode = 'all';
      state.status = 0;
      state.tag = tg;
      state.selectedId = 0;
      state.page = 1;
      render();
    },
    applySearch: function () {
      var el = document.getElementById('ctrl-query');
      state.query = el ? el.value : '';
      state.page = 1;
      render();
    },
    resetFilters: function () {
      state.status = 0;
      state.rateFilter = 'all';
      state.sort = 'updated';
      state.tag = '';
      state.query = '';
      state.page = 1;
      render();
    },
    setPage: function (p) {
      state.page = p;
      render();
      try { window.scrollTo(0, 0); } catch (e) {}
    },
    openDetail: function (id) {
      state.selectedId = id;
      try { window.location.hash = 'subject=' + id; } catch (e) {}
      render();
      try { window.scrollTo(0, 0); } catch (e) {}
    },
    closeDetail: function () {
      state.selectedId = 0;
      try { window.location.hash = state.mode; } catch (e) {}
      render();
    },
    syncNow: function () {
      syncFromBangumi(false);
    },
    randomPick: function () {
      var list = getFilteredItems();
      if (!list || list.length === 0) list = getActivePool();
      if (!list || list.length === 0) return;
      var idx = Math.floor(Math.random() * list.length);
      var picked = list[idx];
      if (picked && picked.id) {
        state.selectedId = picked.id;
        try { window.location.hash = 'subject=' + picked.id; } catch (e) {}
        render();
        try { window.scrollTo(0, 0); } catch (e) {}
      }
    },
    openExternal: function (url) {
      var u = safeUrl(url);
      if (!u) return;
      var win = window.open(u, '_blank');
      if (!win) {
        window.location.href = u;
      }
    },
    openSubjectBgm: function (id) {
      var url = 'https://bgm.tv/subject/' + id;
      var win = window.open(url, '_blank');
      if (!win) {
        window.location.href = url;
      }
    }
  };

  // --- Boot ---
  loadInitialData();
  applyHash();
  render();

  if (window.addEventListener) {
    window.addEventListener('resize', function () { render(); }, false);
    window.addEventListener('hashchange', function () { applyHash(); render(); }, false);
  } else if (window.attachEvent) {
    window.attachEvent('onresize', function () { render(); });
  }

  // Quiet background freshness check
  if (typeof setTimeout !== 'undefined') {
    setTimeout(checkForRemoteUpdates, 500);
  }
})();
