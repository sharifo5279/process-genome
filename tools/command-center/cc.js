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

  /* Live process network: one line per process, a station per step, flow pulses between stations */
  var CCSH = { f1: ["14 ASNs not sent", "$8.4K chargeback risk"], f2: ["Volume 64% low", "$182K orders missing"], f3: ["37 acks late", "37 orders unconfirmed"],
    f4: ["112 invoices rejected", "$46.2K invoices held"], f5: ["23 without backup", "$12.8K to dispute"], f6: ["9 loads without status", "3 appointments at risk"],
    f7: ["Weekly feed missing", "Sell-through data missing"], f8: ["6 advices missing", "6 orders unconfirmed"], f9: ["Old cost on 61 orders", "$28.4K likely to reject"],
    f10: ["Feed 3 hours late", "240 items may oversell"], f11: ["4 ASNs rejected", "4 manual receipts"] };
  var CCV = [320, 95, 180, 40, 60, 210, 150, 540, 130, 35, 25];
  function ccMap() {
    var P = PROCESSES.retail, S = GENOME.retail.short, W = 1040, x0 = 246, x1 = 948, y = 0, h = "";
    CCSTG.forEach(function (g, gi) {
      y += gi ? 20 : 14;
      h += '<text class="cc-gl" x="0" y="' + y + '">' + esc(g[0].toUpperCase()) + '</text>';
      y += 6;
      g[1].forEach(function (i) {
        var p = P[i], fl = ccFor(i), sev = ccSev(fl), n = p.steps.length, cy = y + 24, dim = (ccStg >= 0 && ccStg !== gi) || (ccProc >= 0 && ccProc !== i);
        var xs = p.steps.map(function (s, k) { return x0 + k * (x1 - x0) / (n - 1); });
        var st = p.steps.map(function (s, k) { var lbl = s[1].split(" / ")[0]; return ccNet(lbl) ? ccSev(ccFor(i, k)) : "na"; });
        var all = CCF.filter(function (f) { return f.p === i; }), val = fl.reduce(function (a, f) { return a + f.val; }, 0);
        h += '<g class="cc-ln s-' + sev + (dim ? ' dim' : '') + (ccProc === i ? ' sel' : '') + '" data-p="' + i + '">' +
          '<rect class="cc-hit" x="0" y="' + (cy - 24) + '" width="' + W + '" height="48"/>' +
          '<circle class="cc-sd" cx="6" cy="' + cy + '" r="5"/><text class="cc-pn" x="20" y="' + (cy + 4.5) + '">' + esc(S[i]) + '</text>' +
          '<path class="cc-base" d="M' + (x0 - 24) + ' ' + cy + 'H' + (x1 + 24) + '"/>';
        for (var k = 0; k < n - 1; k++) {
          var a = xs[k] + 11, b = xs[k + 1] - 11, d = 'M' + a + ' ' + cy + 'H' + b, sg = st[k + 1] === "na" || st[k] === "na" ? "na" : st[k + 1];
          h += '<path class="cc-fl ' + sg + '" d="' + d + '" style="--sp:' + (0.6 + 300 / CCV[i]).toFixed(2) + 's"/>';
        }
        p.steps.forEach(function (s, k) {
          var lbl = s[1].split(" / ")[0], v = st[k], code = lbl.replace(/^GDSN /, "");
          h += '<g class="cc-stn ' + v + '"><title>' + esc(s[0] + ": " + (v === "na" ? "Outside the network" : CCSEV[v])) + '</title>' +
            (v === "w" || v === "c" ? '<circle class="cc-halo" cx="' + xs[k] + '" cy="' + cy + '" r="11"/>' : '') +
            '<circle class="cc-dotc" cx="' + xs[k] + '" cy="' + cy + '" r="' + (v === "na" ? 5 : 7.5) + '"/>' +
            '<text class="cc-code" x="' + xs[k] + '" y="' + (cy - 13) + '" text-anchor="middle">' + esc(code.length > 12 ? code.slice(0, 11) + "…" : code) + '</text></g>';
          all.filter(function (f) { return f.st === k; }).forEach(function (f) {
            var done = !!ccDone[f.id];
            h += '<text class="cc-co s-' + (done ? "ok" : f.sev) + (ccF === f.id ? ' on' : '') + '" data-f="' + f.id + '" x="' + xs[k] + '" y="' + (cy + 20) + '" text-anchor="middle">' +
              esc(done ? "Action approved" : CCSH[f.id][ccPer === "biz" ? 1 : 0]) + '</text>';
          });
        });
        h += '<text class="cc-rm" x="' + W + '" y="' + (cy - 1) + '" text-anchor="end">' + (ccPer === "biz" ? (val ? ccMoney(val) : "None") : CCV[i] + "/h") + '</text>' +
          '<text class="cc-rs" x="' + W + '" y="' + (cy + 13) + '" text-anchor="end">' + (ccPer === "biz" ? "at risk" : "documents") + '</text></g>';
        y += 48;
      });
    });
    return '<svg class="cc-net" viewBox="0 0 ' + W + ' ' + (y + 4) + '" width="100%" role="img" aria-label="Retail and CPG processes with live document flow and open findings">' + h + '</svg>';
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
      var pt = {}; open.forEach(function (x) { pt[x.partner] = 1; });
      h = '<p class="pp-e">' + (ccStg < 0 ? "All processes" : esc(CCSTG[ccStg][0])) + '</p><h3>Findings</h3>' +
        '<dl class="pp-dl cc-sum"><div><dt>Open</dt><dd>' + open.length + ', ' + open.filter(function (x) { return x.sev === "c"; }).length + ' critical</dd></div>' +
        (ccPer === "biz" ? '<div><dt>Value at risk</dt><dd>' + ccMoney(open.reduce(function (a, x) { return a + x.val; }, 0)) + '</dd></div>'
          : '<div><dt>Documents</dt><dd>' + open.reduce(function (a, x) { return a + x.n; }, 0) + ' across ' + Object.keys(pt).length + ' partners</dd></div>') + '</dl>' +
        '<h4>' + (ccPer === "biz" ? "By value at risk" : "By severity") + '</h4>' + ccQueue(ccSorted(list));
    }
    ccPP.innerHTML = h;
  }
  function ccRender() {
    ccMain.innerHTML = ccMap();
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
    var c = e.target.closest("[data-f]");
    if (c) { ccF = c.getAttribute("data-f"); ccProc = ccFind(ccF).p; ccRender(); ccPP.scrollTop = 0; return; }
    var r = e.target.closest(".cc-ln"); if (!r) { if (ccProc >= 0 || ccF) { ccProc = -1; ccF = null; ccRender(); } return; }
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
