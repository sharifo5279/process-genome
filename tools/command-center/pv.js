  /* Product overlay: Command Center coverage on the genome. Optimize shows monitors and findings now; Extend shows agents at decision points. */
  var pmPv = "off", pmPvLast = "optimize";
  function pmPvOn() { return pmPv !== "off" && pmMode === "pt" && !!PMPV[pmK]; }
  function pmPvMods(c) {
    var P = PMPV[pmK], m = [];
    if (P.im.some(function (x) { return x[1].indexOf(c) >= 0; })) m.push("IM");
    if (P.pm.some(function (x) { return x[1].indexOf(c) >= 0; })) m.push("PM");
    return m;
  }
  function pmPvSev(c) {
    var s = "";
    CCF.forEach(function (f) { if (ccDone[f.id]) return; var st = PROCESSES.retail[f.p].steps[f.st]; if (ccToks(st[1]).indexOf(c) >= 0) s = f.sev === "c" || s === "c" ? "c" : "w"; });
    return s;
  }
  function pmPvBand(c) {
    if (!PMELC[c]) return "";
    if (pmPv === "extend") { var o = PMOV.extend; for (var i = 0; i < o.dp.length; i++) if (o.dp[i][1].indexOf(c) >= 0) return o.dp[i][2]; return ""; }
    var s = pmPvSev(c);
    return s === "c" ? "h" : s === "w" ? "m" : pmPvMods(c).length ? "l" : "";
  }
  function pmPvCard() {
    var P = PMPV[pmK], ex = pmPv === "extend";
    function list(rows, tag) {
      return '<ul class="pp-list pv-list">' + rows.map(function (r) { return '<li><button type="button" data-pe="' + esc(r[1][0]) + '"><span class="pv-t">' + tag + '</span><span>' + esc(r[0]) + '<small>' + esc(r[1].join(", ")) + '</small></span></button></li>'; }).join("") + '</ul>';
    }
    var h = '<div class="oc pv"><div class="oc-h"><p class="pp-e">Product overlay</p><span class="oc-ill">Illustrative</span></div>' +
      '<p class="oc-q">Command Center</p><p class="oc-def">Monitors each business process on the network and recommends the next action.</p>' +
      '<ol class="oc-lad pv-lad"><li><button type="button" data-pvp="optimize" aria-pressed="' + !ex + '"><b>Optimize</b><span>Integration Monitor and Performance Monitor</span></button></li>' +
      '<li><button type="button" data-pvp="extend" aria-pressed="' + ex + '"><b>Extend</b><span>Performance Monitor agents</span></button></li></ol>' +
      '<p class="oc-def pv-def">' + (ex ? "Agents predict a problem at a decision point, recommend an action and wait for a person to approve it."
        : "Integration Monitor watches volume, timing and acknowledgments. Performance Monitor checks business rules across documents.") + '</p>' +
      '<div class="oc-k"><b>' + (ex ? "Shading: value at stake" : "Shading: findings now") + '</b>' +
      (ex ? '<span>' + pmBars("h", true) + '</span><span>' + pmBars("m", true) + '</span><span>' + pmBars("l", true) + '</span>'
        : '<span>' + pmBars("h") + '<span class="obw">Critical</span></span><span>' + pmBars("m") + '<span class="obw">Warning</span></span><span>' + pmBars("l") + '<span class="obw">Monitored</span></span>') + '</div>' +
      '<p class="pp-key pv-key">' + (ex ? "Numbers on tiles mark agent decision points." : "<b>IM</b> Integration Monitor · <b>PM</b> Performance Monitor rule") + '</p>' +
      '<a class="pm-btn pm-more" href="command-center/" target="_blank" rel="noopener" aria-label="Try the Command Center clickable prototype (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>Try the Command Center prototype</a></div>';
    if (ex) {
      h += '<h4>Performance Monitor agents</h4><ul class="pp-list pv-list">' + PMOV.extend.dp.map(function (d, i) {
        var a = P.ag[i] || ["", ""];
        return '<li><button type="button" data-pe="' + esc(d[1][0]) + '"><span class="pv-t pv-n">' + (i + 1) + '</span><span>' + esc(d[0]) + '<small>' + esc(a[0]) + '. Approved by ' + esc(lc(a[1])) + '.</small></span></button></li>';
      }).join("") + '</ul>';
    } else h += '<h4>Integration Monitor</h4>' + list(P.im, "IM") + '<h4>Performance Monitor rules</h4>' + list(P.pm, "PM");
    return h;
  }
  function pmApplyOv() {
    var pv = pmPvOn(), on = (pmOv !== "off" && pmMode === "pt") || pv;
    pmEl.classList.toggle("ov", on);
    pmEl.classList.toggle("pv", pv);
    document.getElementById("pm-ill").hidden = !on;
    document.getElementById("pm-ovt").setAttribute("aria-pressed", pmOv !== "off" ? "true" : "false");
    var pvt = document.getElementById("pm-pvt");
    pvt.hidden = !PMPV[pmK]; pvt.setAttribute("aria-pressed", pmPv !== "off" ? "true" : "false");
    document.querySelectorAll("#pm-pt .pt[data-code]").forEach(function (t) {
      var c = t.getAttribute("data-code"), b = "", d = "";
      if (pv) { b = pmPvBand(c); d = pmPv === "extend" ? pmDPs([c]).join(" · ") : pmPvMods(c).join(" "); }
      else if (on) { b = pmBand(c); d = pmOv === "extend" ? pmDPs([c]).join(" · ") : ""; }
      if (b === "x") b = "";
      t.setAttribute("data-ob", b);
      t.querySelector(".ob").innerHTML = b ? pmBars(b) : "";
      t.querySelector(".odp").textContent = d;
    });
  }
