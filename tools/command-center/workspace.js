  /* Workspace: business process views, custom dashboards, reports, notifications, tasks and reminders, and agents.
     Configuration: the Performance Monitor rule wizard (job, scope, expected behavior, deviation, reference data, budget, test, confirm).
     Saved items live in this browser only. Illustrative values. */
  CXI.doc = CXI.doc || '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>';
  CXI.clock = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
  CXI.grid = '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>';
  CXI.trash = '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>';
  var WSKEY = "process-genome-cc-workspace-v2";
  var ccWs = null, ccWsProc = "0", ccWsDash = "", ccWsForm = "", ccWsLens = "all", ccRw = null, ccToastT = "", ccToastTm;
  /* Every saved item and option carries the package that brings it: im (all clients), pm, or rt */
  function wsSeed() {
    return {
      dashboards: [{ n: "Process performance daily", c: [20, 40, 60], t: "pm" }],
      reports: [{ n: "Daily findings digest", s: "Findings digest", f: "Email", w: "Daily, 06:30", r: "EDI operations", last: "Today, 06:30", t: "im" },
        { n: "Weekly process performance", s: "Process performance", f: "PDF", w: "Weekly, Monday 07:00", r: "Operations leads", last: "Mon, 07:00", t: "pm" },
        { n: "Retail compliance", s: "Retail compliance", f: "PDF", w: "Weekly, Friday 16:00", r: "Vendor compliance", last: "Fri, 16:00", t: "rt" }],
      notifs: [{ t: "High-severity finding", ch: "Email, Microsoft Teams", r: "EDI operations", on: true, k: "im" }, { t: "Partner feed late", ch: "Email", r: "Partner enablement", on: false, k: "im" },
        { t: "Action waiting over 1 hour", ch: "In-app", r: "Approvers", on: true, k: "pm" }, { t: "Process health turns critical", ch: "Microsoft Teams", r: "Supply chain", on: true, k: "pm" },
        { t: "Dispute window closing", ch: "Email", r: "Deductions review", on: true, k: "rt" }],
      tasks: [{ t: "Restore the AS2 connection for the order feed", o: "Alex Morgan", d: "Today", k: "f:f2", done: false, tr: "im" },
        { t: "Resolve the cost mismatch on open orders", o: "Dana Ortiz", d: "Oct 27", k: "f:f9", done: false, tr: "pm" },
        { t: "Follow up the 861 for ASN-10391", o: "Jamie Brooks", d: "Tomorrow", k: "rt:rt-invoice-deduction", done: false, tr: "rt" }],
      reminders: [{ t: "Check the remittance advice after the connection fix", w: "Today, 11:30", tr: "im" }, { t: "Check acknowledgments before the 12:00 cutoff", w: "Today, 11:30", tr: "pm" }, { t: "Deduction review window closes", w: "Nov 21, 09:00", tr: "rt" }],
      rules: []
    };
  }
  var WSOPT = {
    rep: [["Findings digest", "im"], ["Network activity", "im"], ["Partner activity", "im"], ["Process performance", "pm"], ["Partner scorecard", "pm"], ["Retail compliance", "rt"], ["Deduction and dispute evidence", "rt"]],
    not: [["High-severity finding", "im"], ["Volume anomaly", "im"], ["Partner feed late", "im"], ["Action waiting over 1 hour", "pm"], ["Process health turns critical", "pm"], ["Rule over budget", "pm"], ["Dispute window closing", "rt"], ["Ship notice late for a trading partner", "rt"]]
  };
  function wsOpts(k) { return WSOPT[k].filter(function (o) { return ccOn(o[1]); }).map(function (o) { return o[0]; }); }
  function wsTier(x) { return ccOn(x.t && x.t.length === 2 ? x.t : x.k && x.k.length === 2 ? x.k : x.tr || "im"); }
  function wsIdx(list) { return list.map(function (x, k) { return [x, k]; }).filter(function (p) { return wsTier(p[0]); }); }
  function wsLoad() {
    if (ccWs) return ccWs;
    var s = null; try { s = JSON.parse(localStorage.getItem(WSKEY) || "null"); } catch (e) {}
    ccWs = s && typeof s === "object" && Array.isArray(s.dashboards) ? s : wsSeed();
    ["dashboards", "reports", "notifs", "tasks", "reminders", "rules"].forEach(function (k) { if (!Array.isArray(ccWs[k])) ccWs[k] = wsSeed()[k]; });
    ccWs.dashboards = ccWs.dashboards.filter(function (d) { return d.n !== "Network health"; });
    ccWs.dashboards.forEach(function (d) { if (d.n === "Order to cash daily") d.n = "Process performance daily"; });
    ccWs.rules.forEach(function (r) { CXR.push(r); });
    return ccWs;
  }
  function wsSave() { try { localStorage.setItem(WSKEY, JSON.stringify(ccWs)); } catch (e) {} }
  function cxToast(t) { ccToastT = t; clearTimeout(ccToastTm); ccToastTm = setTimeout(function () { ccToastT = ""; var el = cx.querySelector(".cx-toast"); if (el) el.remove(); }, 3800); }
  function wsVal(sel) { var el = cx.querySelector(sel); return el ? String(el.value || "").trim() : ""; }
  function wsSel(name, opts, cur) { return '<select ' + name + '>' + opts.map(function (o) { return '<option' + (o === cur ? " selected" : "") + '>' + cxe(o) + '</option>'; }).join("") + '</select>'; }
  function wsField(label, ctl) { return '<label class="ws-f"><span>' + label + '</span>' + ctl + '</label>'; }
  function wsHead(t, lead, extra) {
    return cxHead("Workspace", extra) + '<nav class="cx-tabs" aria-label="Workspace">' + cxWsSecs().map(function (w) { return '<button type="button" data-cxgo="' + w[0] + '" aria-pressed="' + (ccScr === w[0]) + '">' + w[1] + '</button>'; }).join("") + '</nav>' +
      (lead ? '<p class="cx-lead">' + lead + '</p>' : "");
  }
  function wsNew(form, label) { return '<button type="button" class="cx-btn p" data-wsform="' + form + '">' + ci("plus") + label + '</button>'; }
  function wsForm(form, title, fields, saveLabel) {
    return ccWsForm === form ? '<section class="cx-card ws-form"><header><h3>' + title + '</h3></header><div class="ws-fg">' + fields + '</div><div class="ws-fa"><button type="button" class="cx-btn p" data-wssave="' + form + '">' + saveLabel + '</button><button type="button" class="cx-btn" data-wsform="">Cancel</button></div></section>' : "";
  }

  var WSDOCN = { "850": "Purchase order", "855": "Order acknowledgment", "860, 865": "Order change and acknowledgment", "856": "Ship notice", "856, 824": "Ship notice", "861": "Receiving advice", "810": "Invoice", "820": "Remittance advice",
    "812": "Debit memo", "812, 820": "Debit memo and remittance", "753": "Routing request", "754": "Routing instructions", "204, 990": "Load tender and response", "214": "Shipment status", "210": "Freight invoice",
    "944": "Warehouse stock receipt", "860": "Order change", "865": "Order change acknowledgment", "990": "Load tender response", "846": "Inventory advice", "947": "Inventory adjustment", "940": "Warehouse shipping order", "945": "Warehouse shipping advice", "846, 947": "Warehouse inventory" };
  function wsDocName(c) { return WSDOCN[c] || ""; }
  var WSREF = { "850": "PO-", "855": "PO-", "860": "PO-", "856": "ASN-", "861": "RCV-", "810": "INV-", "820": "REM-", "812": "DM-", "753": "ROUTE-", "754": "ROUTE-", "204": "LOAD-", "214": "PRO-", "210": "FRT-", "944": "RCV-", "940": "WH-", "945": "WH-", "846": "INVRPT-" };
  var WSREJ = { "856": "Duplicate SSCC in carton loop", "856, 824": "Duplicate SSCC in carton loop", "810": "Unit price differs from the PO", "850": "Unknown ship-to location" };
  /* Business processes (Performance Monitor): one board per process in the client solution, plus the Solution document map.
     The board groups open EDI work by who must act next. The Retail pack adds its cases and a workflow lens. */
  var WSLENS = [];
  var ccBd = { dir: "All", doc: "", pt: "", q: "" }, ccBdTask = {};
  var BDFID = { "850": "PO", "855": "PR", "860": "PC", "865": "CA", "856": "SH", "810": "IN", "820": "RA", "812": "CD", "940": "OW", "945": "SW", "846": "IB", "753": "RF", "754": "RG", "204": "SM", "990": "GF", "214": "QM", "210": "IM", "861": "RC" };
  var BDWF = { "850": "orders", "855": "orders", "860": "orders", "865": "orders", "940": "orders", "856": "shipments", "945": "shipments", "846": "shipments", "753": "shipments", "754": "shipments", "204": "shipments", "214": "shipments", "210": "invoices", "810": "invoices", "820": "invoices", "812": "invoices", "861": "invoices" };
  function bdCols() {
    var r = ccRole() === "retailer";
    return [["us", "Waiting on us", "Documents we owe, must fix or must acknowledge"], ["pt", "Waiting on partner", "Documents and 997s owed to us"],
      ["rj", r ? "Rejected by us" : "Rejected by partner", r ? "824 application advice sent" : "824 application advice received"], ["cl", "Cleared today", "Closed since 00:00 ET"]];
  }
  function bdCase(id) { return typeof RTDATA !== "undefined" ? RTDATA.cases.filter(function (c) { return c.id === id; })[0] : null; }
  /* One view record per board item: the curated item merged with its finding or case */
  function bdItems(i) {
    var L = ((CCBOARD[ccRole()] || {})[i] || []).filter(function (c) { return !c.only || ccOn(c.only); });
    return L.map(function (c) {
      var f = c.f ? cxById(c.f) : null, rc = c.rt && ccOn("rt") ? bdCase(c.rt) : null, a = f ? CXAF[f.id] : null;
      return { c: c, k: c.k, f: f, rc: rc, partner: f ? f.partner : c.p, sev: f ? (f.sev === "c" ? "h" : "m") : rc ? (rc.severity === "critical" ? "h" : "m") : c.c === "cl" ? "" : c.sla && c.sla[2] > 100 ? "m" : "",
        agent: a ? a.n : c.ag || "", run: false, done: f ? ccDone[f.id] : ccBdTask[c.k] ? 1 : 0, val: f ? f.val : c.val || 0, act: f ? f.act : rc ? rc.roles[ccRole()].nextAction : c.act, appr: f ? f.appr : c.appr,
        wf: rc ? rc.workflow : BDWF[c.s] || "", mod: f ? (f.mod === "Integration Monitor" ? "IM" : "PM") : rc && c.only ? "RT" : c.ag === "Ivy" ? "IM" : "PM" };
    });
  }
  /* Sample transactions behind an item: control numbers, business reference, acknowledgment state. Deterministic per item. */
  function bdTx(v) {
    var c = v.c, code = c.d.split(",")[0], ref = WSREF[code === "997" || code === "824" ? c.s : code] || "DOC-", rows = [];
    var notSent = /^(Not sent|No \d{3} sent)/.test(c.ack || ""), notRecv = /^(Not received|No \d{3} received)/.test(c.ack || "");
    for (var j = 0; j < Math.min(5, c.n || 1); j++) {
      var seed = 0; for (var q = 0; q < c.k.length; q++) seed = seed * 31 + c.k.charCodeAt(q); seed = Math.abs(seed % 99991) + j * 977;
      var mins = 9 * 60 + 25 - j * 17 - seed % 13, none = notSent || notRecv;
      rows.push({ isa: none ? "" : String(100000000 + seed * 37).slice(-9), gs: none ? "" : String(1000 + seed % 9000), st: none ? "" : ("000" + (j + 1)).slice(-4),
        ref: ref + (10000 + (seed * 7) % 89999), tm: ("0" + Math.floor(mins / 60)).slice(-2) + ":" + ("0" + mins % 60).slice(-2) });
    }
    return rows;
  }
  function bdText(v) { return [v.c.t, v.partner, v.c.d, v.c.s, v.c.ack, v.agent].concat(bdTx(v).map(function (r) { return r.ref + " " + r.isa + " " + r.gs; })).join(" ").toLowerCase(); }
  function bdMatch(v) {
    var lens = ccOn("rt") && ccWsLens !== "all" ? ccWsLens : "";
    return (ccBd.dir === "All" || (ccBd.dir === "Inbound") === (v.c.dir === "In")) && (!ccBd.doc || v.c.s === ccBd.doc) && (!ccBd.pt || (v.partner || "").indexOf(ccBd.pt) >= 0) &&
      (!ccBd.q || bdText(v).indexOf(ccBd.q.toLowerCase()) >= 0) && (!lens || v.wf === lens);
  }
  function bdCard(v) {
    var c = v.c, code = c.d, ack = code === "997" || code === "824", nm = ack ? "for " + c.s + " " + (wsDocName(c.s) || "").toLowerCase() : wsDocName(code), sla = c.sla, over = sla && sla[2] > 100;
    var fu = v.f ? cxFu(v.f.id) : null, state = fu ? fu.st + (fuOverdue(fu) ? " · overdue" : fu.exp ? " · expect by " + fuT(fu.exp) : "") : v.done ? "Note sent to " + (v.appr || "the owner") : c.c === "cl" ? "Cleared " + c.at : c.pred ? "Predicted · usually handled by " + (v.appr || "") : v.appr ? "Usually handled by " + v.appr : "";
    return '<li><button type="button" class="bd-c' + (ccDr && ccDr[0] === "bd" && ccDr[1] === c.k ? " on" : "") + (v.done ? " dn" : "") + '" data-wsbd="' + c.k + '">' +
      '<span class="bd-h"><code>' + cxe(code) + '</code><span class="bd-dir">' + c.dir + '</span><span class="bd-dn">' + cxe(nm) + '</span>' + (v.sev === "h" ? cxSevChip("h") : "") + '</span>' +
      '<b class="bd-t">' + cxe(c.t) + '</b><span class="bd-p">' + cxe(v.partner || "") + (c.age ? ' · oldest ' + cxe(c.age) : "") + (v.val ? ' · $' + v.val.toLocaleString("en-US") : "") + '</span>' +
      (sla ? '<span class="bd-sla"><span>' + cxe(sla[0]) + '</span><em' + (over ? ' class="w"' : "") + '>' + cxe(sla[1]) + '</em></span><span class="cx-pb bd-pb' + (over ? " w" : "") + '"><i style="width:' + Math.min(100, sla[2]) + '%"></i></span>' : "") +
      (c.rej ? '<span class="bd-rj"><code>TED01 ' + c.rej[0] + '</code>' + cxe(c.rej[2]) + '</span>' : "") +
      '<span class="bd-m">' + (c.ack ? '<span>' + cxe(c.ack) + '</span>' : "") + (c.nt ? '<span>' + cxe(c.nt) + '</span>' : "") + '</span>' +
      '<span class="bd-f">' + (v.agent ? '<span class="cx-agi">' + cxe(v.agent.charAt(0)) + '</span>' + cxe(v.agent) : "") + (state ? '<em>' + cxe(state) + '</em>' : "") + '</span></button></li>';
  }
  function bdSum(list) { return list.reduce(function (a, v) { return a + (v.c.n || 0); }, 0); }
  CXS["ws-proc"] = function () {
    if (ccWsProc !== "sol" && ccSol().indexOf(+ccWsProc) < 0) ccWsProc = String(ccSol()[0]);
    var seg = '<nav class="ws-lens ws-pseg" aria-label="Business process"><span>Process</span>' + ccSol().map(function (i) { return '<button type="button" data-wsproc="' + i + '" aria-pressed="' + (ccWsProc === String(i)) + '">' + cxe(ccShort(i)) + '</button>'; }).join("") +
      '<button type="button" data-wsproc="sol" aria-pressed="' + (ccWsProc === "sol") + '">Solution</button></nav>';
    var h = wsHead("Business processes", "") + seg;
    if (ccWsProc === "sol") return h + '<p class="cx-lead">Business documents in the client solution, with their EDI and ERP equivalents.</p>' +
      cxCard("", '<table class="cx-tbl"><thead><tr><th>Business document</th><th>EDI documents</th><th>Typical ERP document (not monitored)</th><th>Processes</th></tr></thead><tbody>' + cxSol().map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td><td><code>' + r[1] + '</code></td><td>' + (r[2] || "None") + '</td><td>' + cxe(cxProcNames(r[3])) + '</td></tr>'; }).join("") + '</tbody></table>');
    var i = +ccWsProc, F = ccFlow(i), K = CCKPI[ccRole()][i], all = bdItems(i), vis = all.filter(bdMatch), cols = bdCols();
    var by = function (list, k) { return list.filter(function (v) { return v.c.c === k; }); };
    /* Document flow: one step per EDI document on Trading Grid; selecting a step filters the board */
    var steps = ccSteps(i).map(function (p) {
      var k = p[0], s = F.steps[k], code = ccStepDoc(p[1]).split(" / ")[0], first = code.split(",")[0].trim(), open = all.filter(function (v) { return v.c.s === first && v.c.c !== "cl"; }).length;
      return '<li><button type="button" data-wsbddoc="' + first + '" aria-pressed="' + (ccBd.doc === first) + '"><span class="bd-sh"><code>' + cxe(code) + '</code><span>' + s[0] + '</span></span><b>' + cxe(ccStepName(i, k)) + '</b>' +
        '<span class="bd-sn"><strong>' + s[1].toLocaleString("en-US") + '</strong> today</span><span class="bd-so' + (open ? " w" : "") + '">' + (open ? open + (open === 1 ? " open item" : " open items") : "No open items") + '</span></button></li>';
    }).join("");
    var pts = all.map(function (v) { return v.partner; }).join(", ").split(/,\s*/).filter(function (p, n, a) { return p && a.indexOf(p) === n && !/^\d/.test(p); }).sort();
    var lenses = ccOn("rt") ? WSLENS : [];
    var filt = '<div class="bd-fb"><span class="cx-seg" role="group" aria-label="Direction">' + ["All", "Inbound", "Outbound"].map(function (o) { return '<button type="button" data-wsbddir="' + o + '" aria-pressed="' + (ccBd.dir === o) + '">' + o + '</button>'; }).join("") + '</span>' +
      '<label class="bd-sel"><span>Partner</span><select data-wsbdpt aria-label="Partner"><option value="">All partners</option>' + pts.map(function (p) { return '<option' + (p === ccBd.pt ? " selected" : "") + '>' + cxe(p) + '</option>'; }).join("") + '</select></label>' +
      (lenses.length ? '<label class="bd-sel"><span>Retail workflow</span><select data-wsbdlens aria-label="Retail workflow"><option value="all">All workflows</option>' + lenses.map(function (l) { return '<option value="' + l.k + '"' + (ccWsLens === l.k ? " selected" : "") + '>' + cxe(l.n) + '</option>'; }).join("") + '</select></label>' : "") +
      '<label class="bd-q">' + ci("search") + '<input type="search" data-wsbdq value="' + cxe(ccBd.q) + '" placeholder="PO, ASN, invoice or control number" aria-label="Search references and control numbers"></label>' +
      (ccBd.dir !== "All" || ccBd.doc || ccBd.pt || ccBd.q || ccWsLens !== "all" && lenses.length ? '<button type="button" class="cx-lk" data-wsbdclr>Clear filters</button>' : "") + '<span class="cx-note bd-n">' + vis.length + ' of ' + all.length + ' items</span></div>';
    var board = '<div class="bd-b">' + cols.map(function (col) {
      var L = by(vis, col[0]), n = bdSum(L);
      return '<section class="bd-col" aria-label="' + col[1] + '"><header><h3>' + col[1] + '</h3><em>' + L.length + '</em></header><p>' + col[2] + (L.length ? ' · ' + n.toLocaleString("en-US") + (n === 1 ? " document" : " documents") : "") + '</p>' +
        '<ul>' + (L.length ? L.map(bdCard).join("") : '<li class="cx-empty">' + (all.some(function (v) { return v.c.c === col[0]; }) ? "No items match the filters." : col[0] === "rj" ? "No 824 rejections today." : "Nothing waiting.") + '</li>') + '</ul></section>';
    }).join("") + '</div>';
    var rules = CXR.filter(function (r) { return cxRuleP(r).indexOf(i) >= 0 && cxAgents().some(function (a) { return a.id === r[0]; }); });
    var k = function (c) { var L = by(all, c); return [L.length, bdSum(L)]; }, u = k("us"), p = k("pt"), rj = k("rj"), cl = k("cl");
    return h + '<div class="cx-fsum bd-k">' + cxKpi("Documents today", F.n.toLocaleString("en-US"), Math.round(100 * F.ok / F.n) + "% on track") +
      cxKpi("Waiting on us", u[1].toLocaleString("en-US"), u[0] + " items") + cxKpi("Waiting on partner", p[1].toLocaleString("en-US"), p[0] + " items") +
      cxKpi(cols[2][1], rj[1].toLocaleString("en-US"), rj[0] + " items · 824") + cxKpi(cxe(K[0]), K[1], "Last 30 days") + '</div>' +
      cxCard("Document flow", '<ol class="bd-flow">' + steps + '</ol>', "bd-fc", '<span class="cx-note">EDI documents on Trading Grid. Select a document to filter the board.</span>') +
      filt + board +
      cxCard("Rules on this process", '<ul class="cx-agr bd-rules">' + rules.map(function (r) { var a = CXA.filter(function (x) { return x.id === r[0]; })[0]; return '<li>' + ci("check") + cxe(r[1]) + ' <small class="ws-mu">' + a.n + '</small></li>'; }).join("") + '</ul>', "", cxGoBtn("Rules", "cfg"));
  };
  /* Item drawer: control numbers, acknowledgment and application advice detail, segments, and the next action */
  function bdDrawer() {
    var i = +ccWsProc, v = bdItems(i).filter(function (x) { return x.c.k === ccDr[1]; })[0];
    if (!v) { ccDr = null; return ""; }
    var c = v.c, col = bdCols().filter(function (x) { return x[0] === c.c; })[0], code = c.d.split(",")[0], rows = bdTx(v), out = c.dir === "Out";
    var is997 = code === "997", is824 = code === "824", missing = /^(No |Not )/.test(c.ack || ""), fid = BDFID[c.s] || "IN";
    var ackCol = is824 ? "OTI01" : is997 || c.c === "pt" ? "AK9" : "997";
    var tx = '<table class="cx-tbl bd-tx"><thead><tr><th>ISA13</th><th>GS06</th><th>ST02</th><th>Reference</th><th>Time</th><th>' + ackCol + '</th></tr></thead><tbody>' + rows.map(function (r) {
      var st = is824 ? "TR" : c.c === "cl" ? "A" : missing ? "None" : "A";
      return '<tr><td>' + (r.isa ? '<code>' + r.isa + '</code>' : "Not sent") + '</td><td>' + (r.gs ? '<code>' + r.gs + '</code>' : "") + '</td><td>' + (r.st ? '<code>' + r.st + '</code>' : "") + '</td><td>' + r.ref + '</td><td>' + r.tm + '</td><td>' + st + '</td></tr>'; }).join("") +
      '</tbody></table><p class="cx-note">' + (c.n > 5 ? "First 5 of " + c.n.toLocaleString("en-US") + " · " : "") + cxe(c.d) + ' ' + (out ? "outbound" : "inbound") + ' · <button type="button" class="cx-lk" data-wstgi>Open in TG Insights</button></p>';
    var r0 = rows[0], seg = "";
    if (is824) seg = "ST*824*0001~\nBGN*00*" + r0.ref.replace(/\D/g, "") + "*20261024~\nOTI*TR*" + (c.s === "856" ? "SI" : "IV") + "*" + r0.ref + "~\nTED*" + c.rej[0] + "*" + c.rej[2].toUpperCase() + "~\nSE*5*0001~";
    else if (is997 && missing) seg = "Expected, not " + (out ? "sent" : "received") + ":\nST*997*0001~\nAK1*" + fid + "*" + (r0.gs || "4521") + "~\nAK9*A*" + Math.min(5, c.n) + "*" + Math.min(5, c.n) + "*" + Math.min(5, c.n) + "~\nSE*4*0001~";
    var dl = [["Partner", cxe(v.partner || "")], ["Document", '<code>' + cxe(c.d) + '</code> ' + (is997 || is824 ? (is997 ? "Functional acknowledgment" : "Application advice") + ' for the ' + c.s + ' ' + cxe((wsDocName(c.s) || "").toLowerCase()) : cxe(wsDocName(code))) + ', ' + (out ? "outbound" : "inbound")],
      c.sla ? ["Service level", cxe(c.sla[0]) + ' · ' + cxe(c.sla[1])] : null, c.ack ? ["Acknowledgment", cxe(c.ack)] : null, c.rej ? ["Application advice", 'OTI01 TR · TED01 ' + c.rej[0] + ' ' + cxe(c.rej[1]) + ' · ' + cxe(c.rej[2])] : null,
      v.agent ? ["Agent", cxe(v.agent)] : null, v.val ? ["Value at risk", "$" + v.val.toLocaleString("en-US")] : null, c.age ? ["Oldest open", cxe(c.age)] : c.at ? ["Cleared", "Today, " + c.at] : null].filter(Boolean);
    var foot = v.f ? '<button type="button" class="cx-btn p" data-cxf="' + v.f.id + '">Open follow-up</button>' :
      v.rc ? '<button type="button" class="cx-btn p" data-rt-case="' + cxe(v.rc.id) + '">Open case</button>' : c.c !== "cl" && v.appr ? (v.done ? '<span class="cx-done">' + ci("ok") + 'Note sent to ' + cxe(v.appr) + '</span>' : '<button type="button" class="cx-btn p" data-wsbdtask="' + c.k + '">Send note to ' + cxe(v.appr) + '</button>') : "";
    var h = '<header><span><p>' + cxe(ccShort(i)) + ' · ' + col[1] + '</p><h3>' + cxe(c.t) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
      '<p class="cx-chipsr">' + (v.sev === "h" ? cxSevChip("h") : v.sev === "m" ? cxSevChip("m") : "") + cxTag(v.mod) + (c.pred ? '<span class="cx-tg">Prediction</span>' : "") + '</p>' +
      '<dl class="cx-dl">' + dl.map(function (d) { return '<div><dt>' + d[0] + '</dt><dd>' + d[1] + '</dd></div>'; }).join("") + '</dl>' +
      '<h4>Transactions</h4>' + tx + (seg ? '<h4>' + (is824 ? "824 segments" : "997 segments") + '</h4><pre class="bd-x12">' + cxe(seg) + '</pre>' : "") +
      (v.act ? '<h4>Recommended action</h4><div class="cx-rec">' + ci("bot") + '<span>' + cxe(v.act) + (v.appr ? '<small>Approver: ' + cxe(v.appr) + '</small>' : "") + '</span></div>' : "") +
      '</div>' + (foot ? '<div class="cx-ft">' + foot + '</div>' : "");
    return '<div class="cx-scrim" data-cxclose></div><aside class="cx-dr bd-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  }

  /* Dashboards: Overview tabs. Prebuilt by package, plus custom dashboards from the component library */
  var WSPRE = [{ k: "pm", n: function () { return ccRole() === "retailer" ? "Supplier scorecard" : ccOn("rt") ? "Scorecard with retail accounts" : "Scorecard with customers"; }, t: "pm", h: function () { return cxScorecard(); } }];
  function wsDashTabs() {
    var W = wsLoad();
    return WSPRE.filter(function (d) { return ccOn(d.t); }).map(function (d) { return { key: "p:" + d.k, n: typeof d.n === "function" ? d.n() : d.n, pre: d }; })
      .concat(wsIdx(W.dashboards).map(function (p) { return { key: "c:" + p[1], n: p[0].n, dash: p[0], ix: p[1] }; }));
  }
  function wsCurDash() { var tabs = wsDashTabs(); return tabs.filter(function (t) { return t.key === ccWsDash; })[0] || tabs[0]; }
  CXS["ws-dash"] = function () {
    var cur = wsCurDash(), comps = cxComps();
    var pick = comps.map(function (c) { return '<label class="ws-ck"><input type="checkbox" data-wscomp="' + c.o + '"><span>' + c.t + '</span>' + cxTag(c.mod) + '</label>'; }).join("");
    var h = cxOvHead() + wsForm("dash", "New dashboard", wsField("Name", '<input type="text" data-wsname placeholder="Dashboard name">') + '<div class="ws-cks">' + pick + '</div>', "Save dashboard");
    if (!cur) return h + '<p class="cx-empty">No dashboards yet.</p>';
    if (cur.pre) return h + cur.pre.h();
    var list = cur.dash.c.map(function (o) { return comps.filter(function (c) { return c.o === o; })[0]; }).filter(Boolean);
    return h + '<div class="ws-bar"><span class="cx-note">' + list.length + ' components</span><button type="button" class="cx-btn" data-wsdel="dashboards:' + cur.ix + '">' + ci("trash") + 'Delete dashboard</button></div><div class="cx-dg">' + list.map(function (c) { return cxDc(c); }).join("") + '</div>';
  };

  /* Reports */
  function wsList(cols, rows) { return '<table class="cx-tbl"><thead><tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join("") + '</tr></thead><tbody>' + rows.join("") + (rows.length ? "" : '<tr><td colspan="' + cols.length + '" class="cx-empty">None yet.</td></tr>') + '</tbody></table>'; }
  CXS["ws-rep"] = function () {
    var W = wsLoad();
    return wsHead("Reports", "Scheduled reports from the data in your packages.", wsNew("rep", "Create report")) +
      wsForm("rep", "New report", wsField("Name", '<input type="text" data-wsname placeholder="Report name">') + wsField("Content", wsSel("data-wss", wsOpts("rep"))) +
        wsField("Format", wsSel("data-wsf", ["PDF", "CSV", "Excel", "Email"])) + wsField("Schedule", wsSel("data-wsw", ["Daily, 06:30", "Weekly, Monday 07:00", "Monthly, 1st 07:00"])) + wsField("Recipients", '<input type="text" data-wsr placeholder="Team or email">'), "Save report") +
      cxCard("Scheduled reports", wsList(["Report", "Content", "Format", "Schedule", "Recipients", "Last run", ""], wsIdx(W.reports).map(function (p) { var r = p[0], k = p[1];
        return '<tr><td><b>' + cxe(r.n) + '</b></td><td>' + cxe(r.s) + '</td><td>' + cxe(r.f) + '</td><td>' + cxe(r.w) + '</td><td>' + cxe(r.r) + '</td><td>' + cxe(r.last) + '</td><td><div class="ws-ra"><button type="button" class="cx-btn" data-wsrun="' + k + '">Run now</button><button type="button" class="cx-ic" data-wsdel="reports:' + k + '" aria-label="Delete ' + cxe(r.n) + '">' + ci("trash") + '</button></div></td></tr>'; })));
  };

  /* Notifications */
  CXS["ws-not"] = function () {
    var W = wsLoad();
    return wsHead("Notifications", "Who is told what, and on which channel.", wsNew("not", "Create notification")) +
      wsForm("not", "New notification", wsField("When", wsSel("data-wst", wsOpts("not"))) +
        wsField("Channel", wsSel("data-wsc", ["Email", "Microsoft Teams", "In-app", "Email, Microsoft Teams"])) + wsField("Recipients", '<input type="text" data-wsr placeholder="Team or email">'), "Save notification") +
      cxCard("Notification rules", wsList(["When", "Channel", "Recipients", "Status", ""], wsIdx(W.notifs).map(function (p) { var r = p[0], k = p[1];
        return '<tr><td><b>' + cxe(r.t) + '</b></td><td>' + cxe(r.ch) + '</td><td>' + cxe(r.r) + '</td><td><button type="button" class="ws-sw" role="switch" aria-checked="' + !!r.on + '" data-wstog="' + k + '"><i></i>' + (r.on ? "On" : "Off") + '</button></td><td><button type="button" class="cx-ic" data-wsdel="notifs:' + k + '" aria-label="Delete">' + ci("trash") + '</button></td></tr>'; })));
  };

  /* Tasks and reminders */
  CXS["ws-task"] = function () {
    var W = wsLoad(), its = ccItems(), open = its.filter(function (i) { return !i.done; });
    return wsHead("Tasks and reminders", "Follow-ups for the team, linked to findings.", '<span class="ws-hb">' + wsNew("task", "Create task") + wsNew("rem", "Create reminder") + '</span>') +
      wsForm("task", "New task", wsField("Task", '<input type="text" data-wsname placeholder="What needs to happen">') + wsField("Owner", wsSel("data-wso", ["Alex Morgan", "Dana Ortiz", "Priya Nair", "Sam Lee", "Jordan Lee"])) +
        wsField("Due", '<input type="date" data-wsd value="2026-10-26">') + wsField("Finding", '<select data-wsk><option value="">None</option>' + open.map(function (i) { return '<option value="' + i.key + '">' + cxe(i.title) + '</option>'; }).join("") + '</select>'), "Save task") +
      wsForm("rem", "New reminder", wsField("Reminder", '<input type="text" data-wsname placeholder="Remind me to">') + wsField("When", '<input type="datetime-local" data-wsd value="2026-10-24T15:00">'), "Save reminder") +
      '<div class="cx-g21">' + cxCard("Tasks", '<ul class="ws-tl">' + wsIdx(W.tasks).map(function (p) { var t = p[0], k = p[1];
        var it = its.filter(function (i) { return i.key === t.k; })[0];
        return '<li class="' + (t.done ? "dn" : "") + '"><button type="button" class="ws-cb" role="checkbox" aria-checked="' + !!t.done + '" data-wsdone="' + k + '" aria-label="Mark done">' + (t.done ? ci("ok") : "") + '</button><div><b>' + cxe(t.t) + '</b><small>' + cxe(t.o) + ' · Due ' + cxe(t.d) + '</small>' + (it ? cxItemLink(it) : "") + '</div><button type="button" class="cx-ic" data-wsdel="tasks:' + k + '" aria-label="Delete task">' + ci("trash") + '</button></li>'; }).join("") + '</ul>') +
      cxCard("Reminders", '<ul class="ws-tl">' + wsIdx(W.reminders).map(function (p) { var r = p[0], k = p[1]; return '<li><span class="ws-ri">' + ci("clock") + '</span><div><b>' + cxe(r.t) + '</b><small>' + cxe(r.w) + '</small></div><button type="button" class="cx-ic" data-wsdel="reminders:' + k + '" aria-label="Delete reminder">' + ci("trash") + '</button></li>'; }).join("") + '</ul>') + '</div>';
  };

  /* Agents: Ivy with Integration Monitor, the others with Performance Monitor; Build your own agent links to Aviator Studio */
  CXS["ws-agents"] = function () {
    return wsHead("Agents", "Agents watch documents" + (ccOn("pm") ? " and processes" : "") + " on the network, raise findings and suggest the next step. People send every notice.",
      '<button type="button" class="cx-btn p ws-studio" data-wsstudio>' + ci("spark") + 'Build your own agent' + ci("ext") + '</button>') + '<div class="cx-ag">' + cxAgents().map(function (a) {
      var rs = CXR.filter(function (r) { return r[0] === a.id; }), op = a.f.filter(function (id) { return !ccDone[id]; });
      return '<section class="cx-card"><header class="cx-agh"><span class="cx-agi">' + a.n[0] + '</span><div><h3>' + a.n + '</h3><span>' + a.r + '</span></div>' + cxTag(a.t.toUpperCase()) + '</header><p class="cx-sub">' + a.d + '</p>' +
        '<dl class="cx-dl"><div><dt>' + (a.t === "im" ? "Checks" : "Rules") + '</dt><dd>' + rs.length + '</dd></div><div><dt>Open findings</dt><dd>' + op.length + '</dd></div><div><dt>Notices</dt><dd>Sent by people</dd></div></dl></section>';
    }).join("") + '<button type="button" class="cx-card ws-new-agent" data-wsstudio>' + ci("plus") + '<b>Build your own agent</b><span>Design, test and publish an agent in Aviator Studio.</span><em>Open Aviator Studio' + ci("ext") + '</em></button></div>';
  };

  /* Rule wizard, as in the Performance Monitor prototype */
  var RWSTEPS = ["Job", "Scope", "Expected behavior", "Deviation", "Reference data", "Budget", "Test", "Confirm"];
  var RWJOBS = [["nora", "Catch wrong fields in single documents", "Wrong codes, off-contract prices, missing or invalid values on one document at a time.", "Required field present and valid", "percent of documents failing", 1, 3],
    ["liz", "Check multi-document business processes", "Missing steps, out-of-sequence documents or premature steps across a PO, ASN and invoice.", "Documents follow the expected sequence", "cohorts out of sequence", 5, 20],
    ["lex", "Watch timing and SLAs between transactions", "Late acknowledgments, missed ship windows, or any flow running behind its expected cadence.", "Response within the agreed window", "minutes late", 30, 120],
    ["reese", "Reconcile content and value across documents", "Line-level item, quantity, UOM and price, and invoice totals against the PO and the amount billed.", "Values match across documents", "percent variance", 0.5, 2]
  ];
  function rwJob() { return RWJOBS.filter(function (j) { return j[0] === ccRw.agent; })[0]; }
  function rwStep() {
    var s = ccRw.step, j = rwJob(), procs = ccSol().map(function (i) { return ccProc(i).n; });
    if (s === 0) return '<h4 class="rw-q">What do you want an agent to do?</h4><p class="cx-sub">Each agent has a different job. Pick the one that matches what you need to catch.</p><div class="rw-jobs">' + RWJOBS.map(function (x) {
      var a = CXA.filter(function (y) { return y.id === x[0]; })[0];
      return '<button type="button" class="rw-job" data-rwagent="' + x[0] + '" aria-pressed="' + (ccRw.agent === x[0]) + '"><b>' + x[1] + '</b><span>' + x[2] + '</span><em><i class="cx-agi">' + a.n[0] + '</i>' + a.n + ' · ' + a.r + '</em></button>'; }).join("") + '</div>';
    if (s === 1) return '<h4 class="rw-q">Where should the rule apply?</h4><div class="ws-fg">' + wsField("Business process", wsSel("data-rw=proc", procs, ccRw.proc)) +
      wsField("Partners", wsSel("data-rw=partner", ["All partners"].concat(cxPartners().map(function (p) { return p[0]; })), ccRw.partner)) + wsField("Document", wsSel("data-rw=doc", cxSol().map(function (r) { return r[0] + " (" + r[1].split(",")[0] + ")"; }), ccRw.doc)) + '</div>';
    if (s === 2) return '<h4 class="rw-q">What should happen?</h4><div class="ws-fg">' + wsField("Rule name", '<input type="text" data-rw="name" value="' + cxe(ccRw.name) + '">') + wsField("Expected behavior", '<textarea data-rw="expect" rows="3">' + cxe(ccRw.expect) + '</textarea>') + '</div>';
    if (s === 3) return '<h4 class="rw-q">When is it a deviation?</h4><div class="ws-fg">' + wsField("Medium severity from (" + j[4] + ")", '<input type="number" step="any" min="0" data-rw="med" value="' + ccRw.med + '">') +
      wsField("High severity from (" + j[4] + ")", '<input type="number" step="any" min="0" data-rw="high" value="' + ccRw.high + '">') + '</div>';
    if (s === 4) return '<h4 class="rw-q">Add reference data</h4><p class="cx-sub">Optional. Give the agent a list to check against.</p><div class="rw-refs">' + ["None", "Carrier codes", "SKU list", "SLA grace periods"].map(function (r) {
      return '<button type="button" class="rw-ref" data-rwref="' + r + '" aria-pressed="' + (ccRw.ref === r) + '">' + r + '</button>'; }).join("") + '</div>' + wsField("Or upload a file (CSV or XLSX)", '<input type="file" accept=".csv,.xlsx" data-rwfile>') + (ccRw.file ? '<p class="cx-sub">Attached: ' + cxe(ccRw.file) + '</p>' : "");
    if (s === 5) return '<h4 class="rw-q">Set a budget</h4><div class="ws-fg">' + wsField("Inspections per month", '<input type="number" min="1000" step="1000" data-rw="budget" value="' + ccRw.budget + '">') +
      wsField("When the budget is reached", wsSel("data-rw=onb", ["Pause the rule and notify", "Notify and continue"], ccRw.onb)) + '</div>';
    if (s === 6) {
      var t = ccRw.test;
      return '<h4 class="rw-q">Test against recent transactions</h4><p class="cx-sub">Runs the rule on the last 7 days of ' + cxe(ccRw.proc) + ' documents. Nothing is changed.</p><button type="button" class="cx-btn p" data-rwtest>Run test</button>' +
        (t ? '<div class="cx-k3 rw-tr">' + cxKpi("Inspected", t.n.toLocaleString("en-US"), "Last 7 days") + cxKpi("Deviations", t.d, t.h + " high severity") + cxKpi("Conformance", t.c.toFixed(1) + "%", "Projected") + '</div>' : "");
    }
    return '<h4 class="rw-q">Confirm and deploy</h4><dl class="rt-kv">' + [["Agent", CXA.filter(function (a) { return a.id === ccRw.agent; })[0].n + " · " + j[1]], ["Rule", ccRw.name], ["Scope", ccRw.proc + " · " + ccRw.partner + " · " + ccRw.doc], ["Expected behavior", ccRw.expect],
      ["Deviation", "Medium from " + ccRw.med + ", high from " + ccRw.high + " " + j[4]], ["Reference data", ccRw.file || ccRw.ref], ["Budget", Number(ccRw.budget).toLocaleString("en-US") + " inspections per month. " + ccRw.onb], ["Test", ccRw.test ? ccRw.test.d + " deviations in " + ccRw.test.n.toLocaleString("en-US") + " transactions" : "Not run"]].map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + cxe(r[1]) + '</dd></div>'; }).join("") + '</dl>';
  }
  function rwDrawer() {
    var s = ccRw.step, j = rwJob();
    return '<div class="cx-scrim" data-rwclose></div><aside class="cx-dr rw" role="dialog" aria-modal="true" aria-label="Create rule"><header><span><p>Step ' + (s + 1) + ' of 8' + (j ? ' · ' + CXA.filter(function (a) { return a.id === j[0]; })[0].n : "") + '</p><h3>Create rule</h3></span><button type="button" class="cx-ic" data-rwclose aria-label="Close">' + ci("x") + '</button></header>' +
      '<ol class="rw-steps">' + RWSTEPS.map(function (t, k) { return '<li class="' + (k < s ? "dn" : k === s ? "on" : "") + '"><i>' + (k < s ? "✓" : k + 1) + '</i>' + t + '</li>'; }).join("") + '</ol><div class="cx-db">' + rwStep() + '</div>' +
      '<div class="cx-ft"><button type="button" class="cx-btn" data-rwclose>Cancel</button><span class="ws-sp"></span>' + (s ? '<button type="button" class="cx-btn" data-rwgo="-1">Back</button>' : "") +
      (s < 7 ? '<button type="button" class="cx-btn p" data-rwgo="1"' + (s === 6 && !ccRw.test ? " disabled" : "") + '>Continue</button>' : '<button type="button" class="cx-btn p" data-rwdeploy>Deploy rule</button>') + '</div></aside>';
  }
  function rwRead() {
    cx.querySelectorAll("[data-rw]").forEach(function (el) { ccRw[el.getAttribute("data-rw")] = el.value; });
  }
  function rwPick(agent) {
    var j = RWJOBS.filter(function (x) { return x[0] === agent; })[0];
    ccRw.agent = agent; ccRw.name = j[3]; ccRw.expect = j[3] + " for every document in scope."; ccRw.med = j[5]; ccRw.high = j[6]; ccRw.test = null;
  }

  /* Cross-references: item and location identifiers that EDI documents carry, mapped to the client's own codes.
     Sources are 832 catalogs and 816 location lists seen on Trading Grid, file upload, and manual mapping. The item master stays in the client's ERP. Illustrative. */
  var ccXr = {}, ccXrQ = "";
  function xrGtin(b) { var s = 0; for (var i = 0; i < 13; i++) s += +b.charAt(12 - i) * (i % 2 ? 1 : 3); return b + (10 - s % 10) % 10; }
  /* [GTIN base (13 digits), partner item number, our item number, description, partner, source, updated] */
  var XRI = {
    supplier: [["0008451230001", "418820", "NB-30001", "Hydrating serum 30 ml", "Northfield Stores", "832", "12 Oct"], ["0008451230014", "418836", "NB-30014", "Daily SPF 50 lotion", "Northfield Stores", "832", "12 Oct"],
      ["0008451230022", "418851", "NB-30022", "Gentle foaming cleanser", "Northfield Stores", "832", "12 Oct"], ["0008451230035", "418867", "NB-30035", "Retinol night cream", "Northfield Stores", "832", "12 Oct"],
      ["0008451230001", "HG-77102", "NB-30001", "Hydrating serum 30 ml", "Harbor Grocers", "Upload", "3 Oct"], ["0008451230014", "HG-77118", "NB-30014", "Daily SPF 50 lotion", "Harbor Grocers", "Upload", "3 Oct"],
      ["0008451230041", "WL-2260417", "NB-30041", "Vitamin C brightening gel", "Westline Home", "832", "8 Oct"], ["0008451230057", "B0D7K2XQ4M", "NB-30057", "Barrier repair moisturizer", "Brightway Marketplace", "Manual", "21 Oct"]],
    retailer: [["0008451230001", "NB-30001", "418820", "Hydrating serum 30 ml", "Nuvori Beauty", "832", "12 Oct"], ["0008451230014", "NB-30014", "418836", "Daily SPF 50 lotion", "Nuvori Beauty", "832", "12 Oct"],
      ["0007312640088", "SL-1088", "522104", "Shea body butter 200 ml", "Solara Personal Care", "832", "19 Oct"], ["0007312640091", "SL-1091", "522117", "Unscented body wash 500 ml", "Solara Personal Care", "832", "19 Oct"],
      ["0006620410215", "TW-215", "610482", "Linen spray 250 ml", "Tidewell Home", "Upload", "6 Oct"], ["0005194470033", "FE-0033", "733019", "Bamboo toothbrush, 4 pack", "Fieldstone Essentials", "Manual", "22 Oct"]]
  };
  /* Identifiers seen in documents with no mapping: [key, document, partner, partner item number, GTIN base or "", first seen, documents, suggested item number or ""] */
  var XRU = {
    supplier: [["u1", "852", "Harbor Grocers", "HG-77131", "0008451230022", "Mon 19 Oct", 386, "NB-30022"], ["u2", "850", "Westline Home", "WL-2260433", "", "Thu 22 Oct", 4, ""],
      ["u3", "852", "Cedar & Coast", "CC-55190", "0008451230035", "Mon 19 Oct", 388, "NB-30035"]],
    retailer: [["u4", "856", "Fieldstone Essentials", "FE-0041", "0005194470041", "Today 08:20", 2, ""], ["u5", "810", "Solara Personal Care", "SL-1102", "0007312640102", "Fri 23 Oct", 6, ""]]
  };
  /* Locations: [partner, N1 code, type, name, city, source, updated] */
  var XRL = [["Northfield Stores", "0041", "Store", "Store 41", "Columbus OH", "816", "1 Oct"], ["Northfield Stores", "0012", "Store", "Store 12", "Dayton OH", "816", "1 Oct"],
    ["Northfield Stores", "DC-04", "Distribution center", "Groveport DC", "Groveport OH", "816", "1 Oct"], ["Harbor Grocers", "HG-118", "Store", "Store 118", "Erie PA", "Upload", "3 Oct"],
    ["Brightway Marketplace", "BW-DC07", "Distribution center", "Fulfillment center 07", "Joliet IL", "Manual", "Today 07:38"]];
  function xrOurs() { var seen = {}; return XRI[ccRole()].filter(function (r) { if (seen[r[2]]) return false; seen[r[2]] = 1; return true; }); }
  function cxXref() {
    var r = ccRole() === "retailer", P = r ? "Supplier" : ccOn("rt") ? "Retailer" : "Partner", items = XRI[ccRole()], un = XRU[ccRole()].filter(function (u) { return !ccXr[u[0]]; }), done = XRU[ccRole()].filter(function (u) { return ccXr[u[0]]; });
    var q = ccXrQ.toLowerCase(), rows = items.concat(done.map(function (u) { return [u[4] || "", u[3], ccXr[u[0]], (xrOurs().filter(function (o) { return o[2] === ccXr[u[0]]; })[0] || [])[3] || "", u[2], "Manual", "Just now"]; }))
      .filter(function (x) { return !q || x.join(" ").toLowerCase().indexOf(q) >= 0; });
    var sel = function (u) { return '<select data-xrsel="' + u[0] + '" aria-label="Item for ' + cxe(u[3]) + '"><option value="">Select item</option>' + xrOurs().map(function (o) { return '<option value="' + o[2] + '"' + (o[2] === u[7] ? " selected" : "") + '>' + o[2] + ' · ' + cxe(o[3]) + '</option>'; }).join("") + '</select>'; };
    var h = '<div class="cx-fsum ws-pk">' + cxKpi("Items mapped", r ? "2,318" : "1,184", "Across " + (r ? "64 suppliers" : "6 partners")) + cxKpi("Unmatched identifiers", un.length, un.length ? "Documents waiting on a mapping" : "All identifiers mapped") +
      (r ? "" : cxKpi("Locations mapped", "4,183", "Stores and distribution centers")) + cxKpi("Learned from 832", r ? "2,040" : "1,032", "Last catalog " + (r ? "19 Oct" : "12 Oct")) + '</div>';
    h += cxCard("Unmatched identifiers", un.length ? '<table class="cx-tbl xr-u"><thead><tr><th>Seen in</th><th>' + P + ' item number</th><th>GTIN</th><th>First seen</th><th class="n">Documents</th><th>Map to</th><th></th></tr></thead><tbody>' + un.map(function (u) {
        return '<tr><td><code>' + u[1] + '</code> ' + cxe(u[2]) + '</td><td><code>' + cxe(u[3]) + '</code></td><td>' + (u[4] ? '<code>' + xrGtin(u[4]) + '</code>' : '<span class="ws-mu">Not sent</span>') + '</td><td>' + cxe(u[5]) + '</td><td class="n">' + u[6].toLocaleString("en-US") + '</td><td>' + sel(u) + (u[7] ? '<small class="ws-mu xr-s">Suggested: GTIN match</small>' : "") + '</td><td><button type="button" class="cx-btn" data-xrmap="' + u[0] + '">Save mapping</button></td></tr>'; }).join("") + '</tbody></table>'
      : '<p class="cx-empty">All identifiers in recent documents are mapped.</p>', "", '<span class="cx-note">From inbound documents in the last 7 days</span>');
    h += cxCard("Item cross-reference", '<div class="xr-bar"><label class="bd-q">' + ci("search") + '<input type="search" data-xrq value="' + cxe(ccXrQ) + '" placeholder="GTIN, item number or description" aria-label="Search items"></label><span class="cx-note">' + rows.length + ' of ' + (r ? "2,318" : "1,184") + ' shown</span></div>' +
      '<table class="cx-tbl"><thead><tr><th>GTIN</th><th>' + P + ' item number</th><th>Our item number</th><th>Description</th><th>' + P + '</th><th>Source</th><th>Updated</th></tr></thead><tbody>' + rows.map(function (x) {
        return '<tr><td>' + (x[0] ? '<code>' + xrGtin(x[0]) + '</code>' : "") + '</td><td><code>' + cxe(x[1]) + '</code></td><td><code>' + cxe(x[2]) + '</code></td><td>' + cxe(x[3]) + '</td><td>' + cxe(x[4]) + '</td><td>' + (x[5] === "832" ? "832 catalog" : x[5]) + '</td><td>' + cxe(x[6]) + '</td></tr>'; }).join("") + (rows.length ? "" : '<tr><td colspan="7" class="cx-empty">No items match the search.</td></tr>') + '</tbody></table>',
      "", '<span class="ws-hb"><button type="button" class="cx-btn" data-xrfile>Download template</button><button type="button" class="cx-btn p" data-xrfile>' + ci("plus") + 'Upload file</button></span>');
    if (!r) h += cxCard("Location cross-reference", '<table class="cx-tbl"><thead><tr><th>' + P + '</th><th>Location code (N104)</th><th>Type</th><th>Name</th><th>City</th><th>Source</th><th>Updated</th></tr></thead><tbody>' + XRL.map(function (l) {
        return '<tr><td>' + cxe(l[0]) + '</td><td><code>' + cxe(l[1]) + '</code></td><td>' + l[2] + '</td><td>' + cxe(l[3]) + '</td><td>' + cxe(l[4]) + '</td><td>' + (l[5] === "816" ? "816 location list" : l[5]) + '</td><td>' + cxe(l[6]) + '</td></tr>'; }).join("") + '</tbody></table>',
      "", '<span class="cx-note">Store and ship-to codes in 850, 856 and 852</span><button type="button" class="cx-btn p" data-xrfile>' + ci("plus") + 'Upload file</button>');
    return h + '<p class="cx-note">Item and location masters stay in your ERP. Command Center keeps the mappings that EDI documents need.</p>';
  }

  /* Shell hooks */
  var wsBaseDrawer = cxDrawer;
  cxDrawer = function () { return ccDr && ccDr[0] === "rule" && ccRw ? rwDrawer() : ccDr && ccDr[0] === "bd" ? bdDrawer() : wsBaseDrawer(); };
  var wsBaseRender = cxRender;
  cxRender = function () {
    wsLoad(); wsBaseRender();
    if (ccToastT) cx.insertAdjacentHTML("beforeend", '<div class="cx-toast" role="status">' + ci("ok") + '<span>' + cxe(ccToastT) + '</span></div>');
    var dr = cx.querySelector(".cx-dr.rw"); if (dr) { var f = dr.querySelector(".cx-db input, .cx-db select, .cx-db textarea, .cx-db button"); if (f && document.activeElement === document.body) f.focus({ preventScroll: true }); }
  };
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-xrmap],[data-xrfile],[data-wsproc],[data-wsbd],[data-wsbddoc],[data-wsbddir],[data-wsbdclr],[data-wsbdtask],[data-wstgi],[data-wslens],[data-wsform],[data-wssave],[data-wsdash],[data-wsdel],[data-wsrun],[data-wstog],[data-wsdone],[data-wsstudio],[data-cxwsproc],[data-rwnew],[data-rwclose],[data-rwgo],[data-rwagent],[data-rwref],[data-rwtest],[data-rwdeploy]"); if (!b) return;
    var W = wsLoad(), v;
    if (b.hasAttribute("data-xrmap")) { var xs = cx.querySelector('[data-xrsel="' + b.getAttribute("data-xrmap") + '"]'); if (!xs || !xs.value) { cxToast("Select an item, then save the mapping."); cxRender(); return; } ccXr[b.getAttribute("data-xrmap")] = xs.value; cxToast("Mapping saved. It applies to documents received from now on. Find earlier failures in TG Insights."); }
    else if (b.hasAttribute("data-xrfile")) { cxToast("File upload is not connected in this prototype."); }
    else if (b.hasAttribute("data-wsproc")) { ccWsProc = b.getAttribute("data-wsproc"); ccBd = { dir: "All", doc: "", pt: "", q: "" }; }
    else if (b.hasAttribute("data-wsbd")) { ccDr = ["bd", b.getAttribute("data-wsbd")]; }
    else if (b.hasAttribute("data-wsbddoc")) { v = b.getAttribute("data-wsbddoc"); ccBd.doc = ccBd.doc === v ? "" : v; }
    else if (b.hasAttribute("data-wsbddir")) { ccBd.dir = b.getAttribute("data-wsbddir"); }
    else if (b.hasAttribute("data-wsbdclr")) { ccBd = { dir: "All", doc: "", pt: "", q: "" }; ccWsLens = "all"; }
    else if (b.hasAttribute("data-wsbdtask")) { v = bdItems(+ccWsProc).filter(function (x) { return x.c.k === b.getAttribute("data-wsbdtask"); })[0]; ccBdTask[v.c.k] = 1; cxToast("Note sent to " + v.appr + " with the evidence. Command Center watches for the documents."); }
    else if (b.hasAttribute("data-wstgi")) { cxToast("TG Insights opens with these transactions in the product. It is not connected in this prototype."); }
    else if (b.hasAttribute("data-cxwsproc")) { ccWsProc = b.getAttribute("data-cxwsproc"); cxGo("ws-proc"); return; }
    else if (b.hasAttribute("data-wsform")) { ccWsForm = b.getAttribute("data-wsform"); }
    else if (b.hasAttribute("data-wsdash")) { ccWsDash = b.getAttribute("data-wsdash"); }
    else if (b.hasAttribute("data-wslens")) { ccWsLens = b.getAttribute("data-wslens"); }
    else if (b.hasAttribute("data-wsstudio")) { cxToast("Aviator Studio opens in the product. It is not connected in this prototype."); }
    else if (b.hasAttribute("data-wstog")) { v = W.notifs[+b.getAttribute("data-wstog")]; v.on = !v.on; wsSave(); }
    else if (b.hasAttribute("data-wsdone")) { v = W.tasks[+b.getAttribute("data-wsdone")]; v.done = !v.done; wsSave(); }
    else if (b.hasAttribute("data-wsrun")) { v = W.reports[+b.getAttribute("data-wsrun")]; v.last = "Today, 09:30"; wsSave(); cxToast(v.n + " generated. Delivery is off in this prototype."); }
    else if (b.hasAttribute("data-wsdel")) { v = b.getAttribute("data-wsdel").split(":"); W[v[0]].splice(+v[1], 1); if (v[0] === "dashboards") ccWsDash = ""; wsSave(); }
    else if (b.hasAttribute("data-wssave")) {
      var f = b.getAttribute("data-wssave"), n = wsVal("[data-wsname]");
      if (!n && f !== "not") { var inp = cx.querySelector("[data-wsname]"); if (inp) { inp.setCustomValidity("Enter a name."); inp.reportValidity(); inp.setCustomValidity(""); } return; }
      if (f === "dash") { var cs = [].map.call(cx.querySelectorAll("[data-wscomp]:checked"), function (x) { return +x.getAttribute("data-wscomp"); }); W.dashboards.push({ n: n, c: cs, t: "im" }); ccWsDash = "c:" + (W.dashboards.length - 1); }
      if (f === "rep") W.reports.push({ n: n, s: wsVal("[data-wss]"), f: wsVal("[data-wsf]"), w: wsVal("[data-wsw]"), r: wsVal("[data-wsr]") || "Me", last: "Not run", t: "im" });
      if (f === "not") W.notifs.push({ t: wsVal("[data-wst]"), ch: wsVal("[data-wsc]"), r: wsVal("[data-wsr]") || "Me", on: true, k: "im" });
      if (f === "task") W.tasks.unshift({ t: n, o: wsVal("[data-wso]"), d: wsVal("[data-wsd]") || "No date", k: wsVal("[data-wsk]"), done: false, tr: "im" });
      if (f === "rem") W.reminders.unshift({ t: n, w: (wsVal("[data-wsd]") || "").replace("T", ", ") || "No time", tr: "im" });
      ccWsForm = ""; wsSave(); cxToast("Saved.");
    }
    else if (b.hasAttribute("data-rwnew")) { ccRw = { step: 0, proc: ccProc(ccSol()[0]).n, partner: "All partners", doc: cxSol()[0][0] + " (850)", ref: "None", file: "", budget: 50000, onb: "Pause the rule and notify", test: null }; rwPick("nora"); ccDr = ["rule"]; }
    else if (b.hasAttribute("data-rwclose")) { ccRw = null; ccDr = null; }
    else if (b.hasAttribute("data-rwagent")) { rwPick(b.getAttribute("data-rwagent")); }
    else if (b.hasAttribute("data-rwref")) { ccRw.ref = b.getAttribute("data-rwref"); ccRw.file = ""; }
    else if (b.hasAttribute("data-rwgo")) { rwRead(); ccRw.step = Math.max(0, Math.min(7, ccRw.step + +b.getAttribute("data-rwgo"))); }
    else if (b.hasAttribute("data-rwtest")) { rwRead(); var k = RWJOBS.map(function (x) { return x[0]; }).indexOf(ccRw.agent) + 1, nn = 3800 + 431 * k, d = 9 + 7 * k; ccRw.test = { n: nn, d: d, h: Math.ceil(d / 5), c: 100 - 100 * d / nn }; }
    else if (b.hasAttribute("data-rwdeploy")) {
      /* Rule scopes are stored on the supplier solution; a retailer rule is mapped back through the inverse of CCPMAP */
      var pi = ccSol().filter(function (i) { return ccProc(i).n === ccRw.proc; })[0], inv = { 1: 0, 2: 8, 3: 3 };
      if (pi == null) pi = ccSol()[0];
      var j = rwJob(), r = [ccRw.agent, ccRw.name || j[3], ccRw.doc, [ccRole() === "retailer" ? inv[pi] : pi], +(ccRw.test ? ccRw.test.c : 99).toFixed(1), 0, "Just now", "Active"];
      CXR.push(r); W.rules.push(r); wsSave(); ccRw = null; ccDr = null; cxToast("Rule deployed. " + r[1] + " is active.");
    }
    cxRender();
  });
  cx.addEventListener("change", function (e) {
    var el = e.target;
    if (el.hasAttribute && el.hasAttribute("data-xrq")) { ccXrQ = String(el.value || "").trim(); cxRender(); var xq = cx.querySelector("[data-xrq]"); if (xq) xq.focus({ preventScroll: true }); return; }
    if (el.hasAttribute && (el.hasAttribute("data-wsbdpt") || el.hasAttribute("data-wsbdq") || el.hasAttribute("data-wsbdlens"))) {
      if (el.hasAttribute("data-wsbdpt")) ccBd.pt = el.value; else if (el.hasAttribute("data-wsbdq")) ccBd.q = String(el.value || "").trim(); else ccWsLens = el.value;
      cxRender(); var nx = cx.querySelector(el.hasAttribute("data-wsbdq") ? "[data-wsbdq]" : el.hasAttribute("data-wsbdpt") ? "[data-wsbdpt]" : "[data-wsbdlens]"); if (nx) nx.focus({ preventScroll: true }); return;
    }
    if (el.hasAttribute && el.hasAttribute("data-rwfile") && ccRw) { rwRead(); ccRw.file = el.files && el.files[0] ? el.files[0].name : ""; ccRw.ref = ccRw.file ? "Uploaded file" : "None"; cxRender(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ccDr && ccDr[0] === "rule") { e.preventDefault(); ccRw = null; ccDr = null; cxRender(); } else if (e.key === "Escape" && ccDr && ccDr[0] === "bd") { e.preventDefault(); ccDr = null; cxRender(); } });
