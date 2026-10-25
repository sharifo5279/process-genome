  /* Retail and CPG experience. Additive, local demo state; no operational writes. */
  CXI.doc = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>';
  CXI.box = '<path d="m12 3 9 5-9 5-9-5zM3 8v9l9 5 9-5V8M12 13v9M7 5.8l9 5"/>';
  var RTKEY = "process-genome-retail-v1";
  var rtSaved = {};
  try { rtSaved = JSON.parse(localStorage.getItem(RTKEY) || "{}"); } catch (ignore) {}
  if (!rtSaved || typeof rtSaved !== "object" || Array.isArray(rtSaved)) rtSaved = {};
  var rtRole = rtSaved.role === "supplier" ? "supplier" : "retailer";
  /* Each case can override fields for one perspective (roles.<role>.over), including its process in that side's solution */
  var RTBASE = RTDATA.cases;
  function rtApplyRole() { RTDATA.cases = RTBASE.map(function (c) { var o = c.roles[rtRole] && c.roles[rtRole].over, r = {}, k; if (!o) return c; for (k in c) r[k] = c[k]; for (k in o) r[k] = o[k]; return r; }); }
  rtApplyRole();
  function rtLast(p) { return typeof p.lastActivity === "object" ? p.lastActivity[rtRole] : p.lastActivity; }
  function rtPartners() { return RTDATA.partners.filter(function (p) { return !p.only || p.only === rtRole; }); }
  var rtState = rtSaved.states && typeof rtSaved.states === "object" && !Array.isArray(rtSaved.states) ? rtSaved.states : {};
  var rtFilters = {}, rtCaseTab = "overview", rtDoc = "", rtToastText = "", rtToastTimer;
  var rtRuleDraft = null;
  function rte(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function rtProfile() { return RTDATA.roles[rtRole]; }
  function rtBag() {
    if (!rtState[rtRole] || typeof rtState[rtRole] !== "object" || Array.isArray(rtState[rtRole])) rtState[rtRole] = {};
    ["cases", "watches", "rules"].forEach(function (key) { if (!rtState[rtRole][key] || typeof rtState[rtRole][key] !== "object" || Array.isArray(rtState[rtRole][key])) rtState[rtRole][key] = {}; });
    return rtState[rtRole];
  }
  function rtSave() { try { localStorage.setItem(RTKEY, JSON.stringify({ role: rtRole, states: rtState })); } catch (ignore) {} }
  function rtCase(id) { return RTDATA.cases.filter(function (c) { return c.id === id; })[0]; }
  function rtPartner(id) { return RTDATA.partners.filter(function (p) { return p.id === id; })[0]; }
  function rtRule(id) { return RTDATA.rules.filter(function (r) { return r.id === id; })[0]; }
  function rtCS(c) { var b = rtBag(); if (!b.cases[c.id]) b.cases[c.id] = { owner: c.owner, status: "open", history: [] }; return b.cases[c.id]; }
  function rtContext(c) { return c.roles[rtRole]; }
  function rtMoney(n) { return "$" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 }); }
  function rtShortMoney(n) { return n >= 1000 ? "$" + (n / 1000).toFixed(n % 1000 ? 1 : 0) + "k" : rtMoney(n); }
  function rtLabel(s) { return ({ critical: "High", attention: "Medium", pass: "Verified", fail: "Exception", unknown: "Evidence needed", healthy: "Active", late: "Late", missing: "Missing", unconfigured: "Not configured", "not-required": "Not required", open: "Open", prepared: "Prepared", assigned: "Assigned", watch: "Watch", onboarding: "Onboarding", active: "Active" })[s] || s; }
  function rtChip(label, type) { return '<span class="rt-chip ' + rte(type || "neutral") + '">' + rte(label) + '</span>'; }
  /* Retail cases use the follow-up lifecycle: New, Assigned, Waiting on us or on the partner, Closed, Known issue */
  function rtWaitPt(c) { return /supplier|partner/i.test(c.action.label); }
  function rtTeam(c) { var o = c.owner; return o.indexOf(" · ") > 0 ? o.split(" · ")[1] : o; }
  function rtSt(c) { var s = rtCS(c).status; return ({ open: "New", assigned: "Assigned", prepared: rtWaitPt(c) ? "Waiting on partner" : "Waiting on us", closed: "Closed", known: "Known issue" })[s] || "New"; }
  function rtStatus(c) { return fuChip(rtSt(c)); }
  function rtSource(c) { return '<span class="rt-source ' + c.source.toLowerCase() + '">' + rte(c.source) + '</span>'; }
  function rtButton(text, attr, primary) { return '<button type="button" class="rt-button' + (primary ? ' primary' : '') + '" ' + (attr || '') + '>' + rte(text) + '</button>'; }
  function rtNavButton(text, screen, primary) { return rtButton(text, 'data-cxgo="' + rte(screen) + '"', primary); }
  function rtWorkflow(id) { return RTDATA.workflows.filter(function (w) { return w.id === id; })[0]; }
  function rtCases(id) { return RTDATA.cases.filter(function (c) { return !id || c.workflow === id; }); }
  function rtIcon(name) { return ci(CXI[name] ? name : "flow"); }
  function rtHeading(title, description, actions, eyebrow) {
    return '<div class="rt-heading"><div><div class="rt-hm">' + cxTag("RT") + (eyebrow ? '<span class="rt-eyebrow">' + rte(eyebrow) + '</span>' : '') + '</div><h2>' + rte(title) + '</h2><p>' + rte(description) + '</p></div><div class="rt-head-actions">' + (actions || '') + '</div></div>';
  }
  function rtSnapshot() { return '<div class="rt-snapshot"><span>Snapshot · ' + rte(RTDATA.snapshot.date + " · " + RTDATA.snapshot.time) + '</span></div>'; }
  function rtMetric(label, value, note, screen) {
    var tag = screen ? 'button type="button" data-cxgo="' + rte(screen) + '"' : 'div';
    return '<' + tag + ' class="rt-metric"><small>' + rte(label) + '</small><strong>' + rte(value) + '</strong><span>' + rte(note) + '</span></' + (screen ? 'button' : 'div') + '>';
  }
  function rtSection(title, note, button) { return '<div class="rt-section-head"><div><h3>' + rte(title) + '</h3>' + (note ? '<p>' + rte(note) + '</p>' : '') + '</div>' + (button || '') + '</div>'; }
  function rtFilter() { if (!rtFilters[ccScr]) rtFilters[ccScr] = { query: "", severity: "all", status: "all", source: "all" }; return rtFilters[ccScr]; }
  function rtFiltered(cases) {
    var f = rtFilter(), q = f.query.toLowerCase();
    return cases.filter(function (c) {
      var search = [c.title, c.id, c.reference, rtContext(c).partner, rtContext(c).summary, c.documents.map(function (d) { return d.id + " " + d.type; }).join(" ")].join(" ").toLowerCase();
      return (!q || search.indexOf(q) !== -1) && (f.severity === "all" || f.severity === c.severity) && (f.status === "all" || rtCS(c).status === f.status) && (f.source === "all" || c.source === f.source);
    });
  }
  function rtToolbar(sources) {
    var f = rtFilter();
    function options(items, selected) { return items.map(function (x) { return '<option value="' + x[0] + '"' + (selected === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join(''); }
    return '<div class="rt-toolbar"><label class="rt-search">' + ci("search") + '<input type="search" data-rt-search aria-label="Search cases" placeholder="Search partner, document, or issue" value="' + rte(f.query) + '"></label><div class="rt-filters"><select data-rt-filter="severity" aria-label="Priority">' + options([["all", "All severities"], ["critical", "High"], ["attention", "Medium"]], f.severity) + '</select><select data-rt-filter="status" aria-label="Case status">' + options([["all", "All states"], ["open", "New"], ["assigned", "Assigned"], ["prepared", "Waiting"], ["closed", "Closed"]], f.status) + '</select>' + (sources ? '<select data-rt-filter="source" aria-label="Monitor">' + options([["all", "All modules"], ["IM", "Integration Monitor"], ["PM", "Performance Monitor"]], f.source) + '</select>' : '') + '</div></div>';
  }
  function rtCaseTable(cases, mode) {
    var list = mode === "compact" ? cases : rtFiltered(cases);
    return '<div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Issue and partner</th><th>Evidence</th><th>Priority</th><th>Owner</th><th>Status</th><th><span class="sr-only">Open</span></th></tr></thead><tbody>' + list.map(function (c) {
      var x = rtContext(c), s = rtCS(c);
      return '<tr><td><button type="button" class="rt-link rt-cell-title" data-rt-case="' + rte(c.id) + '">' + rte(c.title) + '</button><span class="rt-cell-sub">' + rte(x.partner) + ' · ' + rte(c.reference) + '</span></td><td>' + rtSource(c) + '<span class="rt-cell-sub">' + rte(c.agent) + ' · ' + rte(c.documents.map(function (d) { return d.type; }).slice(0, 3).join(" / ")) + '</span></td><td>' + cxSevChip(c.severity === "critical" ? "h" : "m") + '</td><td><span class="rt-cell-title">' + rte(s.owner) + '</span></td><td>' + rtStatus(c) + '</td><td><button type="button" class="rt-icon-button" data-rt-case="' + rte(c.id) + '" aria-label="Open ' + rte(c.title) + '">' + ci("chev") + '</button></td></tr>';
    }).join('') + (list.length ? '' : '<tr><td colspan="6"><div class="rt-empty">No cases match these filters. ' + rtButton("Clear filters", "data-rt-clear") + '</div></td></tr>') + '</tbody></table></div>';
  }

  function rtCoverage(p) {
    var req = p.documents.filter(function (d) { return d.required; }), ok = req.filter(function (d) { return d.status === "healthy"; });
    return { total: req.length, healthy: ok.length, percent: req.length ? Math.round(ok.length / req.length * 100) : 0 };
  }
  function rtMatrix(partners) {
    var types = ["850", "855", "856", "810", "820", "997"];
    return '<div class="rt-table-wrap"><table class="rt-table rt-matrix"><thead><tr><th>' + rte(rtProfile().partnerLabel || "Trading partner") + '</th>' + types.map(function (t) { return '<th>' + t + '</th>'; }).join('') + '<th>Other</th><th>Coverage</th><th>Watch</th></tr></thead><tbody>' + partners.map(function (p) {
      var cv = rtCoverage(p);
      return '<tr><td><button type="button" class="rt-link rt-cell-title" data-rt-partner="' + rte(p.id) + '">' + rte(p.names[rtRole]) + '</button><span class="rt-cell-sub">' + rte((p.type === '3PL' ? '3PL service provider · ' : p.status === 'onboarding' ? 'Onboarding test · ' : '') + rtLast(p)) + '</span></td>' + types.map(function (t) {
        var d = p.documents.filter(function (x) { return String(x.type).indexOf(t) !== -1; })[0];
        var state = d ? d.status : "not-required";
        var labels = { healthy: p.status === "onboarding" ? "Test" : "Active", late: "Late", missing: "Missing", unconfigured: "Setup" };
        if (state === "not-required") return '<td><span class="rt-na" title="Not required"><span class="sr-only">Not required</span></span></td>';
        return '<td><button type="button" class="rt-chip ' + ({ healthy: "ready", late: "attention", missing: "critical", unconfigured: "unknown", "not-required": "neutral" })[state] + '" data-rt-partner="' + rte(p.id) + '" title="' + rte((d ? d.label + ": " : "") + rtLabel(state) + (d && d.required ? " · Required" : " · Optional or out of scope")) + '">' + (labels[state] || rte(state)) + '</button></td>';
      }).join('') + '<td><button type="button" class="rt-link" data-rt-partner="' + rte(p.id) + '">' + (p.documents.filter(function (d) { return types.indexOf(String(d.type)) === -1; }).length || '0') + '</button></td><td><b>' + cv.healthy + '/' + cv.total + '</b><span class="rt-cell-sub">' + (p.status === 'onboarding' ? 'test observed' : 'required active') + '</span></td><td><button type="button" class="rt-icon-button" data-rt-watch="' + rte(p.id) + '" aria-label="' + (rtBag().watches[p.id] ? 'Remove ' : 'Add ') + rte(p.names[rtRole]) + ' ' + (rtBag().watches[p.id] ? 'from' : 'to') + ' watchlist" aria-pressed="' + !!rtBag().watches[p.id] + '">' + (rtBag().watches[p.id] ? ci("ok") : ci("plus")) + '</button></td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  /* Partners: the Retail pack adds required-document coverage by partner */
  CXPTAB.push({ k: "req", n: "Required documents", t: "rt", h: function () {
    var missing = 0, unconfigured = 0, total = 0, healthy = 0;
    rtPartners().forEach(function (p) { p.documents.forEach(function (d) { if (d.required) { if (p.status !== "onboarding") { total++; if (d.status === "healthy") healthy++; } if (d.status === "missing" || d.status === "late") missing++; if (d.status === "unconfigured") unconfigured++; } }); });
    return '<div class="rt-metrics">' + rtMetric("Production feeds active", healthy + "/" + total, "Onboarding tests are shown separately") + rtMetric("Late or missing", missing, "Expected feed window breached") + rtMetric("Configuration gaps", unconfigured, "Required feed not yet configured") + rtMetric("On your watchlist", Object.keys(rtBag().watches).filter(function (k) { return rtBag().watches[k]; }).length, "Partners you watch") + '</div><section class="rt-panel">' + rtSection("Participation matrix", "Required routes are partner-specific. Open a partner for all documents, directions, and requirements.", rtButton("Export coverage", "data-rt-export=\"coverage\"")) + rtMatrix(rtPartners()) + '<p class="rt-note">Active describes document flow. A blank cell means the document is out of scope. Other routes are included in the coverage denominator; open the partner to inspect them.</p></section>' + rtSnapshot();
  } });
  /* Case evidence is shared by both monitors without changing their responsibilities. */
  function rtKV(rows) { return '<dl class="rt-kv">' + rows.map(function (r) { return '<div><dt>' + rte(r[0]) + '</dt><dd>' + rte(r[1]) + '</dd></div>'; }).join('') + '</dl>'; }
  function rtTimeline(c) {
    return '<ol class="rt-timeline">' + c.timeline.concat(rtCS(c).history || []).map(function (ev) { return '<li class="rt-event ' + rte(ev.status || '') + '"><time>' + rte(ev.time) + '</time><div><b>' + rte(ev.title) + '</b><p>' + rte(ev.detail) + '</p></div></li>'; }).join('') + '</ol>';
  }
  function rtChecks(c) {
    return '<div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Check</th><th>Expected</th><th>Observed</th><th>Result</th></tr></thead><tbody>' + c.checks.map(function (x) { return '<tr><td><b>' + rte(x.name) + '</b></td><td>' + rte(x.expected) + '</td><td>' + rte(x.observed) + '</td><td>' + rtChip(rtLabel(x.status), ({ pass: "ready", fail: "critical", unknown: "unknown" })[x.status]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function rtLineTable(c) {
    if (!c.lines || !c.lines.length) return '';
    var fields = c.workflow === "invoices" ? [["sku", "Item"], ["description", "Description"], ["invoiced", "Invoiced qty"], ["expectedPrice", "Order price"], ["price", "Invoice price"]] : [["sku", "Item"], ["description", "Description"], ["ordered", "Ordered"], ["acknowledged", "Acknowledged"]];
    if (c.workflow !== "invoices") { if (c.lines.some(function (l) { return l.released != null; })) fields.push(["released", "Warehouse release"]); fields.push(["shipped", c.workflow === "shipments" ? "ASN advised" : "Shipping evidence"]); }
    return rtSection("Line-level comparison", c.lineNote || "Source values are shown independently; a missing value is not treated as zero.") + '<div class="rt-table-wrap"><table class="rt-table"><thead><tr>' + fields.map(function (f) { return '<th>' + f[1] + '</th>'; }).join('') + '</tr></thead><tbody>' + c.lines.map(function (l) { return '<tr>' + fields.map(function (f) { var val = l[f[0]]; return '<td>' + (val == null ? '<span class="rt-cell-sub">Not reported</span>' : f[0].toLowerCase().indexOf("price") !== -1 ? '$' + Number(val).toFixed(2) : rte(val)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function rtCaseBody(c) {
    var x = rtContext(c), s = rtCS(c), rule = rtRule(c.ruleId);
    if (rtCaseTab === "evidence") {
      var selected = c.documents.filter(function (d) { return d.id === rtDoc; })[0] || c.documents[0];
      return '<div class="rt-docs">' + c.documents.map(function (d, i) { return '<button type="button" class="rt-doc' + (rtDoc === d.id || (!rtDoc && i === 0) ? ' on' : '') + '" data-rt-doc="' + rte(d.id) + '"><b>' + rte(d.type) + '</b><span>' + rte(d.id) + '</span><small>' + rte(d.time) + '</small></button>'; }).join('') + '</div>' +
        '<section class="rt-panel"><div class="rt-section-head"><h3>' + rte(selected.type) + ' · ' + rte(selected.id) + '</h3>' + rtChip(rtLabel(selected.status), selected.status === "pass" ? "ready" : selected.status === "fail" ? "critical" : "unknown") + '</div><p>' + rte(selected.detail) + '</p><span class="rt-note">Observed: ' + rte(selected.time) + ' · Case flow: ' + rte(x.direction || "Configured partner direction") + '</span></section>' + rtSection("Policy checks", c.policy || (rule ? rule.condition : "Configured partner policy")) + rtChecks(c) + rtLineTable(c) + (c.deductions ? rtDeductionTable(c) : '') + (c.evidenceGap ? '<div class="rt-callout"><b>Evidence still needed</b><p>' + rte(c.evidenceGap) + '</p></div>' : '') + '<p class="rt-note">' + rte(c.evidenceNotes || "Illustrative source records. Transport acceptance alone is not business acceptance.") + '</p>';
    }
    if (rtCaseTab === "activity") return rtSection("Document and follow-up timeline", "Network evidence and follow-up actions in time order.") + rtTimeline(c);
    if (rtCaseTab === "action") {
      return '<div class="rt-evidence-layout"><div><h3>Owner and notes</h3><p>' + rte(x.nextAction) + '</p><div class="rt-form-grid"><label class="rt-field">Owner<select data-rt-owner>' + [c.owner, FUME + " · EDI operations", "EDI operations lead", "Order management lead", "Logistics planner", "Deductions analyst", "Finance lead"].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (o) { return '<option' + ((s.draftOwner || s.owner) === o ? ' selected' : '') + '>' + rte(o) + '</option>'; }).join('') + '</select></label><div class="rt-field">State<span>' + rtStatus(c) + '</span></div></div><label class="rt-field">Note<textarea data-rt-note rows="4" placeholder="Evidence reviewed, decision, or reply received">' + rte(s.draftNote != null ? s.draftNote : (s.note || '')) + '</textarea></label><div class="rt-form-actions">' + rtButton("Save owner and note", 'data-rt-save-case="' + c.id + '"') + '</div>' + (s.status === "prepared" ? '<div class="rt-callout"><b>' + rte(c.action.completedLabel) + '</b><p>' + rte(c.action.completionNote) + '</p></div>' : '') + '</div><aside class="rt-panel"><h3>Evidence packet</h3><ul class="rt-summary-list"><li>Partner and business reference</li><li>Policy and observed exceptions</li><li>' + c.documents.length + ' source documents and events</li><li>Evidence gaps and owner</li><li>Notes</li></ul><p class="rt-note">Command Center records the handoff. Changes happen in the system that owns the document.</p>' + rtButton("Export evidence packet", 'data-rt-export-case="' + c.id + '"') + '</aside></div>';
    }
    return '<div class="rt-evidence-layout"><div><div class="rt-callout"><b>' + rte(x.impact) + '</b><p>' + rte(x.summary) + '</p></div>' + rtSection("Why this was raised", c.source === "IM" ? "Feed-level observation from Integration Monitor" : "Business-document observation from Performance Monitor") + '<p>' + rte(c.explanation) + '</p>' + '<div class="rt-docs">' + c.documents.map(function (d) { return '<button type="button" class="rt-doc" data-rt-doc="' + rte(d.id) + '"><b>' + rte(d.type) + '</b><span>' + rte(d.id) + '</span><small>' + rte(d.time) + '</small></button>'; }).join('') + '</div>' +
      (c.evidenceGap ? '<div class="rt-note"><b>Evidence boundary:</b> ' + rte(c.evidenceGap) + '</div>' : '') + '<h3>Recommended next step</h3><p>' + rte(x.nextAction) + '</p>' + rtButton("Show evidence", 'data-rt-tab="evidence"') + '</div><aside class="rt-panel">' + rtPartnerLink(x.partner) + rtKV([["Direction", x.direction || "Configured partner direction"], ["Reference", c.reference], ["Monitor", c.source === "IM" ? "Integration Monitor" : "Performance Monitor"], ["Agent", c.agent], ["Owner", s.owner], ["Business process", ccProc(c.process).n]]) + (c.amount ? rtKV([[c.amountLabel || "Amount under review", rtMoney(c.amount)]]) : '') + '<div class="rt-form-actions">' + rtButton("Open policy", 'data-rt-rule="' + rte(c.ruleId) + '"') + rtButton("Open process board", 'data-cxproc="' + c.process + '"') + '</div></aside></div>';
  }
  function rtDeductionTable(c) {
    return rtSection("Deduction breakdown", "Recorded adjustments; validity and recovery remain unconfirmed.") + '<div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Reason</th><th>Observed amount</th><th>Required evidence</th><th>Status</th></tr></thead><tbody>' + c.deductions.map(function (d) { return '<tr><td><b>' + rte(d.label) + '</b><span class="rt-cell-sub">' + rte(d.code) + '</span></td><td>' + rtMoney(d.amount) + '</td><td>' + rte(d.evidence) + '</td><td>' + rtChip("Unconfirmed", "unknown") + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function rtPartnerLink(n) { return '<dl class="rt-kv"><div><dt>Partner</dt><dd><button type="button" class="cx-lk" data-impt="' + rte(n) + '">' + rte(n) + '</button></dd></div></dl>'; }
  /* Retail detail renders in the shared sheet: same size, header, footer and focus handling as every other object */
  function rtDialog(title, eyebrow, body, footer, tabs, chips) {
    return '<div class="cx-scrim" data-ovesc></div><aside class="cx-dr rt-dialog" role="dialog" aria-modal="true"><header><span><p>' + rte(eyebrow) + '</p><h3>' + rte(title) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header>' +
      (chips ? '<p class="cx-chipsr rt-chips">' + chips + '</p>' : '') + (tabs || '') + '<div class="cx-db rt-dialog-body">' + body + '</div><div class="cx-ft rt-dialog-footer">' + footer + '</div></aside>';
  }
  /* Footer by state: one primary action, the rest under More actions */
  function rtFoot(c) {
    var st = rtSt(c), id = rte(c.id), who = rtWaitPt(c) ? "Notify partner" : "Notify team";
    function B(l, a, p) { return '<button type="button" class="cx-btn' + (p ? " p" : "") + '" ' + a + '>' + rte(l) + '</button>'; }
    function more(list) { return '<details class="fu-more"><summary class="cx-btn">More actions</summary><div>' + list.map(function (x) { return B(x[0], x[1]); }).join("") + '</div></details>'; }
    var tgi = ["Open in TG Insights", 'data-rt-tgi="' + id + '"'], known = ["Mark as known issue", 'data-rt-st="known:' + id + '"'], exp = ["Export evidence packet", 'data-rt-export-case="' + id + '"'];
    if (st === "New") return more([tgi, known, exp]) + B(who, 'data-rt-prepare="' + id + '"') + B("Assign to me", 'data-rt-assign="' + id + '"', 1);
    if (st === "Assigned") return more([known, exp]) + B("Open in TG Insights", tgi[1]) + B(who, 'data-rt-prepare="' + id + '"', 1);
    if (st === "Closed" || st === "Known issue") return B("Reopen", 'data-rt-st="assigned:' + id + '"', 1);
    return more([tgi, known, exp]) + B("Send reminder", 'data-rt-remind="' + id + '"') + B("Close follow-up", 'data-rt-st="closed:' + id + '"', 1);
  }
  function rtCaseDialog(c) {
    var s = rtCS(c), tabs = '<div class="rt-dialog-tabs" role="group" aria-label="Follow-up detail">' + [["overview", "Overview"], ["evidence", "Evidence"], ["activity", "Activity"], ["action", "Owner and notes"]].map(function (t) { return '<button type="button" class="' + (rtCaseTab === t[0] ? 'on' : '') + '" aria-pressed="' + (rtCaseTab === t[0]) + '" data-rt-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    return rtDialog(c.title, "Follow-up · Retail pack · " + c.agent, rtCaseBody(c), rtFoot(c), tabs, cxSevChip(c.severity === "critical" ? "h" : "m") + rtStatus(c) + cxTag("RT") + '<span class="cx-tg">' + rte(rtContext(c).partner + " · " + c.reference + " · Owner: " + s.owner) + '</span>');
  }
  /* Partner policies are inspectable and testable; activation is demo-only. */
  function rtEvaluateRule(rule, value) {
    var t = rule.test, threshold = Number(value);
    function evaluate(sample, complete) {
      var pass = t.operator === "lt" ? sample < threshold : t.operator === "min" ? sample >= threshold : sample <= threshold;
      if (t.requireEvidence && !complete) pass = false;
      return pass;
    }
    return [
      { label: t.passLabel || "Fixture A", value: t.passValue, pass: evaluate(t.passValue, t.passEvidenceComplete) },
      { label: t.failLabel || "Fixture B", value: t.failValue, pass: evaluate(t.failValue, t.failEvidenceComplete) }
    ];
  }
  function rtRuleDialog(rule) {
    if (!rtRuleDraft || rtRuleDraft.id !== rule.id) rtRuleDraft = { id: rule.id, threshold: rtBag().rules[rule.id] ? rtBag().rules[rule.id].threshold : rule.threshold, tested: false };
    var saved = rtBag().rules[rule.id], numeric = typeof rule.threshold === "number";
    var results = rtRuleDraft.tested ? '<div class="rt-callout" data-rt-rule-results><b>Test complete · 2 fixtures evaluated</b>' + rtEvaluateRule(rule, rtRuleDraft.threshold).map(function (result) { return '<p><b>' + rte(result.label) + ': ' + (result.pass ? 'Pass' : 'Finding') + '</b><br>' + rte(result.value + ' ' + (rule.test.measure || rule.unit)) + ' · ' + rte(result.pass ? rule.test.passDecision : rule.test.failDecision) + '</p>'; }).join('') + '<small>Evaluated against the threshold above. No records changed.</small></div>' : '';
    var body = '<div class="rt-evidence-layout"><div>' + rtKV([["Agent", rule.agent], ["Partner / process scope", rule.scope], ["Condition", rule.condition], ["Required evidence", rule.evidence]]) + '<label class="rt-field">' + (numeric ? 'Policy threshold' : 'Policy requirement') + '<input data-rt-threshold ' + (numeric ? 'type="number" min="0" step="any"' : 'type="text"') + ' value="' + rte(rtRuleDraft.threshold) + '"><span>' + rte(rule.unit || "Configured for this partner") + '</span></label><div class="rt-callout"><b>Evidence gate</b><p>' + rte(rule.guardrail) + '</p></div></div><aside class="rt-panel"><h3>Test before activation</h3><p>Run the configured policy against two illustrative fixtures.</p>' + rtKV([[rule.test.passLabel || "Fixture A", rule.test.pass], [rule.test.failLabel || "Fixture B", rule.test.fail]]) + rtButton("Run policy test", 'data-rt-test-rule="' + rule.id + '"', true) + results + '</aside></div>';
    return rtDialog(rule.name, "Retail policy · " + rule.agent + (saved && saved.active ? " · Active" : " · Template"), body, '<span class="rt-note">' + (rtRuleDraft.tested ? "Test passed. Activation applies to new documents." : "Run the policy test to activate.") + '</span><button type="button" class="cx-btn p" data-rt-activate-rule="' + rule.id + '"' + (!rtRuleDraft.tested ? ' disabled' : '') + '>Activate policy</button>');
  }
  /* Retail policy templates sit with the rules in Configuration */
  CXCFG.push(function () {
    if (!ccOn("rt")) return "";
    return cxCard("Retail policy templates", '<p class="cx-sub">Inspect the partner scope, required evidence and policy test before activation.</p><div class="rt-grid">' + RTDATA.rules.filter(function (r) { return !r.roles || r.roles.indexOf(rtRole) >= 0; }).map(function (r) { var saved = rtBag().rules[r.id]; return '<section class="rt-panel rt-rule"><div class="rt-section-head"><span class="rt-source ' + (r.agent === "Ivy" ? "im" : "pm") + '">' + (r.agent === "Ivy" ? "IM" : "PM") + ' · ' + rte(r.agent) + '</span>' + rtChip(saved && saved.active ? "Active" : "Template", saved && saved.active ? "info" : "neutral") + '</div><h3>' + rte(r.name) + '</h3><p>' + rte(r.condition) + '</p><p class="rt-note">' + rte(r.scope) + '</p>' + rtButton("Test policy", 'data-rt-rule="' + r.id + '"') + '</section>'; }).join('') + '</div>', "", cxTag("RT"));
  });

  /* The Retail add-on: its workspaces in the navigation, its cases in the shared findings and action queue, its components on the dashboard. */
  function rtAt(c) { if (c.detected) return "Today, " + c.detected; var t = String((c.timeline[c.timeline.length - 1] || {}).time || ""), m = /(\d\d:\d\d)$/.exec(t); return m && (t === m[1] || t.indexOf(RTDATA.snapshot.date.slice(8) + " Oct") === 0) ? "Today, " + m[1] : t; }
  CXITEMS.push(function () {
    return RTDATA.cases.map(function (c) {
      var x = rtContext(c), s = rtCS(c), rule = rtRule(c.ruleId), w = rtWorkflow(c.workflow), at = rtAt(c);
      return { key: "rt:" + c.id, mod: "RT", title: c.title, partner: x.partner, doc: ((c.documents.filter(function (d) { return d.status === "fail"; })[0] || c.documents[0] || {}).type || ""), check: rule ? rule.name : c.reference, proc: c.process, sev: c.severity === "critical" ? "h" : "m",
        agent: c.agent + " · " + w.title, wf: c.workflow, owner: s.owner, status: rtSt(c), done: s.status === "closed" || s.status === "known", bucket: ({ open: "need", assigned: "need", prepared: "wait", closed: "ver", known: "off" })[s.status] || "need", wait: s.status === "prepared" ? (rtWaitPt(c) ? x.partner : rtTeam(c)) : "", at: at, ord: cxOrd(at.replace(/^Today, /, "")), val: c.amount || 0,
        open: 'data-rt-case="' + rte(c.id) + '"', act: x.nextAction, appr: s.owner, actDone: s.status !== "open" && s.status !== "assigned", actState: rtSt(c),
        actBtn: s.status === "open" ? '<button type="button" class="cx-btn p" data-rt-assign="' + rte(c.id) + '">Assign to me</button>' : "" };
    });
  });
  CXDASH.push(
    { o: 30, mod: "RT", w: 2, t: "Retail workflows", h: function () {
      return '<ul class="rt-wl">' + RTDATA.workflows.filter(function (w) { return !w.hidden; }).map(function (w) {
        var cases = rtCases(w.id), hi = cases.filter(function (c) { return c.severity === "critical"; }).length;
        return '<li><button type="button" data-rt-lens="' + w.id + '">' + rtIcon(["users", "flow", "box", "doc"][RTDATA.workflows.indexOf(w)]) + '<span><b>' + rte(w.title) + '</b><small>' + rte(w.subtitle) + '</small></span><em>' + cases.length + '</em>' + (hi ? '<i class="rt-hi">' + hi + ' high</i>' : '') + '</button></li>'; }).join('') + '</ul>'; },
      f: function () { return '<span class="cx-note">Open cases by workflow</span>'; } },
    { o: 90, mod: "RT", w: 2, t: "Partner participation", h: function () {
      var total = 0, healthy = 0, late = 0, gaps = 0;
      rtPartners().forEach(function (p) { p.documents.forEach(function (d) { if (!d.required) return; if (p.status !== "onboarding") { total++; if (d.status === "healthy") healthy++; } if (d.status === "missing" || d.status === "late") late++; if (d.status === "unconfigured") gaps++; }); });
      return '<div class="cx-k2">' + cxKpi("Production feeds active", healthy + "/" + total, "Required routes") + cxKpi("Late or missing", late, "Feed window breached") + cxKpi("Configuration gaps", gaps, "Required route not set up") + cxKpi(rtProfile().partnerLabel, rtPartners().filter(function (p) { return p.type !== "3PL"; }).length, "Connected") + '</div>'; },
      f: function () { return cxGoBtn("Required documents", "rt-partners"); } },
    { o: 35, mod: "RT", w: 2, t: "Retail KPIs", h: function () {
      return '<div class="cx-k2">' + CXCATR[3].map(function (m) { return cxKpiL(m[0], m[2], "Target " + m[3], "data-rt-kpis", cxOff(m)); }).join("") + '</div>'; },
      f: function () { return '<button type="button" class="cx-lk" data-rt-kpis>Retail KPIs dashboard' + ci("chev", "cx-lki") + '</button>'; } }
  );
  WSPRE.push({ k: "rt", n: "Retail KPIs", t: "rt", h: function () { return cxCatList([[rtRole === "retailer" ? "Supplier performance, all suppliers" : "Our performance with retail accounts"].concat(CXCATR.slice(1))]); } });
  RTDATA.workflows.filter(function (w) { return !w.hidden; }).forEach(function (w) { WSLENS.push({ k: w.id, n: w.title, match: function (x) { return x.wf === w.id; } }); });
  CXQ.push({ t: "rt", q: function () { return "Which evidence is still missing?"; }, a: function () {
      return [rtRole === "retailer" ? "Shipping and settlement cases are waiting on a corrected 856 from the supplier, 214 carrier events, and the 861 that Northfield Stores has not yet sent. A 997 confirms syntax only."
        : "Shipping and settlement cases are waiting on the corrected 856 and the 856 for WH-45022 that Nuvori Beauty has not sent, and on 214 and 861 evidence from the retail account. A 997 confirms syntax only.",
        ccItems().filter(function (i) { return /^rt:rt-(shipment|invoice)/.test(i.key); })]; } });
  var rtBaseRender = cxRender, rtBaseDrawer = cxDrawer;
  cxDrawer = function () {
    if (!ccDr || ccDr[0].indexOf("rt-") !== 0) return rtBaseDrawer();
    if (ccDr[0] === "rt-case") return rtCaseDialog(rtCase(ccDr[1]));
    if (ccDr[0] === "rt-rule") return rtRuleDialog(rtRule(ccDr[1]));
    return '';
  };
  cxRender = function () {
    var oldMain = cx.querySelector(".cx-main"), scroll = oldMain ? oldMain.scrollTop : 0;
    rtBaseRender();
    cx.classList.add("rt-app");
    var toolbar = cx.querySelector(".cx-tb");
    if (toolbar && ccOn("rt")) toolbar.insertAdjacentHTML("beforebegin", '<div class="rt-role" role="group" aria-label="Perspective"><span>Perspective</span><button type="button" class="' + (rtRole === "retailer" ? 'on' : '') + '" data-rt-role="retailer" aria-pressed="' + (rtRole === "retailer") + '">Retailer</button><button type="button" class="' + (rtRole === "supplier" ? 'on' : '') + '" data-rt-role="supplier" aria-pressed="' + (rtRole === "supplier") + '">CPG supplier</button></div>');
    var main = cx.querySelector(".cx-main"); if (main) main.scrollTop = scroll;
  };

  function rtToast(message) { cxToast(message); }
  /* Opening retail detail: the shared sheet stack handles Back, Escape and focus */
  function rtOpen(type, id, tab) { ccDr = [type, id]; rtCaseTab = tab || "overview"; rtDoc = ''; rtRuleDraft = null; cxRender(); }
  function rtRecord(c, title, detail) {
    rtCS(c).history.push({ time: "Today, " + fuT(ccNow), title: title, detail: detail, status: "pass" });
    rtSave();
  }
  function rtSaveCase(c) {
    var owner = cx.querySelector("[data-rt-owner]"), note = cx.querySelector("[data-rt-note]"), s = rtCS(c);
    if (owner) s.owner = owner.value;
    if (note) s.note = note.value.trim();
    delete s.draftOwner; delete s.draftNote;
    if (s.status === "open") s.status = "assigned";
    rtRecord(c, "Owner and note saved", "Owner: " + s.owner + (s.note ? ". Note: " + s.note : "."));
  }
  function rtDownload(filename, content, type) {
    var blob = new Blob([content], { type: type || "text/plain;charset=utf-8" }), url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function rtCSV(rows) { return rows.map(function (row) { return row.map(function (v) { var s = String(v == null ? '' : v); if (/^[=+@-]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'); }
  function rtExport(kind) {
    var rows;
    if (kind === "coverage") {
      rows = [["Perspective", "Partner", "Document", "Required", "Status", "Last seen", "Context"]];
      rtPartners().forEach(function (p) { p.documents.forEach(function (d) { rows.push([rtProfile().label, p.names[rtRole], d.type, d.required ? "Yes" : "No", rtLabel(d.status), d.lastSeen, d.detail]); }); });
    } else {
      rows = [["Perspective", "Follow-up", "Partner", "Reference", "Monitor", "Agent", "Severity", "Owner", "State", "Amount under review", "Evidence gap", "Note"]];
      (kind === "actions" ? RTDATA.cases : rtCases(kind)).forEach(function (c) { var s = rtCS(c); rows.push([rtProfile().label, c.title, rtContext(c).partner, c.reference, c.source, c.agent, c.severity === "critical" ? "High" : "Medium", s.owner, rtSt(c), c.amount || '', c.evidenceGap || '', s.note || '']); });
    }
    rtDownload("retail-" + rtRole + "-" + kind + ".csv", '\ufeff' + rtCSV(rows), "text/csv;charset=utf-8"); rtToast(kind === "coverage" ? "Coverage exported." : "Follow-ups exported."); cxRender();
  }
  function rtExportCase(c) {
    var x = rtContext(c), s = rtCS(c);
    var text = ["Command Center evidence packet (illustrative)", "", "Perspective: " + rtProfile().label + " / " + rtProfile().company, "Follow-up: " + c.title, "Reference: " + c.reference, "Partner: " + x.partner, "Monitor: " + c.source + " / " + c.agent, "Owner: " + (s.draftOwner || s.owner), "State: " + rtSt(c), "", "Observation", x.summary, x.impact, "", "Partner policy", c.policy, "", "Amount", c.amount ? (c.amountLabel || "Amount under review") + ": " + rtMoney(c.amount) : "No financial amount inferred", "", "Evidence", c.documents.map(function (d) { return d.type + " | " + d.id + " | " + d.time + " | " + d.status + " | " + (d.detail || ""); }).join('\n'), "", "Checks", c.checks.map(function (ch) { return ch.name + " | Expected: " + ch.expected + " | Observed: " + ch.observed + " | " + ch.status; }).join('\n'), "", "Line comparisons", c.lines ? JSON.stringify(c.lines, null, 2) : "No line comparison for this case.", c.lineNote || "", "", "Deductions", c.deductions ? JSON.stringify(c.deductions, null, 2) : "No deduction breakdown for this case.", "", "Evidence gap", c.evidenceGap || "No additional gap recorded in this illustrative case.", "", "Next step", x.nextAction, "", "Note", s.draftNote != null ? s.draftNote + " (unsaved draft)" : s.note || "No note recorded.", "", "This packet contains fictional demo data. Preparation does not send a document, decide a dispute, confirm delivery, or recover money."].join('\n');
    rtDownload("retail-evidence-" + c.id + "-" + rtRole + ".txt", text); rtToast("Evidence packet exported."); cxRender();
  }

  cx.addEventListener("click", function (event) {
    var b = event.target.closest('[data-rt-role],[data-rt-case],[data-rt-partner],[data-rt-rule],[data-rt-tab],[data-rt-doc],[data-rt-watch],[data-rt-close],[data-rt-prepare],[data-rt-save-case],[data-rt-assign],[data-rt-st],[data-rt-remind],[data-rt-tgi],[data-rt-confirm-reset],[data-rt-test-rule],[data-rt-activate-rule],[data-rt-export],[data-rt-export-case],[data-rt-clear],[data-rt-lens],[data-rt-kpis]');
    if (!b) return;
    var id;
    if (b.hasAttribute("data-rt-role")) { rtRole = b.getAttribute("data-rt-role"); rtApplyRole(); rtSave(); ccDr = null; rtFilters = {}; ccAvLog = []; ccOvF = null; rtToast("Perspective: " + rtProfile().label); cxRender(); return; }
    if (b.hasAttribute("data-rt-case")) return rtOpen("rt-case", b.getAttribute("data-rt-case"), b.getAttribute("data-rt-open-tab"));
    if (b.hasAttribute("data-rt-partner")) { var pp = rtPartner(b.getAttribute("data-rt-partner")); ccDr = ["pt", pp.names[rtRole]]; ccPtSheet = "docs"; cxRender(); return; }
    if (b.hasAttribute("data-rt-rule")) return rtOpen("rt-rule", b.getAttribute("data-rt-rule"));
    if (b.hasAttribute("data-rt-close")) { ccDr = null; cxRender(); return; }
    if (b.hasAttribute("data-rt-tab")) { rtCaseTab = b.getAttribute("data-rt-tab"); cxRender(); var tabButton = cx.querySelector('.rt-dialog-tabs [data-rt-tab="' + rtCaseTab + '"]'); if (tabButton) tabButton.focus({ preventScroll: true }); return; }
    if (b.hasAttribute("data-rt-doc")) { rtDoc = b.getAttribute("data-rt-doc"); rtCaseTab = "evidence"; cxRender(); return; }
    if (b.hasAttribute("data-rt-watch")) { id = b.getAttribute("data-rt-watch"); rtBag().watches[id] = !rtBag().watches[id]; rtSave(); rtToast(rtBag().watches[id] ? "Added to watchlist." : "Removed from watchlist."); cxRender(); return; }
    if (b.hasAttribute("data-rt-prepare")) { var c = rtCase(b.getAttribute("data-rt-prepare")); var s = rtCS(c); if (cx.querySelector("[data-rt-note]")) rtSaveCase(c); fuTick(); if (s.status === "open") s.owner = FUME + " · EDI operations"; s.status = "prepared"; rtRecord(c, (rtWaitPt(c) ? "Notified " + rtContext(c).partner : "Sent to " + rtTeam(c)) + " with the evidence packet", c.action.completionNote); rtToast((rtWaitPt(c) ? "Notice sent to " + rtContext(c).partner : "Sent to " + rtTeam(c)) + " with the evidence packet."); cxRender(); return; }
    if (b.hasAttribute("data-rt-assign")) { c = rtCase(b.getAttribute("data-rt-assign")); s = rtCS(c); fuTick(); s.owner = FUME + " · EDI operations"; s.status = "assigned"; rtRecord(c, "Assigned to " + FUME, "Owner set from the follow-up."); rtToast("Assigned to you. " + (rtWaitPt(c) ? "Notify the partner" : "Notify " + rtTeam(c)) + " next."); cxRender(); return; }
    if (b.hasAttribute("data-rt-st")) { var sp = b.getAttribute("data-rt-st").split(":"); c = rtCase(sp[1]); s = rtCS(c); fuTick(); s.status = sp[0]; rtRecord(c, { closed: "Closed by " + FUME, known: "Marked as known issue", assigned: "Reopened by " + FUME }[sp[0]], ""); rtToast({ closed: "Follow-up closed.", known: "Marked as known issue.", assigned: "Follow-up reopened." }[sp[0]]); cxRender(); return; }
    if (b.hasAttribute("data-rt-remind")) { c = rtCase(b.getAttribute("data-rt-remind")); fuTick(); rtRecord(c, "Reminder sent to " + (rtWaitPt(c) ? rtContext(c).partner : rtTeam(c)), ""); rtToast("Reminder sent."); cxRender(); return; }
    if (b.hasAttribute("data-rt-tgi")) { c = rtCase(b.getAttribute("data-rt-tgi")); fuTick(); rtRecord(c, "Handed off to TG Insights", c.documents.length + " documents selected"); fuTgi(c.documents.length); cxRender(); return; }
    if (b.hasAttribute("data-rt-save-case")) { rtSaveCase(rtCase(b.getAttribute("data-rt-save-case"))); rtToast("Owner and note saved."); cxRender(); return; }
    if (b.hasAttribute("data-rt-confirm-reset")) { delete rtState[rtRole]; rtBag(); rtSave(); rtFilters = {}; ccDr = null; rtToast("Retail perspective reset."); cxRender(); return; }
    if (b.hasAttribute("data-rt-lens")) { var lw = b.getAttribute("data-rt-lens"), lc = rtCases(lw)[0]; ccWsLens = lw; ccWsProc = String(lc ? lc.process : 0); return cxGo("ws-proc"); }
    if (b.hasAttribute("data-rt-kpis")) { ccWsDash = "p:rt"; return cxGo("ws-dash"); }
    if (b.hasAttribute("data-rt-test-rule")) { var input = cx.querySelector("[data-rt-threshold]"); var rule = rtRule(b.getAttribute("data-rt-test-rule")); var v = input.value.trim(); if (!v || (typeof rule.threshold === "number" && (!isFinite(Number(v)) || Number(v) < 0))) { input.setCustomValidity("Enter a valid policy threshold."); input.reportValidity(); return; } input.setCustomValidity(""); rtRuleDraft.threshold = typeof rule.threshold === "number" ? Number(v) : v; rtRuleDraft.tested = true; cxRender(); return; }
    if (b.hasAttribute("data-rt-activate-rule")) { if (!rtRuleDraft || !rtRuleDraft.tested) return; rtBag().rules[rtRuleDraft.id] = { threshold: rtRuleDraft.threshold, active: true }; rtSave(); rtToast("Policy activated."); ovBack(); return; }
    if (b.hasAttribute("data-rt-export")) return rtExport(b.getAttribute("data-rt-export"));
    if (b.hasAttribute("data-rt-export-case")) return rtExportCase(rtCase(b.getAttribute("data-rt-export-case")));
    if (b.hasAttribute("data-rt-clear")) { delete rtFilters[ccScr]; cxRender(); }
  });
  cx.addEventListener("change", function (event) {
    var el = event.target;
    if (el.hasAttribute("data-rt-filter")) { var field = el.getAttribute("data-rt-filter"); rtFilter()[field] = el.value; cxRender(); var next = cx.querySelector('[data-rt-filter="' + field + '"]'); if (next) next.focus({ preventScroll: true }); }
    if (el.hasAttribute("data-rt-owner") && ccDr && ccDr[0] === "rt-case") rtCS(rtCase(ccDr[1])).draftOwner = el.value;
  });
  cx.addEventListener("input", function (event) {
    var el = event.target;
    if (el.hasAttribute("data-rt-note") && ccDr && ccDr[0] === "rt-case") rtCS(rtCase(ccDr[1])).draftNote = el.value;
    if (el.hasAttribute("data-rt-search")) { var cursor = el.selectionStart; rtFilter().query = el.value; cxRender(); var next = cx.querySelector("[data-rt-search]"); if (next) { next.focus({ preventScroll: true }); if (cursor != null) next.setSelectionRange(cursor, cursor); } }
    if (el.hasAttribute("data-rt-threshold") && rtRuleDraft) { rtRuleDraft.tested = false; var stale = cx.querySelector("[data-rt-rule-results]"); if (stale) stale.textContent = "Threshold changed. Run the policy test again."; var button = cx.querySelector("[data-rt-activate-rule]"); if (button) button.disabled = true; }
  });
