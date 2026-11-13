/* Shared ES3/ES5 UI Chrome & Helpers (Zero CSS, Backwards-Compatible) */
(function () {
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
    if (s.indexOf('https://') === 0 || s.indexOf('http://') === 0) return s;
    return '';
  }

  function truncateStr(s, maxLen) {
    var str = trimStr(s);
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 1) + '…';
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

  function spacerImg(w, h) {
    return '<img src="spacer.gif" width="' + w + '" height="' + h + '" align="left" border="0" alt="">';
  }

  function barHtml(pct, heightPx, fillColor, trackColor) {
    var p = Math.round(pct);
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    var rest = 100 - p;
    var h = heightPx || 6;
    var html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + (trackColor || THEME.bgDeep) + '"><tr>';
    if (p > 0) html += '<td width="' + p + '%" height="' + h + '" bgcolor="' + fillColor + '">' + spacerImg(1, h) + '</td>';
    if (rest > 0) html += '<td width="' + rest + '%" height="' + h + '" bgcolor="' + (trackColor || THEME.bgDeep) + '">' + spacerImg(1, h) + '</td>';
    html += '</tr></table>';
    return html;
  }

  function badgeHtml(text, bg, fg, useMono) {
    var fontOpen = useMono
      ? '<font size="1" color="' + fg + '" face="Consolas, \'Courier New\', monospace">'
      : '<font size="1" color="' + fg + '">';
    return '<table border="0" cellpadding="2" cellspacing="0" bgcolor="' + bg + '"><tr><td>' + fontOpen + '<b>&nbsp;' + escHtml(text) + '&nbsp;</b></font></td></tr></table>';
  }

  function pillButtonHtml(label, bg, fg, onclickCode, useMono) {
    var fontOpen = useMono
      ? '<font size="1" color="' + fg + '" face="Consolas, \'Courier New\', monospace">'
      : '<font size="1" color="' + fg + '">';
    return (
      '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td bgcolor="' + bg + '" onclick="' + onclickCode + '">' +
          '<table border="0" cellpadding="4" cellspacing="0"><tr><td>' + fontOpen + '<b>&nbsp;' + escHtml(label) + '&nbsp;</b></font></td></tr></table>' +
        '</td>' +
      '</tr></table>'
    );
  }

  function openExternal(url) {
    var u = safeUrl(url);
    if (!u) return;
    var win = window.open(u, '_blank');
    if (!win) window.location.href = u;
  }

  function goPage(href) {
    window.location.href = href;
  }

  function renderSiteHeader(activePage, vw) {
    var isCompact = vw < 720;
    var bgmData = window.BGM_ARCHIVE_DATA || {};
    var user = bgmData.user || {};
    var avatar = user.avatar || 'https://lain.bgm.tv/pic/user/l/000/99/36/993671.jpg?r=1744245631&hd=1';
    var animeCount = (bgmData.anime && bgmData.anime.length) || 484;
    var gameCount = (bgmData.game && bgmData.game.length) || 194;
    var projCount = (window.CREATOR_DATA && window.CREATOR_DATA.projects && window.CREATOR_DATA.projects.length) || 12;

    var brandCell =
      '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td valign="middle" onclick="window.SITE_COMMON.goPage(\'index.html\')">' +
          '<table border="0" cellpadding="2" cellspacing="0" bgcolor="' + THEME.pink + '"><tr><td bgcolor="' + THEME.bgDeep + '">' +
            '<img src="' + escHtml(safeUrl(avatar)) + '" width="52" height="52" border="0" alt="GuraNirei">' +
          '</td></tr></table>' +
        '</td>' +
        '<td width="12">' + spacerImg(12, 1) + '</td>' +
        '<td valign="middle">' +
          '<font size="1" color="' + THEME.pink + '" face="Consolas, \'Courier New\', monospace"><b>GURANIREI // KOMARICHIKAA</b></font><br>' +
          '<font size="4" color="' + THEME.textMain + '"><b>GuraNirei 的个人空间与作品志</b></font><br>' +
          '<font size="1" color="' + THEME.textMuted + '">Galgame 工具 · MAD 分镜 · 联机应用 · Bangumi 收藏</font>' +
        '</td>' +
      '</tr></table>';

    var linksCell =
      '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td>' + pillButtonHtml('GitHub @komariChikaA ↗', '#1E273B', THEME.blue, "window.SITE_COMMON.openExternal('https://github.com/komariChikaA')", true) + '</td>' +
        '<td width="8">' + spacerImg(8, 1) + '</td>' +
        '<td>' + pillButtonHtml('Bangumi #993671 ↗', '#261821', THEME.pink, "window.SITE_COMMON.openExternal('https://bangumi.tv/user/993671')", true) + '</td>' +
      '</tr></table>';

    var topBar =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="12" cellspacing="0">' +
            (isCompact
              ? '<tr><td>' + brandCell + '</td></tr><tr><td height="8">' + spacerImg(1, 8) + '</td></tr><tr><td>' + linksCell + '</td></tr>'
              : '<tr><td valign="middle">' + brandCell + '</td><td align="right" valign="middle">' + linksCell + '</td></tr>') +
          '</table>' +
        '</td></tr>' +
      '</table>';

    var pages = [
      { id: 'home', href: 'index.html', label: '01 // 首页概览', sub: 'CREATOR HOME', color: THEME.violet },
      { id: 'projects', href: 'projects.html', label: '02 // 项目作品集 (' + projCount + ')', sub: 'WORKS & LABS', color: THEME.emerald },
      { id: 'bangumi', href: 'bangumi.html', label: '03 // 动画与游戏志 (' + (animeCount + gameCount) + ')', sub: 'BANGUMI LOG', color: THEME.pink },
      { id: 'about', href: 'about.html', label: '04 // 关于与历程', sub: 'STACK & TIMELINE', color: THEME.blue }
    ];

    var navHtml = '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr>';
    for (var i = 0; i < pages.length; i++) {
      var pg = pages[i];
      var isAct = activePage === pg.id;
      var cellBg = isAct ? pg.color : THEME.bgElevated;
      var textFg = isAct ? THEME.ink : THEME.textMain;
      var subFg = isAct ? THEME.ink : pg.color;

      navHtml +=
        '<td width="25%" bgcolor="' + cellBg + '" align="center" valign="middle" onclick="window.SITE_COMMON.goPage(\'' + pg.href + '\')">' +
          '<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
            '<tr><td height="3" bgcolor="' + pg.color + '">' + spacerImg(1, 3) + '</td></tr>' +
            '<tr><td align="center">' +
              '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
                '<font size="' + (vw < 560 ? '1' : '2') + '" color="' + textFg + '"><b>' + escHtml(pg.label) + '</b></font><br>' +
                '<font size="1" color="' + subFg + '" face="Consolas, \'Courier New\', monospace">' + escHtml(pg.sub) + '</font>' +
              '</td></tr></table>' +
            '</td></tr>' +
          '</table>' +
        '</td>';
    }
    navHtml += '</tr></table>';

    return topBar + '<img src="spacer.gif" width="1" height="8" border="0" alt=""><br>' + navHtml;
  }

  function renderSiteFooter() {
    return (
      '<img src="spacer.gif" width="1" height="16" border="0" alt=""><br>' +
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="12" cellspacing="0"><tr>' +
            '<td>' +
              '<font size="1" color="' + THEME.textMuted + '">' +
                'GuraNirei (@komariChikaA) · ' +
                '<span onclick="window.SITE_COMMON.goPage(\'index.html\')"><font color="' + THEME.violet + '"><b>首页</b></font></span> · ' +
                '<span onclick="window.SITE_COMMON.goPage(\'projects.html\')"><font color="' + THEME.emerald + '"><b>项目</b></font></span> · ' +
                '<span onclick="window.SITE_COMMON.goPage(\'bangumi.html\')"><font color="' + THEME.pink + '"><b>Bangumi</b></font></span> · ' +
                '<span onclick="window.SITE_COMMON.goPage(\'about.html\')"><font color="' + THEME.blue + '"><b>关于</b></font></span>' +
              '</font>' +
            '</td>' +
            '<td align="right">' +
              '<font size="1" color="' + THEME.textDim + '" face="Consolas, \'Courier New\', monospace">PURE HTML + ES5 JS · ZERO CSS · MULTI-PAGE ARCHIVE</font>' +
            '</td>' +
          '</tr></table>' +
        '</td></tr>' +
      '</table>'
    );
  }

  function applyShellWidth(vw) {
    var shell = document.getElementById('main-shell');
    if (shell) {
      shell.width = vw >= 1140 ? '1080' : '100%';
    }
  }

  window.SITE_COMMON = {
    THEME: THEME,
    trimStr: trimStr,
    escHtml: escHtml,
    escJsStr: escJsStr,
    safeUrl: safeUrl,
    truncateStr: truncateStr,
    inArray: inArray,
    getViewportWidth: getViewportWidth,
    getGridCols: getGridCols,
    spacerImg: spacerImg,
    barHtml: barHtml,
    badgeHtml: badgeHtml,
    pillButtonHtml: pillButtonHtml,
    openExternal: openExternal,
    goPage: goPage,
    applyShellWidth: applyShellWidth,
    renderSiteHeader: renderSiteHeader,
    renderSiteFooter: renderSiteFooter
  };
})();
