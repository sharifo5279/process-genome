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
      dashboards: [{ n: "Network health", c: [10, 70, 80], t: "im" }, { n: "Order to cash daily", c: [20, 40, 60], t: "pm" }],
      reports: [{ n: "Daily findings digest", s: "Findings digest", f: "Email", w: "Daily, 06:30", r: "EDI operations", last: "Today, 06:30", t: "im" },
        { n: "Weekly process performance", s: "Process performance", f: "PDF", w: "Weekly, Monday 07:00", r: "Operations leads", last: "Mon, 07:00", t: "pm" },
        { n: "Retail compliance", s: "Retail compliance", f: "PDF", w: "Weekly, Friday 16:00", r: "Vendor compliance", last: "Fri, 16:00", t: "rt" }],
      notifs: [{ t: "High-severity finding", ch: "Email, Microsoft Teams", r: "EDI operations", on: true, k: "im" }, { t: "Partner feed late", ch: "Email", r: "Partner enablement", on: false, k: "im" },
        { t: "Action waiting over 1 hour", ch: "In-app", r: "Approvers", on: true, k: "pm" }, { t: "Process health turns critical", ch: "Microsoft Teams", r: "Supply chain", on: true, k: "pm" },
        { t: "Dispute window closing", ch: "Email", r: "Deductions review", on: true, k: "rt" }],
      tasks: [{ t: "Confirm the new AS2 endpoint with the partner", o: "Alex Morgan", d: "Today", k: "f:f2", done: false, tr: "im" },
        { t: "Update the cost on open orders", o: "Dana Ortiz", d: "Oct 27", k: "f:f9", done: true, tr: "pm" },
        { t: "Collect receiving evidence for the two deductions", o: "Jamie Brooks", d: "Tomorrow", k: "rt:rt-invoice-deduction", done: false, tr: "rt" }],
      reminders: [{ t: "Check the remittance advice after the connection fix", w: "Today, 11:30", tr: "im" }, { t: "Check acknowledgments before the 12:00 cutoff", w: "Today, 11:30", tr: "pm" }, { t: "Deduction dispute window closes", w: "Nov 1, 09:00", tr: "rt" }],
      rules: []
    };
  }
  var WSOPT = {
    rep: [["Findings digest", "im"], ["Network activity", "im"], ["Partner activity", "im"], ["Process performance", "pm"], ["Partner scorecard", "pm"], ["Retail compliance", "rt"], ["Deduction and dispute evidence", "rt"]],
    not: [["High-severity finding", "im"], ["Volume anomaly", "im"], ["Partner feed late", "im"], ["Action waiting over 1 hour", "pm"], ["Process health turns critical", "pm"], ["Rule over budget", "pm"], ["Dispute window closing", "rt"], ["Ship notice late for a retail account", "rt"]]
  };
  function wsOpts(k) { return WSOPT[k].filter(function (o) { return ccOn(o[1]); }).map(function (o) { return o[0]; }); }
  function wsTier(x) { return ccOn(x.t && x.t.length === 2 ? x.t : x.k && x.k.length === 2 ? x.k : x.tr || "im"); }
  function wsIdx(list) { return list.map(function (x, k) { return [x, k]; }).filter(function (p) { return wsTier(p[0]); }); }
  function wsLoad() {
    if (ccWs) return ccWs;
    var s = null; try { s = JSON.parse(localStorage.getItem(WSKEY) || "null"); } catch (e) {}
    ccWs = s && typeof s === "object" && Array.isArray(s.dashboards) ? s : wsSeed();
    ["dashboards", "reports", "notifs", "tasks", "reminders", "rules"].forEach(function (k) { if (!Array.isArray(ccWs[k])) ccWs[k] = wsSeed()[k]; });
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

  /* Business processes (Performance Monitor): one view per process in the client solution, plus the Solution document map.
     The Retail pack adds retail process definitions and lenses for its workflows. */
  var CCPROCS = [0, 1, 3], WSLENS = [];
  CXS["ws-proc"] = function () {
    var seg = '<nav class="ws-lens ws-pseg" aria-label="Business process"><span>Process</span>' + CCPROCS.map(function (i) { return '<button type="button" data-wsproc="' + i + '" aria-pressed="' + (ccWsProc === String(i)) + '">' + cxe(ccShort(i)) + '</button>'; }).join("") +
      '<button type="button" data-wsproc="sol" aria-pressed="' + (ccWsProc === "sol") + '">Solution</button></nav>';
    var h = wsHead("Business processes", "") + seg;
    if (ccWsProc === "sol") return h + '<p class="cx-lead">Business documents in the client solution, with their EDI and ERP equivalents.</p>' +
      cxCard("", '<table class="cx-tbl"><thead><tr><th>Business document</th><th>EDI documents</th><th>ERP document</th><th>Processes</th></tr></thead><tbody>' + CXSOL.map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td><td><code>' + r[1] + '</code></td><td>' + r[2] + '</td><td>' + cxe(cxProcNames(r[3])) + '</td></tr>'; }).join("") + '</tbody></table>');
    var i = +ccWsProc, P = ccProc(i), F = CCFLOW[i], lenses = ccOn("rt") ? WSLENS : [], lens = lenses.filter(function (l) { return l.k === ccWsLens; })[0];
    var items = cxSort(ccItems().filter(function (x) { return x.proc === i && !x.done && (!lens || lens.match(x)); })), core = cxOpen().filter(function (f) { return f.p === i && ccOn(f.mod === "Integration Monitor" ? "im" : "pm"); });
    var val = core.reduce(function (a, f) { return a + f.val; }, 0);
    var steps = P.steps.map(function (s, k) {
      var fs = core.filter(function (f) { return f.st === k; }), sev = fs.some(function (f) { return f.sev === "c"; }) ? "c" : fs.length ? "w" : "ok";
      return '<li class="' + sev + '"><span class="ws-sn">' + (k + 1) + '</span><b>' + cxe(s[0]) + '</b><code>' + cxe(s[1]) + '</code><strong>' + F.steps[k].toLocaleString("en-US") + '</strong><small>In flight</small>' +
        fs.map(function (f) { return '<button type="button" class="cx-lk" data-cxf="' + f.id + '">' + cxe(f.ot) + '</button>'; }).join("") + '</li>';
    }).join("");
    var rules = CXR.filter(function (r) { return r[3].indexOf(i) >= 0 && cxAgents().some(function (a) { return a.id === r[0]; }); });
    var docs = CXSOL.filter(function (r) { return r[3].indexOf(i) >= 0; });
    var lensNav = lenses.length ? '<nav class="ws-lens" aria-label="Retail lens"><span>Retail lens</span>' + [{ k: "all", n: "All findings" }].concat(lenses).map(function (l) { return '<button type="button" data-wslens="' + l.k + '" aria-pressed="' + ((lens ? lens.k : "all") === l.k) + '">' + l.n + '</button>'; }).join("") + '</nav>' : "";
    return h + '<div class="cx-fsum ws-pk">' + cxKpi("In flight", F.n.toLocaleString("en-US"), Math.round(100 * F.ok / F.n) + "% on track") + cxKpi("At risk or breached", F.risk + F.br, F.br + " breached") +
      cxKpi("Open findings", items.length, items.filter(function (x) { return x.sev === "h"; }).length + " high severity") + cxKpi(cxe(P.measures[CCM[i][0]]), CCM[i][1], val ? "$" + Math.round(val / 1000) + "K value at risk" : "No value at risk") + '</div>' +
      cxCard("Process flow", '<ol class="ws-flow">' + steps + '</ol>') +
      '<div class="cx-g21">' + cxCard("Open findings", lensNav + '<table class="cx-tbl cx-pf"><thead><tr><th>Finding</th><th>Module</th><th>Severity</th><th>Detected</th></tr></thead><tbody>' + items.map(function (x) {
        return '<tr><td>' + cxItemLink(x, "b") + '<small>' + cxe(x.partner) + '</small></td><td>' + cxTag(x.mod) + '</td><td>' + cxSevChip(x.sev) + '</td><td>' + cxe(x.at) + '</td></tr>'; }).join("") +
        (items.length ? "" : '<tr><td colspan="4" class="cx-empty">No open findings.</td></tr>') + '</tbody></table>') +
      cxCard("Rules and documents", '<ul class="cx-agr">' + rules.map(function (r) { var a = CXA.filter(function (x) { return x.id === r[0]; })[0]; return '<li>' + ci("check") + cxe(r[1]) + ' <small class="ws-mu">' + a.n + '</small></li>'; }).join("") + '</ul><h4 class="cx-sh">Documents</h4><p class="ws-docs">' + docs.map(function (r) { return '<code>' + r[1].split(",")[0] + '</code> ' + r[0]; }).join(" · ") + '</p>', "", cxGoBtn("Rules", "cfg")) + '</div>';
  };

  /* Dashboards: Overview tabs. Prebuilt by package, plus custom dashboards from the component library */
  var WSPRE = [{ k: "pm", n: "Partner scorecard", t: "pm", h: function () { return cxScorecard(); } }];
  function wsDashTabs() {
    var W = wsLoad();
    return WSPRE.filter(function (d) { return ccOn(d.t); }).map(function (d) { return { key: "p:" + d.k, n: d.n, pre: d }; })
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
    return wsHead("Agents", "Agents inspect documents" + (ccOn("pm") ? " and processes" : "") + ", raise findings and recommend actions. A person approves each action before it runs.",
      '<button type="button" class="cx-btn p ws-studio" data-wsstudio>' + ci("spark") + 'Build your own agent' + ci("ext") + '</button>') + '<div class="cx-ag">' + cxAgents().map(function (a) {
      var rs = CXR.filter(function (r) { return r[0] === a.id; }), op = a.f.filter(function (id) { return !ccDone[id]; });
      return '<section class="cx-card"><header class="cx-agh"><span class="cx-agi">' + a.n[0] + '</span><div><h3>' + a.n + '</h3><span>' + a.r + '</span></div>' + cxTag(a.t.toUpperCase()) + '</header><p class="cx-sub">' + a.d + '</p>' +
        '<dl class="cx-dl"><div><dt>' + (a.t === "im" ? "Checks" : "Rules") + '</dt><dd>' + rs.length + '</dd></div><div><dt>Open findings</dt><dd>' + op.length + '</dd></div><div><dt>Approval</dt><dd>Required</dd></div></dl></section>';
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
    var s = ccRw.step, j = rwJob(), procs = CCPROCS.map(function (i) { return ccProc(i).n; });
    if (s === 0) return '<h4 class="rw-q">What do you want an agent to do?</h4><p class="cx-sub">Each agent has a different job. Pick the one that matches what you need to catch.</p><div class="rw-jobs">' + RWJOBS.map(function (x) {
      var a = CXA.filter(function (y) { return y.id === x[0]; })[0];
      return '<button type="button" class="rw-job" data-rwagent="' + x[0] + '" aria-pressed="' + (ccRw.agent === x[0]) + '"><b>' + x[1] + '</b><span>' + x[2] + '</span><em><i class="cx-agi">' + a.n[0] + '</i>' + a.n + ' · ' + a.r + '</em></button>'; }).join("") + '</div>';
    if (s === 1) return '<h4 class="rw-q">Where should the rule apply?</h4><div class="ws-fg">' + wsField("Business process", wsSel("data-rw=proc", procs, ccRw.proc)) +
      wsField("Partners", wsSel("data-rw=partner", ["All partners"].concat(cxPartners().map(function (p) { return p[0]; })), ccRw.partner)) + wsField("Document", wsSel("data-rw=doc", CXSOL.map(function (r) { return r[0] + " (" + r[1].split(",")[0] + ")"; }), ccRw.doc)) + '</div>';
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

  /* Shell hooks */
  var wsBaseDrawer = cxDrawer;
  cxDrawer = function () { return ccDr && ccDr[0] === "rule" && ccRw ? rwDrawer() : wsBaseDrawer(); };
  var wsBaseRender = cxRender;
  cxRender = function () {
    wsLoad(); wsBaseRender();
    if (ccToastT) cx.insertAdjacentHTML("beforeend", '<div class="cx-toast" role="status">' + ci("ok") + '<span>' + cxe(ccToastT) + '</span></div>');
    var dr = cx.querySelector(".cx-dr.rw"); if (dr) { var f = dr.querySelector(".cx-db input, .cx-db select, .cx-db textarea, .cx-db button"); if (f && document.activeElement === document.body) f.focus({ preventScroll: true }); }
  };
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-wsproc],[data-wslens],[data-wsform],[data-wssave],[data-wsdash],[data-wsdel],[data-wsrun],[data-wstog],[data-wsdone],[data-wsstudio],[data-cxwsproc],[data-rwnew],[data-rwclose],[data-rwgo],[data-rwagent],[data-rwref],[data-rwtest],[data-rwdeploy]"); if (!b) return;
    var W = wsLoad(), v;
    if (b.hasAttribute("data-wsproc")) { ccWsProc = b.getAttribute("data-wsproc"); }
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
    else if (b.hasAttribute("data-rwnew")) { ccRw = { step: 0, proc: ccProc(0).n, partner: "All partners", doc: CXSOL[0][0] + " (850)", ref: "None", file: "", budget: 50000, onb: "Pause the rule and notify", test: null }; rwPick("nora"); ccDr = ["rule"]; }
    else if (b.hasAttribute("data-rwclose")) { ccRw = null; ccDr = null; }
    else if (b.hasAttribute("data-rwagent")) { rwPick(b.getAttribute("data-rwagent")); }
    else if (b.hasAttribute("data-rwref")) { ccRw.ref = b.getAttribute("data-rwref"); ccRw.file = ""; }
    else if (b.hasAttribute("data-rwgo")) { rwRead(); ccRw.step = Math.max(0, Math.min(7, ccRw.step + +b.getAttribute("data-rwgo"))); }
    else if (b.hasAttribute("data-rwtest")) { rwRead(); var k = RWJOBS.map(function (x) { return x[0]; }).indexOf(ccRw.agent) + 1, nn = 3800 + 431 * k, d = 9 + 7 * k; ccRw.test = { n: nn, d: d, h: Math.ceil(d / 5), c: 100 - 100 * d / nn }; }
    else if (b.hasAttribute("data-rwdeploy")) {
      var j = rwJob(), r = [ccRw.agent, ccRw.name || j[3], ccRw.doc, [CCPROCS.filter(function (i) { return ccProc(i).n === ccRw.proc; })[0] || 0], +(ccRw.test ? ccRw.test.c : 99).toFixed(1), 0, "Just now", "Active"];
      CXR.push(r); W.rules.push(r); wsSave(); ccRw = null; ccDr = null; cxToast("Rule deployed. " + r[1] + " is active.");
    }
    cxRender();
  });
  cx.addEventListener("change", function (e) {
    var el = e.target;
    if (el.hasAttribute && el.hasAttribute("data-rwfile") && ccRw) { rwRead(); ccRw.file = el.files && el.files[0] ? el.files[0].name : ""; ccRw.ref = ccRw.file ? "Uploaded file" : "None"; cxRender(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ccDr && ccDr[0] === "rule") { e.preventDefault(); ccRw = null; ccDr = null; cxRender(); } });
