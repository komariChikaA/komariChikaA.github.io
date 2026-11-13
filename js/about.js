/* About & Timeline Controller (ES3/ES5, Zero CSS) */
(function () {
  var C = window.SITE_COMMON;
  var THEME = C.THEME;
  var SP = C.SPACER_SRC;

  function renderBioSection(vw) {
    var prof = window.CREATOR_DATA.profile;
    var isCompact = vw < 780;

    var bioText =
      '<font size="4" color="' + THEME.textMain + '"><b>' + C.escHtml(prof.displayName) + '</b></font><br>' +
      C.spacerImg(1, 6) + '<br>' +
      '<font size="2" color="' + THEME.pink + '"><b>' + C.escHtml(prof.tagline) + '</b></font><br>' +
      C.spacerImg(1, 8) + '<br>' +
      '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(prof.intro) + '</font><br>' +
      C.spacerImg(1, 10) + '<br>' +
      '<font size="2" color="' + THEME.textMain + '">平时既会大量补番、推 Galgame（Bangumi 累计收录 678 部作品），也喜欢自己动手把兴趣做成可运行的程序与作品——从零依赖纯原生 Web、Python 标准库联机后端，到 Godot/Storybrew 分镜渲染和校园插件开发。</font>';

    var gallerySide =
      '<table width="100%" border="0" cellpadding="0" cellspacing="4">' +
        '<tr>' +
          '<td width="50%" bgcolor="' + THEME.bgDeep + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html#project=yoru-mo-koi\')">' +
            '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr><td bgcolor="' + THEME.bgDeep + '">' +
              '<img src="assets/img/shot-mad-night.jpg" width="' + (isCompact ? '100%' : '168') + '" border="0" alt="MAD 背景"><br>' +
              '<table width="100%" border="0" cellpadding="4" cellspacing="0" bgcolor="' + THEME.bgAlt + '"><tr><td><font size="1" color="' + THEME.emerald + '">夜樱 MAD 分镜</font></td></tr></table>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="50%" bgcolor="' + THEME.bgDeep + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html#project=gal-yiba\')">' +
            '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr><td bgcolor="' + THEME.bgDeep + '">' +
              '<img src="assets/img/shot-galyiba.jpg" width="' + (isCompact ? '100%' : '168') + '" border="0" alt="旮一把"><br>' +
              '<table width="100%" border="0" cellpadding="4" cellspacing="0" bgcolor="' + THEME.bgAlt + '"><tr><td><font size="1" color="' + THEME.pink + '">《旮一把》实机</font></td></tr></table>' +
            '</td></tr></table>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td width="50%" bgcolor="' + THEME.bgDeep + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html#project=afternoon-program\')">' +
            '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr><td bgcolor="' + THEME.bgDeep + '">' +
              '<img src="assets/img/shot-afternoon.jpg" width="' + (isCompact ? '100%' : '168') + '" border="0" alt="下午的节目"><br>' +
              '<table width="100%" border="0" cellpadding="4" cellspacing="0" bgcolor="' + THEME.bgAlt + '"><tr><td><font size="1" color="' + THEME.amber + '">《下午的节目》</font></td></tr></table>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="50%" bgcolor="' + THEME.bgDeep + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html#project=draw2guess\')">' +
            '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr><td bgcolor="' + THEME.bgDeep + '">' +
              '<img src="assets/img/shot-draw2guess.jpg" width="' + (isCompact ? '100%' : '168') + '" border="0" alt="手绘涂鸦"><br>' +
              '<table width="100%" border="0" cellpadding="4" cellspacing="0" bgcolor="' + THEME.bgAlt + '"><tr><td><font size="1" color="' + THEME.blue + '">画猜联机涂鸦</font></td></tr></table>' +
            '</td></tr></table>' +
          '</td>' +
        '</tr>' +
      '</table>';

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td><img src="assets/img/px-spark.gif" width="14" height="14" border="0" align="absmiddle" alt=""> <font size="3" color="' + THEME.blue + '"><b>关于我 // WHO IS GURANIREI</b></font></td>' +
            '<td align="right"><font size="1" color="' + THEME.textMuted + '" face="Consolas, monospace">@komariChikaA · UID #993671</font></td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="16" cellspacing="0">' +
            (isCompact
              ? '<tr><td>' + bioText + '</td></tr><tr><td height="12">' + C.spacerImg(1, 12) + '</td></tr><tr><td>' + gallerySide + '</td></tr>'
              : '<tr><td valign="top">' + bioText + '</td><td width="16">' + C.spacerImg(16, 1) + '</td><td width="364" valign="middle">' + gallerySide + '</td></tr>') +
          '</table>' +
        '</td></tr>' +
      '</table>'
    );
  }

  function renderSkillsSection() {
    var skills = window.CREATOR_DATA.skills || [];
    var rows = '';
    for (var i = 0; i < skills.length; i++) {
      var sk = skills[i];
      var bg = (i % 2 === 0) ? THEME.bgCard : THEME.bgAlt;
      rows +=
        '<tr bgcolor="' + bg + '">' +
          '<td width="38%" valign="middle">' +
            '<table border="0" cellpadding="10" cellspacing="0"><tr><td>' +
              '<font size="2" color="' + THEME.textMain + '"><b>' + C.escHtml(sk.name) + '</b></font><br>' +
              '<font size="1" color="' + THEME.textMuted + '">' + C.escHtml(sk.note) + '</font>' +
            '</td></tr></table>' +
          '</td>' +
          '<td valign="middle">' +
            '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
              '<td>' + C.barHtml(sk.level, 10, sk.color, THEME.bgDeep) + '</td>' +
              '<td width="48" align="right"><font size="2" color="' + sk.color + '" face="Consolas, monospace"><b>' + sk.level + '%</b></font></td>' +
            '</tr></table>' +
          '</td>' +
        '</tr>';
    }

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '"><table border="0" cellpadding="10" cellspacing="0"><tr><td><img src="assets/img/px-code.gif" width="14" height="14" border="0" align="absmiddle" alt=""> <font size="3" color="' + THEME.emerald + '"><b>技术栈与创作方向 // TECH & CRAFT</b></font></td></tr></table></td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' + rows + '</table></td></tr>' +
      '</table>'
    );
  }

  function renderTimelineSection() {
    var tl = window.CREATOR_DATA.timeline || [];
    var rows = '';
    for (var i = 0; i < tl.length; i++) {
      var item = tl[i];
      var bg = (i % 2 === 0) ? THEME.bgCard : THEME.bgAlt;
      rows +=
        '<tr bgcolor="' + bg + '">' +
          '<td width="96" align="center" valign="top">' +
            '<table border="0" cellpadding="10" cellspacing="0"><tr><td align="center">' +
              C.badgeHtml(item.date, THEME.bgElevated, item.color, true) +
            '</td></tr></table>' +
          '</td>' +
          '<td valign="top">' +
            '<table border="0" cellpadding="10" cellspacing="0"><tr><td>' +
              '<font size="3" color="' + THEME.textMain + '"><b>' + C.escHtml(item.title) + '</b></font><br>' +
              C.spacerImg(1, 4) + '<br>' +
              '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(item.detail) + '</font>' +
            '</td></tr></table>' +
          '</td>' +
        '</tr>';
    }

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '"><table border="0" cellpadding="10" cellspacing="0"><tr><td><font size="3" color="' + THEME.amber + '"><b>2026 创作与开发时间线 // MILESTONES</b></font></td></tr></table></td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' + rows + '</table></td></tr>' +
      '</table>'
    );
  }

  function renderLinksDirectory(vw) {
    var links = [
      { title: 'GitHub 主页', sub: '@komariChikaA · 15 个公开仓库', url: 'https://github.com/komariChikaA', color: THEME.blue, btn: '访问 GitHub ↗' },
      { title: 'Bangumi 个人档案', sub: 'UID #993671 · 484 动画 / 194 游戏', url: 'https://bangumi.tv/user/993671', color: THEME.pink, btn: '访问 Bangumi ↗' },
      { title: '《下午的节目》在线试玩', sub: '实景摄影短篇恐怖视觉小说', url: 'https://komariChikaA.github.io/afternoon-program/', color: THEME.emerald, btn: '立即游玩 ↗' },
      { title: 'My Notes · MAD 笔记站', sub: 'Storybrew / 分镜制作与工程感想', url: 'https://komarichikaa.github.io/my-notes/', color: THEME.violet, btn: '阅读文章 ↗' }
    ];

    var cols = vw >= 720 ? 2 : 1;
    var html = '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
      '<tr><td bgcolor="' + THEME.bgElevated + '"><table border="0" cellpadding="10" cellspacing="0"><tr><td><img src="assets/img/px-heart.gif" width="14" height="14" border="0" align="absmiddle" alt=""> <font size="3" color="' + THEME.violet + '"><b>站点与在线阵地 // LINKS</b></font></td></tr></table></td></tr>' +
      '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="8" cellspacing="6">';

    for (var i = 0; i < links.length; i += cols) {
      html += '<tr>';
      for (var c = 0; c < cols; c++) {
        var lk = links[i + c];
        if (lk) {
          html +=
            '<td width="' + (cols === 2 ? '50%' : '100%') + '" bgcolor="' + THEME.bgElevated + '" valign="middle">' +
              '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
                '<td>' +
                  '<font size="2" color="' + lk.color + '"><b>' + C.escHtml(lk.title) + '</b></font><br>' +
                  '<font size="1" color="' + THEME.textMuted + '">' + C.escHtml(lk.sub) + '</font>' +
                '</td>' +
                '<td align="right">' +
                  C.pillButtonHtml(lk.btn, '#1E273B', lk.color, "window.SITE_COMMON.openExternal('" + C.escJsStr(lk.url) + "')", false) +
                '</td>' +
              '</tr></table>' +
            '</td>';
        }
      }
      html += '</tr>';
    }
    html += '</table></td></tr></table>';
    return html;
  }

  function render() {
    var vw = C.getViewportWidth();
    C.applyShellWidth(vw);
    var html =
      C.renderSiteHeader('about', vw) +
      '<img src="' + SP + '" width="1" height="10" border="0" alt=""><br>' +
      renderBioSection(vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderSkillsSection() +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderTimelineSection() +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderLinksDirectory(vw) +
      C.renderSiteFooter();

    var root = document.getElementById('app-root');
    if (root) root.innerHTML = html;
  }

  render();
  if (window.addEventListener) {
    window.addEventListener('resize', render, false);
  } else if (window.attachEvent) {
    window.attachEvent('onresize', render);
  }
})();
