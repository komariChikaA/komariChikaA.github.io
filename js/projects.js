/* Projects Showcase Controller (ES3/ES5, Zero CSS) */
(function () {
  var C = window.SITE_COMMON;
  var THEME = C.THEME;
  var SP = C.SPACER_SRC;

  var state = {
    cat: 'all',
    query: '',
    selectedId: ''
  };

  function getCatMeta(cat) {
    if (cat === 'acg') return { label: 'ACG · 游戏', color: THEME.pink };
    if (cat === 'mad') return { label: 'MAD · 音画', color: THEME.emerald };
    if (cat === 'tools') return { label: '联机 · 工具', color: THEME.blue };
    if (cat === 'systems') return { label: '硬件 · 课程', color: THEME.amber };
    return { label: '全部项目', color: THEME.emerald };
  }

  function findProject(id) {
    var list = window.CREATOR_DATA.projects || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function countByCat(cat) {
    var list = window.CREATOR_DATA.projects || [];
    if (cat === 'all') return list.length;
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].category === cat) n++;
    }
    return n;
  }

  function getFilteredProjects() {
    var list = window.CREATOR_DATA.projects || [];
    var q = C.trimStr(state.query).toLowerCase();
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (state.cat !== 'all' && p.category !== state.cat) continue;
      if (q) {
        var hay = (p.name + ' ' + p.summary + ' ' + p.lang + ' ' + p.tags.join(' ') + ' ' + p.highlights.join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) continue;
      }
      out.push(p);
    }
    return out;
  }

  function renderFilterBar(filteredCount, vw) {
    var cats = [
      { id: 'all', label: '全部项目', color: THEME.emerald },
      { id: 'acg', label: 'ACG · 游戏', color: THEME.pink },
      { id: 'mad', label: 'MAD · 音画', color: THEME.emerald },
      { id: 'tools', label: '联机 · 工具', color: THEME.blue },
      { id: 'systems', label: '硬件 · 课程', color: THEME.amber }
    ];

    var catTabs = '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr>';
    for (var i = 0; i < cats.length; i++) {
      var ct = cats[i];
      var act = state.cat === ct.id;
      var cnt = countByCat(ct.id);
      catTabs +=
        '<td width="20%" bgcolor="' + (act ? ct.color : THEME.bgCard) + '" align="center" onclick="window.PROJECTS_APP.setCat(\'' + ct.id + '\')">' +
          '<table border="0" cellpadding="8" cellspacing="0"><tr><td align="center">' +
            '<font size="2" color="' + (act ? THEME.ink : THEME.textMain) + '"><b>' + C.escHtml(ct.label) + '</b></font> ' +
            '<font size="1" color="' + (act ? THEME.ink : ct.color) + '" face="Consolas, monospace">(' + cnt + ')</font>' +
          '</td></tr></table>' +
        '</td>';
    }
    catTabs += '</tr></table>';

    var searchBar =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
        '<tr><td bgcolor="' + THEME.bgElevated + '">' +
          '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
            '<td>' +
              '<form onsubmit="window.PROJECTS_APP.applySearch(); return false;">' +
                '<img src="assets/img/px-code.gif" width="14" height="14" border="0" align="absmiddle" alt=""> ' +
                '<font size="2" color="' + THEME.textMuted + '"><b>检索项目:</b></font> ' +
                '<input type="text" id="proj-query" size="' + (vw < 640 ? '16' : '28') + '" value="' + C.escHtml(state.query) + '" placeholder="名称 / 技术栈 / 关键词"> ' +
                '<button type="submit">搜索</button> ' +
                '<button type="button" onclick="window.PROJECTS_APP.reset()">重置</button>' +
              '</form>' +
            '</td>' +
            '<td align="right">' +
              '<font size="1" color="' + THEME.textMuted + '">展示 <font color="' + THEME.emerald + '" face="Consolas, monospace"><b>' + filteredCount + '</b></font> 个项目 · 点击封面或标题查看档案</font>' +
            '</td>' +
          '</tr></table>' +
        '</td></tr>' +
      '</table>';

    return catTabs + '<img src="' + SP + '" width="1" height="10" border="0" alt=""><br>' + searchBar;
  }

  function renderProjectCoverCell(p, w, h, onclickCode) {
    var meta = getCatMeta(p.category);
    var inner;
    if (p.image) {
      inner = w > 0
        ? '<img src="' + C.escHtml(p.image) + '" width="' + w + '" height="' + h + '" border="0" alt="">'
        : '<img src="' + C.escHtml(p.image) + '" width="100%" border="0" alt="">';
    } else {
      inner =
        '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0F1420">' +
          '<tr><td height="' + (h || 180) + '" align="center" valign="middle">' +
            '<font size="2" color="' + meta.color + '" face="Consolas, monospace"><b>' + C.escHtml(p.lang.toUpperCase()) + ' // ENGINEERING</b></font><br>' +
            C.spacerImg(1, 4) + '<br>' +
            '<font size="1" color="' + THEME.textDim + '">' + C.escHtml(p.categoryLabel) + '</font>' +
          '</td></tr>' +
        '</table>';
    }
    return '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + THEME.bgDeep + '"><tr><td align="center" valign="middle"' + (onclickCode ? ' onclick="' + onclickCode + '"' : '') + '>' + inner + '</td></tr></table>';
  }

  function renderProjectDossier(p, vw) {
    if (!p) return '';
    var meta = getCatMeta(p.category);
    var hlHtml = '';
    for (var i = 0; i < p.highlights.length; i++) {
      hlHtml +=
        '<tr>' +
          '<td width="16" valign="top"><font size="2" color="' + meta.color + '"><b>▸</b></font></td>' +
          '<td><font size="2" color="' + THEME.textMain + '">' + C.escHtml(p.highlights[i]) + '</font></td>' +
        '</tr>';
    }

    var tagsHtml = '<table border="0" cellpadding="2" cellspacing="3"><tr>';
    for (i = 0; i < p.tags.length; i++) {
      tagsHtml += '<td bgcolor="' + THEME.bgAlt + '"><font size="1" color="' + meta.color + '">&nbsp;#' + C.escHtml(p.tags[i]) + '&nbsp;</font></td>';
    }
    tagsHtml += '</tr></table>';

    var infoPart =
      '<table border="0" cellpadding="0" cellspacing="4"><tr>' +
        '<td>' + C.badgeHtml(p.categoryLabel, THEME.bgElevated, meta.color, false) + '</td>' +
        '<td>' + C.badgeHtml(p.lang, THEME.bgAlt, THEME.textMain, true) + '</td>' +
        (p.stars > 0 ? '<td>' + C.badgeHtml('★ ' + p.stars + ' Stars', '#2C2312', THEME.amber, true) + '</td>' : '') +
        '<td>' + C.badgeHtml('更新 ' + p.updated, THEME.bgAlt, THEME.textMuted, true) + '</td>' +
      '</tr></table>' +
      C.spacerImg(1, 8) + '<br>' +
      '<font size="5" color="' + THEME.textMain + '"><b>' + C.escHtml(p.name) + '</b></font><br>' +
      C.spacerImg(1, 6) + '<br>' +
      '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(p.summary) + '</font><br>' +
      C.spacerImg(1, 10) + '<br>' +
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '"><tr><td bgcolor="' + THEME.bgElevated + '">' +
        '<table width="100%" border="0" cellpadding="10" cellspacing="4">' + hlHtml + '</table>' +
      '</td></tr></table>' +
      C.spacerImg(1, 8) + '<br>' +
      tagsHtml;

    var shotPart =
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.borderStrong + '">' +
        '<tr><td bgcolor="' + THEME.bgDeep + '" align="center">' +
          renderProjectCoverCell(p, vw >= 760 ? 336 : 0, vw >= 760 ? 189 : 180, '') +
        '</td></tr>' +
      '</table>';

    return (
      '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + meta.color + '">' +
        '<tr><td bgcolor="' + THEME.bgCard + '">' +
          '<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
            '<tr><td bgcolor="' + THEME.bgElevated + '">' +
              '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr>' +
                '<td><font size="2" color="' + meta.color + '" face="Consolas, monospace"><b>PROJECT DOSSIER // ' + C.escHtml(p.id.toUpperCase()) + '</b></font></td>' +
                '<td align="right">' +
                  '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
                    (p.liveUrl ? '<td>' + C.pillButtonHtml('在线体验 / 阅读 ↗', '#132A24', THEME.emerald, "window.SITE_COMMON.openExternal('" + C.escJsStr(p.liveUrl) + "')", false) + '</td><td width="8">' + C.spacerImg(8, 1) + '</td>' : '') +
                    '<td>' + C.pillButtonHtml('GitHub 仓库 ↗', '#1E273B', meta.color, "window.SITE_COMMON.openExternal('" + C.escJsStr(p.repoUrl) + "')", false) + '</td>' +
                    '<td width="8">' + C.spacerImg(8, 1) + '</td>' +
                    '<td>' + C.pillButtonHtml('× 关闭详情', '#2E171D', '#FCA5A5', "window.PROJECTS_APP.closeDetail()", false) + '</td>' +
                  '</tr></table>' +
                '</td>' +
              '</tr></table>' +
            '</td></tr>' +
            '<tr><td>' +
              '<table width="100%" border="0" cellpadding="16" cellspacing="0">' +
                (vw < 760
                  ? '<tr><td>' + shotPart + '</td></tr><tr><td height="12">' + C.spacerImg(1, 12) + '</td></tr><tr><td>' + infoPart + '</td></tr>'
                  : '<tr><td width="340" valign="top">' + shotPart + '</td><td width="16">' + C.spacerImg(16, 1) + '</td><td valign="top">' + infoPart + '</td></tr>') +
              '</table>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +
      '</table><img src="' + SP + '" width="1" height="12" border="0" alt=""><br>'
    );
  }

  function renderProjectGrid(items, vw) {
    if (items.length === 0) {
      return (
        '<table width="100%" border="0" cellspacing="1" cellpadding="0" bgcolor="' + THEME.border + '">' +
          '<tr><td bgcolor="' + THEME.bgCard + '" align="center"><table border="0" cellpadding="28" cellspacing="0"><tr><td align="center">' +
            '<font size="3" color="' + THEME.textMuted + '">没有匹配的项目</font><br><br>' +
            '<button type="button" onclick="window.PROJECTS_APP.reset()">显示全部项目</button>' +
          '</td></tr></table></td></tr>' +
        '</table>'
      );
    }

    var cols = C.getGridCols(vw);
    var isFixed = (cols === 3 && vw >= 1140);
    var contentW = isFixed ? 350 : 0;
    var gutterW = 12;
    var imgW = isFixed ? 350 : 0;
    var imgH = isFixed ? 197 : 180;
    var wAttr = contentW > 0 ? (' width="' + contentW + '"') : '';
    var totalCols = cols * 3 + (cols - 1);

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

    for (var i = 0; i < items.length; i += cols) {
      if (i > 0) html += '<tr><td colspan="' + totalCols + '" height="12">' + C.spacerImg(1, 12) + '</td></tr>';
      var row = [];
      for (c = 0; c < cols; c++) {
        row.push(i + c < items.length ? items[i + c] : null);
      }

      // 1. Top color bar
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        if (row[c]) {
          html += '<td colspan="3" height="3" bgcolor="' + getCatMeta(row[c].category).color + '">' + C.spacerImg(1, 3) + '</td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 2. Synchronized Cover Image Row
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pm = row[c];
        if (pm) {
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgDeep + '" valign="middle">' +
              renderProjectCoverCell(pm, imgW, imgH, "window.PROJECTS_APP.openDetail('" + pm.id + "')") +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 3. Card Header
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var ph = row[c];
        if (ph) {
          var meta = getCatMeta(ph.category);
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgCard + '" valign="middle">' +
              '<table width="100%" border="0" cellpadding="8" cellspacing="0"><tr>' +
                '<td align="left">' + C.badgeHtml(ph.categoryLabel, THEME.bgElevated, meta.color, false) + '</td>' +
                '<td align="right">' + C.badgeHtml(ph.lang + (ph.stars > 0 ? (' · ★' + ph.stars) : ''), THEME.bgAlt, THEME.textMuted, true) + '</td>' +
              '</tr></table>' +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 4. Card Body
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
          var firstPoint = pb.highlights && pb.highlights[0] ? C.truncateStr(pb.highlights[0], 34) : '';
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgCard + '" valign="top">' +
              '<table width="100%" border="0" cellpadding="10" cellspacing="0"><tr><td>' +
                '<span onclick="window.PROJECTS_APP.openDetail(\'' + pb.id + '\')"><font size="3" color="' + THEME.textMain + '"><b>' + C.escHtml(pb.name) + '</b></font></span><br>' +
                C.spacerImg(1, 6) + '<br>' +
                '<font size="2" color="' + THEME.textMuted + '">' + C.escHtml(C.truncateStr(pb.summary, 66)) + '</font><br>' +
                C.spacerImg(1, 6) + '<br>' +
                (firstPoint ? '<font size="1" color="' + THEME.textDim + '">▸ ' + C.escHtml(firstPoint) + '</font><br>' + C.spacerImg(1, 6) + '<br>' : '') +
                tgHtml +
              '</td></tr></table>' +
            '</td>' +
            '<td width="1" bgcolor="' + THEME.border + '"></td>';
        } else {
          html += '<td colspan="3"></td>';
        }
      }
      html += '</tr>';

      // 5. Card Footer
      html += '<tr>';
      for (c = 0; c < cols; c++) {
        if (c > 0) html += '<td></td>';
        var pf = row[c];
        if (pf) {
          var mc = getCatMeta(pf.category).color;
          html +=
            '<td width="1" bgcolor="' + THEME.border + '"></td>' +
            '<td' + wAttr + ' bgcolor="' + THEME.bgAlt + '" valign="middle">' +
              '<table width="100%" border="0" cellpadding="6" cellspacing="0"><tr>' +
                '<td><font size="1" color="' + THEME.textDim + '" face="Consolas, monospace">' + C.escHtml(pf.updated) + '</font></td>' +
                '<td align="right">' +
                  '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
                    '<td bgcolor="#1E273B" onclick="window.PROJECTS_APP.openDetail(\'' + pf.id + '\')"><table border="0" cellpadding="2" cellspacing="0"><tr><td><font size="1" color="' + mc + '"><b>&nbsp;详情&nbsp;</b></font></td></tr></table></td>' +
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
    return html;
  }

  function applyHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    if (!h) return;
    if (h.indexOf('cat=') === 0) {
      state.cat = h.slice(4) || 'all';
      state.selectedId = '';
    } else if (h.indexOf('project=') === 0) {
      state.selectedId = h.slice(8);
    }
  }

  function render() {
    var vw = C.getViewportWidth();
    C.applyShellWidth(vw);
    var filtered = getFilteredProjects();
    var selected = state.selectedId ? findProject(state.selectedId) : null;

    var html =
      C.renderSiteHeader('projects', vw) +
      '<img src="' + SP + '" width="1" height="10" border="0" alt=""><br>' +
      renderFilterBar(filtered.length, vw) +
      '<img src="' + SP + '" width="1" height="12" border="0" alt=""><br>' +
      renderProjectDossier(selected, vw) +
      renderProjectGrid(filtered, vw) +
      C.renderSiteFooter();

    var root = document.getElementById('app-root');
    if (root) root.innerHTML = html;
  }

  window.PROJECTS_APP = {
    setCat: function (cat) {
      state.cat = cat;
      state.selectedId = '';
      try { window.location.hash = 'cat=' + cat; } catch (e) {}
      render();
    },
    applySearch: function () {
      var el = document.getElementById('proj-query');
      state.query = el ? el.value : '';
      render();
    },
    reset: function () {
      state.cat = 'all';
      state.query = '';
      state.selectedId = '';
      try { window.location.hash = ''; } catch (e) {}
      render();
    },
    openDetail: function (id) {
      state.selectedId = id;
      try { window.location.hash = 'project=' + id; } catch (e) {}
      render();
      try { window.scrollTo(0, 0); } catch (e) {}
    },
    closeDetail: function () {
      state.selectedId = '';
      try { window.location.hash = 'cat=' + state.cat; } catch (e) {}
      render();
    }
  };

  applyHash();
  render();
  if (window.addEventListener) {
    window.addEventListener('resize', render, false);
    window.addEventListener('hashchange', function () { applyHash(); render(); }, false);
  } else if (window.attachEvent) {
    window.attachEvent('onresize', render);
  }
})();
