/* Home Page Controller (ES3/ES5, Zero CSS) */
(function () {
  var C = window.SITE_COMMON;
  var THEME = C.THEME;
  var SP = C.SPACER_SRC;

  // Backwards compatibility for old bangumi hashes on index.html
  var h = (window.location.hash || '').replace(/^#/, '');
  if (h === 'anime' || h === 'game' || h === 'all' || h === 'analytics' || h.indexOf('subject=') === 0) {
    window.location.replace('bangumi.html#' + h);
    return;
  }

  function countTopRated(items) {
    var cnt = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].r >= 9) cnt++;
    }
    return cnt;
  }

  function pxIcon(name) {
    return '<img src="assets/img/' + name + '" width="14" height="14" border="0" align="absmiddle" alt="">';
  }

  function renderCreatorHero(vw) {
    var prof = window.CREATOR_DATA.profile;
    var bgm = window.BGM_ARCHIVE_DATA || { anime: [], game: [] };
    var animeCnt = bgm.anime ? bgm.anime.length : 0;
    var gameCnt = bgm.game ? bgm.game.length : 0;
    var projCnt = window.CREATOR_DATA.projects ? window.CREATOR_DATA.projects.length : 0;
    var topCnt = countTopRated(bgm.anime || []) + countTopRated(bgm.game || []);
    var isCompact = vw < 800;

    var introSide =
      pxIcon('px-spark.gif') + ' <font size="1" color="' + THEME.violet + '" face="Consolas, \'Courier New\', monospace"><b>CREATOR PROFILE // GURANIREI</b></font><br>' +
      C.spacerImg(1, 6) + '<br>' +
      '<font size="6" color="' + THEME.textMain + '"><b>' + C.escHtml(prof.displayName) + '</b></font><br>' +
      C.spacerImg(1, 4) + '<br>' +
      '<font size="2" color="' + THEME.pink + '"><b>' + C.escHtml(prof.tagline) + '</b></font><br>' +
      C.spacerImg(1, 8) + '<br>' +
      '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(prof.intro) + '</font><br>' +
      C.spacerImg(1, 14) + '<br>' +
      '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td>' + C.pillButtonHtml('查看全部项目 (' + projCnt + ') →', THEME.emerald, THEME.ink, "window.SITE_COMMON.goPage('projects.html')", false) + '</td>' +
        '<td width="8">' + C.spacerImg(8, 1) + '</td>' +
        '<td>' + C.pillButtonHtml('进入 Bangumi 志 →', THEME.pink, THEME.ink, "window.SITE_COMMON.goPage('bangumi.html')", false) + '</td>' +
        '<td width="8">' + C.spacerImg(8, 1) + '</td>' +
        '<td>' + C.pillButtonHtml('试玩《下午的节目》↗', '#1E273B', THEME.cyan, "window.SITE_COMMON.openExternal('https://komariChikaA.github.io/afternoon-program/')", false) + '</td>' +
      '</tr></table>' +
      C.spacerImg(1, 14) + '<br>' +
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html\')">' +
            '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
              '<font size="4" color="' + THEME.emerald + '" face="Consolas, monospace"><b>' + projCnt + '</b></font><br>' +
              '<font size="1" color="' + THEME.textMuted + '">原创项目</font>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center" onclick="window.SITE_COMMON.goPage(\'bangumi.html#anime\')">' +
            '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
              '<font size="4" color="' + THEME.pink + '" face="Consolas, monospace"><b>' + animeCnt + '</b></font><br>' +
              '<font size="1" color="' + THEME.textMuted + '">动画收录</font>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center" onclick="window.SITE_COMMON.goPage(\'bangumi.html#game\')">' +
            '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
              '<font size="4" color="' + THEME.blue + '" face="Consolas, monospace"><b>' + gameCnt + '</b></font><br>' +
              '<font size="1" color="' + THEME.textMuted + '">游戏收录</font>' +
            '</td></tr></table>' +
          '</td>' +
          '<td width="25%" bgcolor="' + THEME.bgElevated + '" align="center" onclick="window.SITE_COMMON.goPage(\'bangumi.html#analytics\')">' +
            '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
              '<font size="4" color="' + THEME.amber + '" face="Consolas, monospace"><b>' + topCnt + '</b></font><br>' +
              '<font size="1" color="' + THEME.textMuted + '">9分+殿堂</font>' +
            '</td></tr></table>' +
          '</td>' +
        '</tr>' +
      '</table>';

    var shotW = isCompact ? 0 : 356;
    var shotH = isCompact ? 0 : 200;
    var visualSide =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.borderStrong + '">' +
        '<tr><td bgcolor="' + THEME.bgDeep + '" align="center" onclick="window.SITE_COMMON.goPage(\'projects.html#project=gal-yiba\')">' +
          (shotW > 0
            ? '<img src="' + C.escHtml(prof.heroImage) + '" width="' + shotW + '" height="' + shotH + '" border="0" alt="实机截图">'
            : '<img src="' + C.escHtml(prof.heroImage) + '" width="100%" border="0" alt="实机截图">') +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgAlt + '">' +
          '<table width="100%" border="0" cellpadding="6" cellspacing="0"><tr>' +
            '<td>' + pxIcon('px-code.gif') + ' <font size="1" color="' + THEME.cyan + '" face="Consolas, monospace"><b>PREVIEW // 实机截图</b></font></td>' +
            '<td align="right"><font size="1" color="' + THEME.textMuted + '">' + C.escHtml(prof.heroCaption || '实机画面') + '</font></td>' +
          '</tr></table>' +
        '</td></tr>' +
      '</table>';

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="16" cellspacing="0">' +
            (isCompact
              ? '<tr><td>' + introSide + '</td></tr><tr><td height="14">' + C.spacerImg(1, 14) + '</td></tr><tr><td>' + visualSide + '</td></tr>'
              : '<tr><td valign="top">' + introSide + '</td><td width="18">' + C.spacerImg(18, 1) + '</td><td width="360" valign="middle">' + visualSide + '</td></tr>') +
          '</table>' +
        '</td></tr>' +
      '</table>'
    );
  }

  function renderCoverSlot(imgPath, accentColor, w, h, fallbackLabel, fallbackSub, onclickCode) {
    var inner;
    if (imgPath) {
      inner = w > 0
        ? '<img src="' + C.escHtml(imgPath) + '" width="' + w + '" height="' + h + '" border="0" alt="">'
        : '<img src="' + C.escHtml(imgPath) + '" width="100%" border="0" alt="">';
    } else {
      inner =
        '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0F1420">' +
          '<tr><td height="' + (h || 180) + '" align="center" valign="middle">' +
            '<font size="2" color="' + accentColor + '" face="Consolas, monospace"><b>' + C.escHtml(fallbackLabel || 'PROJECT') + '</b></font><br>' +
            '<font size="1" color="' + THEME.textDim + '">' + C.escHtml(fallbackSub || '') + '</font>' +
          '</td></tr>' +
        '</table>';
    }
    return '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + THEME.bgDeep + '"><tr><td align="center" valign="middle"' + (onclickCode ? ' onclick="' + onclickCode + '"' : '') + '>' + inner + '</td></tr></table>';
  }

  function renderPillars(vw) {
    var pillars = window.CREATOR_DATA.pillars || [];
    var cols = C.getGridCols(vw);
    var isFixed = (cols === 3 && vw >= 1140);
    var contentW = isFixed ? 350 : 0;
    var gutterW = 12;
    var imgW = isFixed ? 350 : 0;
    var imgH = isFixed ? 197 : 180;

    if (cols !== 3) {
      var stacked = '';
      for (var s = 0; s < pillars.length; s++) {
        var pl = pillars[s];
        stacked +=
          (s > 0 ? '<img src="' + SP + '" width="1" height="10" border="0" alt=""><br>' : '') +
          '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
            '<tr><td bgcolor="' + THEME.bgCard + '">' +
              '<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
                '<tr><td height="3" bgcolor="' + pl.color + '">' + C.spacerImg(1, 3) + '</td></tr>' +
                '<tr><td bgcolor="' + THEME.bgDeep + '">' + renderCoverSlot(pl.image, pl.color, 0, 180, pl.tag, pl.title, "window.SITE_COMMON.goPage('" + pl.targetPage + "')") + '</td></tr>' +
                '<tr><td><table width="100%" border="0" cellpadding="12" cellspacing="0"><tr><td>' +
                  '<font size="1" color="' + pl.color + '" face="Consolas, monospace"><b>' + C.escHtml(pl.tag) + '</b></font><br>' +
                  '<font size="3" color="' + THEME.textMain + '"><b>' + C.escHtml(pl.title) + '</b></font><br>' +
                  C.spacerImg(1, 6) + '<br>' +
                  '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(pl.desc) + '</font><br>' +
                  C.spacerImg(1, 10) + '<br>' +
                  C.pillButtonHtml(pl.actionLabel + ' →', '#1E273B', pl.color, "window.SITE_COMMON.goPage('" + pl.targetPage + "')", false) +
                '</td></tr></table></td></tr>' +
              '</table>' +
            '</td></tr>' +
          '</table>';
      }
      return stacked;
    }

    var wAttr = contentW > 0 ? (' width="' + contentW + '"') : '';
    var html = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
    html += '<tr>';
    for (var i = 0; i < 3; i++) {
      if (i > 0) html += '<td width="' + gutterW + '">' + C.spacerImg(gutterW, 1) + '</td>';
      html += '<td width="1">' + C.spacerImg(1, 1) + '</td><td' + wAttr + '>' + C.spacerImg(contentW || 1, 1) + '</td><td width="1">' + C.spacerImg(1, 1) + '</td>';
    }
    html += '</tr><tr>';
    for (i = 0; i < 3; i++) {
      if (i > 0) html += '<td></td>';
      html += '<td colspan="3" height="3" bgcolor="' + pillars[i].color + '">' + C.spacerImg(1, 3) + '</td>';
    }
    html += '</tr><tr>';
    for (i = 0; i < 3; i++) {
      if (i > 0) html += '<td></td>';
      var pi = pillars[i];
      html +=
        '<td width="1" bgcolor="' + THEME.border + '"></td>' +
        '<td' + wAttr + ' bgcolor="' + THEME.bgDeep + '" valign="middle">' +
          renderCoverSlot(pi.image, pi.color, imgW, imgH, pi.tag, pi.title, "window.SITE_COMMON.goPage('" + pi.targetPage + "')") +
        '</td>' +
        '<td width="1" bgcolor="' + THEME.border + '"></td>';
    }
    html += '</tr><tr>';
    for (i = 0; i < 3; i++) {
      if (i > 0) html += '<td></td>';
      var p = pillars[i];
      html +=
        '<td width="1" bgcolor="' + THEME.border + '"></td>' +
        '<td' + wAttr + ' bgcolor="' + THEME.bgCard + '" valign="top">' +
          '<table width="100%" border="0" cellpadding="12" cellspacing="0"><tr><td>' +
            '<font size="1" color="' + p.color + '" face="Consolas, monospace"><b>' + C.escHtml(p.tag) + '</b></font><br>' +
            C.spacerImg(1, 4) + '<br>' +
            '<font size="3" color="' + THEME.textMain + '"><b>' + C.escHtml(p.title) + '</b></font><br>' +
            C.spacerImg(1, 6) + '<br>' +
            '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(p.desc) + '</font>' +
          '</td></tr></table>' +
        '</td>' +
        '<td width="1" bgcolor="' + THEME.border + '"></td>';
    }
    html += '</tr><tr>';
    for (i = 0; i < 3; i++) {
      if (i > 0) html += '<td></td>';
      var p2 = pillars[i];
      html +=
        '<td width="1" bgcolor="' + THEME.border + '"></td>' +
        '<td' + wAttr + ' bgcolor="' + THEME.bgAlt + '" valign="middle">' +
          '<table width="100%" border="0" cellpadding="8" cellspacing="0"><tr><td align="left">' +
            C.pillButtonHtml(p2.actionLabel + ' →', '#1E273B', p2.color, "window.SITE_COMMON.goPage('" + p2.targetPage + "')", false) +
          '</td></tr></table>' +
        '</td>' +
        '<td width="1" bgcolor="' + THEME.border + '"></td>';
    }
    html += '</tr><tr>';
    for (i = 0; i < 3; i++) {
      if (i > 0) html += '<td></td>';
      html += '<td colspan="3" height="1" bgcolor="' + THEME.border + '">' + C.spacerImg(1, 1) + '</td>';
    }
    html += '</tr></table>';
    return html;
  }

  function getCatColor(cat) {
    if (cat === 'acg') return THEME.pink;
    if (cat === 'mad') return THEME.emerald;
    if (cat === 'tools') return THEME.blue;
    return THEME.amber;
  }

  function renderFeaturedProjects(vw) {
    var all = window.CREATOR_DATA.projects || [];
    var featured = [];
    var i;
    for (i = 0; i < all.length; i++) {
      if (all[i].featured) featured.push(all[i]);
    }
    var cols = C.getGridCols(vw);
    var isFixed = (cols === 3 && vw >= 1140);
    var contentW = isFixed ? 350 : 0;
    var gutterW = 12;
    var imgW = isFixed ? 350 : 0;
    var imgH = isFixed ? 197 : 180;
    var wAttr = contentW > 0 ? (' width="' + contentW + '"') : '';
    var totalCols = cols * 3 + (cols - 1);

    var sectionHeader =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td>' + pxIcon('px-code.gif') + ' <font size="3" color="' + THEME.emerald + '"><b>精选原创项目展示</b></font> <font size="1" color="' + THEME.textMuted + '">FEATURED CREATIONS</font></td>' +
            '<td align="right">' + C.pillButtonHtml('查看全部 ' + all.length + ' 个项目 →', '#1E273B', THEME.emerald, "window.SITE_COMMON.goPage('projects.html')", false) + '</td>' +
          '</tr></table>' +
        '</td></tr>' +
      '</table><img src="' + SP + '" width="1" height="10" border="0" alt=""><br>';

    var html = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
    html += '<tr>';
    for (var c = 0; c < cols; c++) {
      if (c > 0) html += '<td width="' + gutterW + '">' + C.spacerImg(gutterW, 1) + '</td>';
      if (isFixed) {
        html += '<td width="1">' + C.spacerImg(1, 1) + '</td><td width="' + contentW + '">' + C.spacerImg(contentW, 1) + '</td><td width="1">' + C.spacerImg(1, 1) + '</td>';
      } else {
        var pctW = cols === 2 ? '49%' : '100%';
        html += '<td width="1">' + C.spacerImg(1, 1) + '</td><td width="' + pctW + '">' + C.spacerImg(1, 1) + '</td><td width="1">' + C.spacerImg(1, 1) + '</td>';
      }
    }
    html += '</tr>';

    for (i = 0; i < featured.length; i += cols) {
      if (i > 0) html += '<tr><td colspan="' + totalCols + '" height="12">' + C.spacerImg(1, 12) + '</td></tr>';
      var row = [];
      for (c = 0; c < cols; c++) {
        row.push(i + c < featured.length ? featured[i + c] : null);
      }

      // 1. Top accent bar
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (row[c]) {
          html += '<td colspan="3" height="3" bgcolor="' + getCatColor(row[c].category) + '">' + C.spacerImg(1, 3) + '</td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 2. Card Visual Cover Strip
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pm = row[c];
        if (pm) {
          var mc0 = getCatColor(pm.category);
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgDeep + '" valign="middle">' +
              renderCoverSlot(pm.image, mc0, imgW, imgH, pm.lang, pm.name, "window.SITE_COMMON.goPage('projects.html#project=" + pm.id + "')") +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 3. Header row
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pr = row[c];
        if (pr) {
          var cc = getCatColor(pr.category);
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgCard + '" valign="middle">' +
              '<table width="100%" border="0" cellpadding="8" cellspacing="0"><tr>' +
                '<td align="left">' + C.badgeHtml(pr.categoryLabel, THEME.bgElevated, cc, false) + '</td>' +
                '<td align="right">' + C.badgeHtml(pr.lang + (pr.stars > 0 ? (' · ★' + pr.stars) : ''), THEME.bgAlt, THEME.textMuted, true) + '</td>' +
              '</tr></table>' +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 4. Body row (uniform height across row)
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pb = row[c];
        if (pb) {
          var tgHtml = '<table border="0" cellpadding="1" cellspacing="2"><tr>';
          for (var t = 0; t < Math.min(3, pb.tags.length); t++) {
            tgHtml += '<td bgcolor="' + THEME.bgElevated + '"><font size="1" color="' + THEME.textMuted + '">&nbsp;' + C.escHtml(pb.tags[t]) + '&nbsp;</font></td>';
          }
          tgHtml += '</tr></table>';

          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgCard + '" valign="top">' +
              '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr><td>' +
                '<span onclick="window.SITE_COMMON.goPage(\'projects.html#project=' + pb.id + '\')"><font size="3" color="' + THEME.textMain + '"><b>' + C.escHtml(pb.name) + '</b></font></span><br>' +
                C.spacerImg(1, 6) + '<br>' +
                '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(C.truncateStr(pb.summary, 64)) + '</font><br>' +
                C.spacerImg(1, 8) + '<br>' +
                tgHtml +
              '</td></tr></table>' +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 5. Footer row
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pf = row[c];
        if (pf) {
          var ccf = getCatColor(pf.category);
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgAlt + '" valign="middle">' +
              '<table width="100%" border="0" cellpadding="6" cellspacing="0"><tr>' +
                '<td><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">' + C.escHtml(pf.updated) + '</font></td>' +
                '<td align="right">' +
                  '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
                    '<td bgcolor="#1E273B" onclick="window.SITE_COMMON.goPage(\'projects.html#project=' + pf.id + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + ccf + '"><b>&nbsp;详情&nbsp;</b></font></td></tr></table></td>' +
                    (pf.liveUrl ? '<td width="6">' + C.spacerImg(6, 1) + '</td><td bgcolor="#132A24" onclick="window.SITE_COMMON.openExternal(\'' + C.escJsStr(pf.liveUrl) + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + THEME.emerald + '"><b>&nbsp;体验 ↗&nbsp;</b></font></td></tr></table></td>' : '') +
                    '<td width="6">' + C.spacerImg(6, 1) + '</td>' +
                    '<td bgcolor="#1B2233" onclick="window.SITE_COMMON.openExternal(\'' + C.escJsStr(pf.repoUrl) + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + THEME.textMuted + '"><b>&nbsp;GitHub ↗&nbsp;</b></font></td></tr></table></td>' +
                  '</tr></table>' +
                '</td>' +
              '</tr></table>' +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 6. Bottom border
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (row[c]) {
          html += '<td colspan="3" height="1" bgcolor="' + THEME.border + '">' + C.spacerImg(1, 1) + '</td>';
        } else {
          html += '<td colspan="3" height="1"></td>';
        }
      }
      html += '</tr>';
    }
    html += '</table>';
    return sectionHeader + html;
  }

  function renderPosterWall(vw) {
    var bgm = window.BGM_ARCHIVE_DATA || { anime: [], game: [] };
    var combined = (bgm.anime || []).concat(bgm.game || []);
    var picks = [];
    for (var i = 0; i < combined.length; i++) {
      if (combined[i].r >= 9 && combined[i].img) picks.push(combined[i]);
    }
    picks.sort(function (a, b) {
      if (b.r !== a.r) return b.r - a.r;
      return (b.sc || 0) - (a.sc || 0);
    });
    var showCount = vw >= 980 ? 6 : (vw >= 640 ? 4 : 3);
    var topPicks = picks.slice(0, showCount);
    if (topPicks.length === 0) return '';

    var cells = '';
    for (i = 0; i < topPicks.length; i++) {
      var it = topPicks[i];
      var tCol = it.st === 4 ? THEME.blue : THEME.pink;
      var title = C.truncateStr(it.cn || it.n || ('#' + it.id), 10);
      var imgCellH = vw >= 980 ? 182 : 140;
      var imgWAttr = vw >= 980 ? 124 : 94;
      cells +=
        '<td width="' + Math.floor(100 / topPicks.length) + '%" bgcolor="' + THEME.bgAlt + '" align="center" valign="top" onclick="window.SITE_COMMON.goPage(\'bangumi.html#subject=' + it.id + '\')">' +
          '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td height="3" bgcolor="' + tCol + '">' + C.spacerImg(1, 3) + '</td></tr></table>' +
          '<table width="100%" border="0" cellpadding="8" cellspacing="0">' +
            '<tr><td height="' + imgCellH + '" align="center" valign="middle" bgcolor="' + THEME.bgDeep + '"><img src="' + C.escHtml(C.safeUrl(it.img)) + '" width="' + imgWAttr + '" border="0" alt=""></td></tr>' +
            '<tr><td align="center" valign="top">' +
              C.badgeHtml('★ ' + it.r + ' · ' + (it.st === 4 ? 'GAME' : 'ANIME'), '#2C2312', THEME.amber, true) + '<br>' +
              C.spacerImg(1, 4) + '<br>' +
              '<font size="1" color="' + THEME.textMain + '"><b>' + C.escHtml(title) + '</b></font>' +
            '</td></tr>' +
          '</table>' +
        '</td>';
    }

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td>' + pxIcon('px-heart.gif') + ' <font size="3" color="' + THEME.amber + '"><b>高分殿堂海报墙</b></font> <font size="1" color="' + THEME.textMuted + '">HALL OF FAME POSTERS (9–10★)</font></td>' +
            '<td align="right">' + C.pillButtonHtml('进入高分殿堂 →', '#1E273B', THEME.amber, "window.SITE_COMMON.goPage('bangumi.html#analytics')", false) + '</td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="0" cellspacing="6"><tr>' + cells + '</tr></table></td></tr>' +
      '</table>'
    );
  }

  function renderBangumiPreviewList(title, color, items, targetHash) {
    var top4 = (items || []).slice(0, 4);
    var rows = '';
    for (var i = 0; i < top4.length; i++) {
      var it = top4[i];
      var bg = (i % 2 === 0) ? THEME.bgCard : THEME.bgAlt;
      var name = C.truncateStr(it.cn || it.n || ('#' + it.id), 22);
      var rateTxt = it.r > 0 ? ('★ ' + it.r) : '未评';
      var rateBg = it.r >= 9 ? THEME.amber : (it.r >= 8 ? THEME.pink : (it.r >= 7 ? THEME.blue : THEME.bgElevated));
      var rateFg = it.r >= 7 ? THEME.ink : THEME.textMuted;
      rows +=
        '<tr bgcolor="' + bg + '" onclick="window.SITE_COMMON.goPage(\'bangumi.html#subject=' + it.id + '\')">' +
          '<td width="46" align="center" valign="middle">' +
            '<table border="0" cellpadding="4" cellspacing="0"><tr><td>' +
              (it.img ? '<img src="' + C.escHtml(C.safeUrl(it.img)) + '" width="36" border="0" alt="">' : '-') +
            '</td></tr></table>' +
          '</td>' +
          '<td valign="middle">' +
            '<font size="2" color="' + THEME.textMain + '"><b>' + C.escHtml(name) + '</b></font><br>' +
            '<font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">' + C.escHtml(it.u || '-') + (it.c ? (' · 💬 ' + C.escHtml(C.truncateStr(it.c, 18))) : '') + '</font>' +
          '</td>' +
          '<td width="56" align="right" valign="middle">' +
            '<table border="0" cellpadding="4" cellspacing="0"><tr><td>' + C.badgeHtml(rateTxt, rateBg, rateFg, true) + '</td></tr></table>' +
          '</td>' +
        '</tr>';
    }

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td><font size="3" color="' + color + '"><b>' + C.escHtml(title) + '</b></font></td>' +
            '<td align="right">' + C.pillButtonHtml('查看全部 →', '#1E273B', color, "window.SITE_COMMON.goPage('bangumi.html" + targetHash + "')", false) + '</td>' +
          '</tr></table>' +
        '</td></tr>' +
        '<tr><td bgcolor="' + THEME.bgCard + '"><table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="' + THEME.border + '">' + rows + '</table></td></tr>' +
      '</table>'
    );
  }

  function renderBangumiDigest(vw) {
    var bgm = window.BGM_ARCHIVE_DATA || { anime: [], game: [] };
    var animeBox = renderBangumiPreviewList('近期动画记录 (' + bgm.anime.length + ')', THEME.pink, bgm.anime, '#anime');
    var gameBox = renderBangumiPreviewList('近期游戏记录 (' + bgm.game.length + ')', THEME.blue, bgm.game, '#game');

    if (vw < 780) {
      return animeBox + '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' + gameBox;
    }
    return (
      '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
        '<td width="49%" valign="top">' + animeBox + '</td>' +
        '<td width="2%">' + C.spacerImg(12, 1) + '</td>' +
        '<td width="49%" valign="top">' + gameBox + '</td>' +
      '</tr></table>'
    );
  }

  function render() {
    var vw = C.getViewportWidth();
    C.applyShellWidth(vw);
    var html =
      C.renderSiteHeader('home', vw) +
      '<img src="' + SP + '" width="1" height="10" border="0" alt=""><br>' +
      renderCreatorHero(vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderPillars(vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderFeaturedProjects(vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderPosterWall(vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderBangumiDigest(vw) +
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
