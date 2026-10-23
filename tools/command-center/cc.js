  /* Command Center: process continuity console for Retail and CPG */
  var ccEl = document.getElementById("cc"), ccFrame = document.getElementById("cc-frame"), ccPP = document.getElementById("cc-pp"), ccMain = document.getElementById("cc-main");
  var ccPer = "ops", ccStg = -1, ccProc = -1, ccF = null, ccDone = {};
  var CCNET = /^(\d{3}|GDSN)/;
  function ccToks(lbl) { return lbl.split(" / ")[0].replace(/^GDSN /, "").split(/,\s*| or /); }
  function ccNet(lbl) { return CCNET.test(lbl); }
  function ccOpen_(f) { return !ccDone[f.id]; }
  function ccFind(id) { return CCF.filter(function (f) { return f.id === id; })[0]; }
  function ccFor(i, k) { return CCF.filter(function (f) { return f.p === i && (k === undefined || f.st === k) && ccOpen_(f); }); }
  function ccSev(list) { return list.some(function (f) { return f.sev === "c"; }) ? "c" : list.length ? "w" : "ok"; }
  function ccStageOf(i) { for (var g = 0; g < CCSTG.length; g++) if (CCSTG[g][1].indexOf(i) >= 0) return g; return -1; }
  function ccMoney(v) { return "$" + Math.round(v).toLocaleString("en-US"); }
  var CCSEV = { c: "Critical", w: "Warning", ok: "Healthy" };
  function ccTitle(f) { return ccPer === "biz" ? f.bt : f.ot; }
  function ccSum(f) { return ccPer === "biz" ? f.bs : f.os; }

  function ccKpis() {
    var P = PROCESSES.retail, open = CCF.filter(ccOpen_), crit = open.filter(function (f) { return f.sev === "c"; }).length;
    var st = P.map(function (p, i) { return ccSev(ccFor(i)); }), healthy = st.filter(function (s) { return s === "ok"; }).length;
    var stTxt = st.filter(function (s) { return s === "c"; }).length + " critical, " + st.filter(function (s) { return s === "w"; }).length + " warning";
    var partners = {}; open.forEach(function (f) { partners[f.partner] = 1; });
    function held(id) { var f = ccFind(id); return f && ccOpen_(f) ? ccMoney(f.val) : "$0"; }
    var k = ccPer === "biz" ? [
      ["Value at risk", ccMoney(open.reduce(function (s, f) { return s + f.val; }, 0)), "Across " + open.length + " open findings", crit > 0],
      ["Invoices held", held("f4"), "Price mismatch with Northfield Stores"],
      ["Deductions open", held("f5"), "8 days left to dispute"],
      ["OTIF this week", "94.2%", "Target 97%"],
      ["Processes healthy", healthy + " of " + P.length, stTxt]
    ] : [
      ["Open findings", String(open.length), crit + " critical", crit > 0],
      ["Documents affected", String(open.reduce(function (s, f) { return s + f.n; }, 0)), "Across " + Object.keys(partners).length + " partners"],
      ["First-pass acceptance", "97.8%", "Last 24 hours"],
      ["Triaged on time", "92%", "Within 15 minutes of detection"],
      ["Processes healthy", healthy + " of " + P.length, stTxt]
    ];
    return '<div class="cc-kpi">' + k.map(function (x) { return '<div class="cc-k' + (x[3] ? ' hi' : '') + '"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b><small>' + esc(x[2]) + '</small></div>'; }).join("") + '</div>';
  }
  function ccRow(i) {
    var p = PROCESSES.retail[i], fl = ccFor(i), sev = ccSev(fl), m = CCM[i];
    var trk = p.steps.map(function (s, k) {
      var lbl = s[1].split(" / ")[0], net = ccNet(lbl), sv = net ? ccSev(ccFor(i, k)) : "na";
      return '<span class="cc-sg ' + sv + '" title="' + esc(s[0] + ": " + (net ? CCSEV[sv] : "Outside the network")) + '">' + esc(lbl.replace(/^GDSN /, "")) + '</span>';
    }).join("");
    var cols = ccPer === "biz"
      ? '<span class="cc-n">' + (function (v) { return v ? ccMoney(v) : '<em>None</em>'; })(fl.reduce(function (s, f) { return s + f.val; }, 0)) + '</span><span class="cc-n cc-ms">' + esc(m[1]) + '<small>' + esc(p.measures[m[0]]) + '</small></span>'
      : '<span class="cc-n">' + (fl.length || '<em>0</em>') + '</span><span class="cc-n">' + (fl.reduce(function (s, f) { return s + f.n; }, 0) || '<em>0</em>') + '</span><span class="cc-n">' + (fl.length ? Object.keys(fl.reduce(function (o, f) { o[f.partner] = 1; return o; }, {})).length : '<em>0</em>') + '</span>';
    var dim = ccStg >= 0 && CCSTG[ccStg][1].indexOf(i) < 0;
    return '<button type="button" class="cc-r s-' + sev + (dim ? ' dim' : '') + '" data-p="' + i + '" aria-pressed="' + (ccProc === i) + '"><span class="cc-dot" role="img" aria-label="' + CCSEV[sev] + '"></span>' +
      '<span class="cc-pn"><b>' + esc(p.n) + '</b><small>' + esc(p.owner) + '</small></span><span class="cc-trk">' + trk + '</span>' + cols + '</button>';
  }
  function ccBoard() {
    var hd = ccPer === "biz" ? '<span class="r">Value at risk</span><span class="r">Key measure</span>' : '<span class="r">Findings</span><span class="r">Documents</span><span class="r">Partners</span>';
    var rows = CCSTG.map(function (g) { return '<div class="cc-g">' + esc(g[0]) + '</div>' + g[1].map(ccRow).join(""); }).join("");
    return '<div class="cc-bd ' + ccPer + '"><div class="cc-hd"><span></span><span>Process</span><span>Steps and documents</span>' + hd + '</div><div class="cc-rows">' + rows + '</div>' +
      '<div class="cc-lg"><span><i class="ok"></i>Healthy</span><span><i class="w"></i>Warning</span><span><i class="c"></i>Critical</span><span><i class="na"></i>Outside the network: ERP, portal, warehouse and store systems</span></div></div>';
  }
  function ccQueue(list) {
    if (!list.length) return '<p class="pp-key">No open findings.</p>';
    return '<ul class="pp-list cc-q">' + list.map(function (f) {
      var done = !!ccDone[f.id];
      return '<li><button type="button" data-f="' + f.id + '" class="s-' + (done ? "ok" : f.sev) + '"><i></i><span>' + esc(ccTitle(f)) +
        '<small>' + (done ? "Action approved at " + ccDone[f.id] : esc(PROCESSES.retail[f.p].n) + " · " + esc(f.partner) + " · " + esc(f.at)) + '</small></span>' +
        (ccPer === "biz" && f.val && !done ? '<em>' + ccMoney(f.val) + '</em>' : '') + '</button></li>';
    }).join("") + '</ul>';
  }
  function ccSorted(list) {
    return list.slice().sort(function (a, b) {
      var da = ccDone[a.id] ? 1 : 0, db = ccDone[b.id] ? 1 : 0;
      if (da !== db) return da - db;
      if (ccPer === "biz") return b.val - a.val;
      return (a.sev === "c" ? 0 : 1) - (b.sev === "c" ? 0 : 1);
    });
  }
  function ccPanel() {
    var h, P = PROCESSES.retail;
    if (ccF) {
      var f = ccFind(ccF), p = P[f.p], s = p.steps[f.st], done = ccDone[f.id];
      h = '<button type="button" class="pp-x" data-back aria-label="Back to findings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<p class="pp-e cc-e s-' + (done ? "ok" : f.sev) + '"><i></i>' + (done ? "Action approved" : CCSEV[f.sev] + " finding") + '</p><h3>' + esc(ccTitle(f)) + '</h3><p class="pp-lead">' + esc(ccSum(f)) + '</p>' +
        '<dl class="pp-dl"><div><dt>Process</dt><dd>' + esc(p.n) + '</dd></div><div><dt>Step</dt><dd>' + (f.st + 1) + '. ' + esc(s[0]) + ' <span class="cc-code">' + esc(s[1].split(" / ")[0]) + '</span></dd></div>' +
        '<div><dt>Partner</dt><dd>' + esc(f.partner) + '</dd></div><div><dt>Detected by</dt><dd>' + esc(f.mod) + ', ' + esc(lc(f.how)) + '</dd></div>' +
        '<div><dt>Strategy</dt><dd>' + esc(f.pil) + (f.dp ? ', decision point ' + f.dp : '') + '</dd></div>' +
        '<div><dt>Documents</dt><dd>' + f.n + '</dd></div>' + (f.val ? '<div><dt>Value at risk</dt><dd>' + ccMoney(f.val) + '</dd></div>' : '') + '</dl>' +
        '<h4>Evidence</h4><ol class="cc-ev">' + f.ev.map(function (e) { return '<li><time>' + esc(e[0]) + '</time><span>' + esc(e[1]) + '</span></li>'; }).join("") + '</ol>' +
        '<h4>Probable cause</h4><p class="cc-tx">' + esc(f.cause) + '</p>' +
        '<h4>Recommended action</h4><div class="cc-act' + (done ? ' done' : '') + '"><p>' + esc(f.act) + '</p>' +
        (done ? '<p class="pp-key"><b>Approved at ' + esc(done) + '.</b> Command Center confirms when the partner accepts the documents.</p>'
          : '<p class="pp-key">Approval required: ' + esc(lc(f.appr)) + '</p><div class="cc-btns"><button type="button" class="pm-btn cc-ok" data-ok="' + f.id + '">Approve action</button></div>') + '</div>' +
        '<h4>Operations impact</h4><dl class="pp-dl"><div><dt>Work area</dt><dd><a href="#all/opsmap" data-gv="om">' + esc(f.area) + '</a></dd></div><div><dt>Stakeholders</dt><dd>' + esc(f.who.join(", ")) + '</dd></div></dl>' +
        '<button type="button" class="pm-btn pm-more" data-pg="' + f.p + '" data-ps="' + (f.st + 1) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>Open step in Process Genome</button>';
    } else if (ccProc >= 0) {
      var q = P[ccProc], fl = CCF.filter(function (x) { return x.p === ccProc; }), sv = ccSev(ccFor(ccProc)), m = CCM[ccProc];
      h = '<button type="button" class="pp-x" data-back aria-label="Back to findings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<p class="pp-e">Process ' + (ccProc + 1) + ' · ' + esc(CCSTG[ccStageOf(ccProc)][0]) + '</p><h3>' + esc(q.n) + '</h3><p class="pp-lead">' + esc(q.outcome) + '</p>' +
        '<dl class="pp-dl"><div><dt>Status</dt><dd><span class="cc-st s-' + sv + '"><i></i>' + CCSEV[sv] + '</span></dd></div><div><dt>Business owner</dt><dd>' + esc(q.owner) + '</dd></div>' +
        '<div><dt>' + esc(q.measures[m[0]]) + '</dt><dd>' + esc(m[1]) + '</dd></div></dl>' +
        '<h4>Steps</h4><ol class="cc-steps">' + q.steps.map(function (s, k) {
          var lbl = s[1].split(" / ")[0], net = ccNet(lbl), n = ccFor(ccProc, k).length, v = net ? ccSev(ccFor(ccProc, k)) : "na";
          return '<li class="s-' + v + '"><i></i><span><b>' + esc(s[0]) + '</b><small>' + esc(lbl) + ' · ' + (net ? (n ? n + (n > 1 ? " findings" : " finding") : "Healthy") : "Outside the network") + '</small></span></li>';
        }).join("") + '</ol>' +
        '<h4>Findings</h4>' + ccQueue(ccSorted(fl)) +
        '<button type="button" class="pm-btn pm-more" data-pg="' + ccProc + '" data-ps="0"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>Open in Process Genome</button>';
    } else {
      var list = CCF.filter(function (x) { return ccStg < 0 || CCSTG[ccStg][1].indexOf(x.p) >= 0; }), open = list.filter(ccOpen_);
      h = '<p class="pp-e">' + (ccStg < 0 ? "All processes" : esc(CCSTG[ccStg][0])) + '</p><h3>Findings</h3><p class="pp-lead">' + open.length + ' open, ' + open.filter(function (x) { return x.sev === "c"; }).length +
        ' critical. Select a finding for evidence and the recommended action.</p>' + ccQueue(ccSorted(list));
    }
    ccPP.innerHTML = h;
  }
  function ccRender() {
    ccMain.innerHTML = ccKpis() + ccBoard();
    ccEl.querySelectorAll(".pm-seg button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-per") === ccPer ? "true" : "false"); });
    ccEl.querySelectorAll("#cc-chips button").forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-g") === ccStg ? "true" : "false"); });
    ccPanel();
  }
  function ccFit() {
    var fs = document.fullscreenElement === ccEl;
    ccEl.classList.toggle("small", !fs && (window.innerWidth < 1024 || window.innerHeight < 560));
    var w = fs ? window.innerWidth : ccFrame.clientWidth, hh = fs ? window.innerHeight : window.innerHeight - 81;
    if (w) ccEl.style.setProperty("--s", Math.min(w / 1440, hh / 810));
  }
  function ccOpen() { ccEl.hidden = false; ccFit(); ccRender(); }
  function ccClose() {
    if (ccEl.hidden) return;
    if (document.fullscreenElement === ccEl) { try { document.exitFullscreen(); } catch (err) {} }
    ccEl.hidden = true;
  }
  document.getElementById("cc-chips").innerHTML = '<button type="button" data-g="-1" aria-pressed="true">All processes</button>' + CCSTG.map(function (g, k) { return '<button type="button" data-g="' + k + '" aria-pressed="false">' + esc(g[0]) + '</button>'; }).join("");
  document.getElementById("cc-chips").addEventListener("click", function (e) { var b = e.target.closest("button[data-g]"); if (!b) return; ccStg = +b.getAttribute("data-g"); ccProc = -1; ccF = null; ccRender(); });
  ccEl.querySelector(".pm-seg").addEventListener("click", function (e) { var b = e.target.closest("button[data-per]"); if (!b) return; ccPer = b.getAttribute("data-per"); ccRender(); });
  ccMain.addEventListener("click", function (e) {
    var r = e.target.closest(".cc-r"); if (!r) return;
    var i = +r.getAttribute("data-p"); ccProc = ccProc === i ? -1 : i; ccF = null; ccRender(); ccPP.scrollTop = 0;
  });
  ccPP.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-f")) { ccF = b.getAttribute("data-f"); ccRender(); ccPP.scrollTop = 0; }
    else if (b.hasAttribute("data-back")) { if (ccF && ccProc >= 0) ccF = null; else { ccF = null; ccProc = -1; } ccRender(); }
    else if (b.hasAttribute("data-ok")) { ccDone[b.getAttribute("data-ok")] = "08:41"; ccRender(); }
    else if (b.hasAttribute("data-pg")) { var pi = +b.getAttribute("data-pg"), ps = +b.getAttribute("data-ps"); setView("map"); pmSet({ l: [pi], s: ps }, null); }
  });
  document.getElementById("cc-back").addEventListener("click", function () { curV = "ops"; render("all"); window.scrollTo({ top: 0 }); });
  var ccFs = document.getElementById("cc-fs");
  if (!ccEl.requestFullscreen) ccFs.hidden = true;
  ccFs.addEventListener("click", function () { if (document.fullscreenElement) document.exitFullscreen(); else ccEl.requestFullscreen().catch(function () {}); });
  document.addEventListener("fullscreenchange", function () { if (!ccEl.hidden) setTimeout(ccFit, 50); });
  window.addEventListener("resize", function () { if (!ccEl.hidden) ccFit(); });
  document.addEventListener("keydown", function (e) { if (ccEl.hidden || e.key !== "Escape") return; if (ccF || ccProc >= 0 || ccStg >= 0) { e.preventDefault(); if (ccF) ccF = null; else if (ccProc >= 0) ccProc = -1; else ccStg = -1; ccRender(); } });
