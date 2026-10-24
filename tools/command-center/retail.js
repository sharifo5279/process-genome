  /* Retail and CPG experience. Additive, local demo state; no operational writes. */
  CXI.doc = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>';
  CXI.box = '<path d="m12 3 9 5-9 5-9-5zM3 8v9l9 5 9-5V8M12 13v9M7 5.8l9 5"/>';
  var RTKEY = "process-genome-retail-v1";
  var rtSaved = {};
  try { rtSaved = JSON.parse(localStorage.getItem(RTKEY) || "{}"); } catch (ignore) {}
  if (!rtSaved || typeof rtSaved !== "object" || Array.isArray(rtSaved)) rtSaved = {};
  var rtRole = rtSaved.role === "supplier" ? "supplier" : "retailer";
  var rtState = rtSaved.states && typeof rtSaved.states === "object" && !Array.isArray(rtSaved.states) ? rtSaved.states : {};
  var rtFilters = {}, rtCaseTab = "overview", rtDoc = "", rtToastText = "", rtToastTimer;
  var rtRuleDraft = null, rtFocusBack = null, rtModalStack = [];
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
  function rtLabel(s) { return ({ critical: "High priority", attention: "Needs attention", pass: "Verified", fail: "Exception", unknown: "Evidence needed", healthy: "Active", late: "Late", missing: "Missing", unconfigured: "Not configured", "not-required": "Not required", open: "Open", prepared: "Prepared", assigned: "Assigned", watch: "Watch", onboarding: "Onboarding", active: "Active" })[s] || s; }
  function rtChip(label, type) { return '<span class="rt-chip ' + rte(type || "neutral") + '">' + rte(label) + '</span>'; }
  function rtStatus(c) { var s = rtCS(c); return rtChip(rtLabel(s.status), s.status === "open" ? "neutral" : "info"); }
  function rtSource(c) { return '<span class="rt-source ' + c.source.toLowerCase() + '">' + rte(c.source) + '</span>'; }
  function rtButton(text, attr, primary) { return '<button type="button" class="rt-button' + (primary ? ' primary' : '') + '" ' + (attr || '') + '>' + rte(text) + '</button>'; }
  function rtNavButton(text, screen, primary) { return rtButton(text, 'data-cxgo="' + rte(screen) + '"', primary); }
  function rtWorkflow(id) { return RTDATA.workflows.filter(function (w) { return w.id === id; })[0]; }
  function rtCases(id) { return RTDATA.cases.filter(function (c) { return !id || c.workflow === id; }); }
  function rtIcon(name) { return ci(CXI[name] ? name : "flow"); }
  function rtHeading(title, description, actions, eyebrow) {
    return '<div class="rt-heading"><div><div class="rt-hm">' + cxTag("RT") + (eyebrow ? '<span class="rt-eyebrow">' + rte(eyebrow) + '</span>' : '') + '</div><h2>' + rte(title) + '</h2><p>' + rte(description) + '</p></div><div class="rt-head-actions">' + (actions || '') + '</div></div>';
  }
  function rtSnapshot() { return '<div class="rt-snapshot"><span>Demo snapshot · ' + rte(RTDATA.snapshot.date + " · " + RTDATA.snapshot.time) + '</span><span>Demo actions stay in this browser</span></div>'; }
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
    return '<div class="rt-toolbar"><label class="rt-search">' + ci("search") + '<input type="search" data-rt-search aria-label="Search cases" placeholder="Search partner, document, or issue" value="' + rte(f.query) + '"></label><div class="rt-filters"><select data-rt-filter="severity" aria-label="Priority">' + options([["all", "All priorities"], ["critical", "High priority"], ["attention", "Needs attention"]], f.severity) + '</select><select data-rt-filter="status" aria-label="Case status">' + options([["all", "All statuses"], ["open", "Open"], ["prepared", "Prepared"], ["assigned", "Assigned"]], f.status) + '</select>' + (sources ? '<select data-rt-filter="source" aria-label="Monitor">' + options([["all", "Both monitors"], ["IM", "Integration Monitor"], ["PM", "Performance Monitor"]], f.source) + '</select>' : '') + '</div></div>';
  }
  function rtCaseTable(cases, mode) {
    var list = mode === "compact" ? cases : rtFiltered(cases);
    return '<div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Issue and partner</th><th>Evidence</th><th>Priority</th><th>Owner</th><th>Status</th><th><span class="sr-only">Open</span></th></tr></thead><tbody>' + list.map(function (c) {
      var x = rtContext(c), s = rtCS(c);
      return '<tr><td><button type="button" class="rt-link rt-cell-title" data-rt-case="' + rte(c.id) + '">' + rte(c.title) + '</button><span class="rt-cell-sub">' + rte(x.partner) + ' · ' + rte(c.reference) + '</span></td><td>' + rtSource(c) + '<span class="rt-cell-sub">' + rte(c.agent) + ' · ' + rte(c.documents.map(function (d) { return d.type; }).slice(0, 3).join(" / ")) + '</span></td><td>' + rtChip(c.severity === "critical" ? "High" : "Attention", c.severity) + '</td><td><span class="rt-cell-title">' + rte(s.owner) + '</span></td><td>' + rtStatus(c) + '</td><td><button type="button" class="rt-icon-button" data-rt-case="' + rte(c.id) + '" aria-label="Open ' + rte(c.title) + '">' + ci("chev") + '</button></td></tr>';
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
      return '<tr><td><button type="button" class="rt-link rt-cell-title" data-rt-partner="' + rte(p.id) + '">' + rte(p.names[rtRole]) + '</button><span class="rt-cell-sub">' + rte((p.status === 'onboarding' ? 'Onboarding test · ' : '') + p.lastActivity) + '</span></td>' + types.map(function (t) {
        var d = p.documents.filter(function (x) { return String(x.type).indexOf(t) !== -1; })[0];
        var state = d ? d.status : "not-required";
        var labels = { healthy: p.status === "onboarding" ? "Test" : "Active", late: "Late", missing: "Missing", unconfigured: "Setup", "not-required": "—" };
        return '<td><button type="button" class="rt-chip ' + ({ healthy: "ready", late: "attention", missing: "critical", unconfigured: "unknown", "not-required": "neutral" })[state] + '" data-rt-partner="' + rte(p.id) + '" title="' + rte((d ? d.label + ": " : "") + rtLabel(state) + (d && d.required ? " · Required" : " · Optional or out of scope")) + '">' + (labels[state] || rte(state)) + '</button></td>';
      }).join('') + '<td><button type="button" class="rt-link" data-rt-partner="' + rte(p.id) + '">' + (p.documents.filter(function (d) { return types.indexOf(String(d.type)) === -1; }).length || '—') + '</button></td><td><b>' + cv.healthy + '/' + cv.total + '</b><span class="rt-cell-sub">' + (p.status === 'onboarding' ? 'test observed' : 'required active') + '</span></td><td><button type="button" class="rt-icon-button" data-rt-watch="' + rte(p.id) + '" aria-label="' + (rtBag().watches[p.id] ? 'Remove ' : 'Add ') + rte(p.names[rtRole]) + ' ' + (rtBag().watches[p.id] ? 'from' : 'to') + ' watchlist" aria-pressed="' + !!rtBag().watches[p.id] + '">' + (rtBag().watches[p.id] ? ci("ok") : ci("plus")) + '</button></td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  CXS["rt-partners"] = function () {
    var missing = 0, unconfigured = 0, total = 0, healthy = 0;
    RTDATA.partners.forEach(function (p) { p.documents.forEach(function (d) { if (d.required) { if (p.status !== "onboarding") { total++; if (d.status === "healthy") healthy++; } if (d.status === "missing" || d.status === "late") missing++; if (d.status === "unconfigured") unconfigured++; } }); });
    return '<div class="rt-page">' + rtHeading("Partner participation", "Know who is connected, what is expected, and where the evidence stops.", rtNavButton("Dashboard", "dash"), "Uses Integration Monitor feed data") + '<div class="rt-metrics">' + rtMetric("Production feeds active", healthy + "/" + total, "Onboarding tests are shown separately") + rtMetric("Late or missing", missing, "Expected feed window breached") + rtMetric("Configuration gaps", unconfigured, "Required feed not yet configured") + rtMetric("On your watchlist", Object.keys(rtBag().watches).filter(function (k) { return rtBag().watches[k]; }).length, "Partner follow-up in this browser") + '</div><section class="rt-panel">' + rtSection("Participation matrix", "Required routes are partner-specific. Open a partner for all documents, directions, and requirements.", rtButton("Export coverage", "data-rt-export=\"coverage\"")) + rtMatrix(RTDATA.partners) + '<p class="rt-note">Active describes document flow. A dash means the displayed document is out of scope. Other routes are included in the coverage denominator; open the partner to inspect them.</p></section><section class="rt-panel">' + rtSection("Feed and integration exceptions", "Integration Monitor findings · volumes, availability, and technical evidence") + rtToolbar(false) + rtCaseTable(rtCases("partners")) + '</section>' + rtSnapshot() + '</div>';
  };
  function rtWorkflowPage(id) {
    var w = rtWorkflow(id), cases = rtCases(id), kind = { orders: "Order commitments", shipments: "Shipment readiness", invoices: "Settlement investigation" }[id];
    var stages = { orders: ["Purchase order", "Acknowledgment", "Order change", "Recommitment"], shipments: ["Pack evidence", "ASN validation", "Acceptance", "Receiving evidence"], invoices: ["Invoice", "Order / receipt match", "Adjustment", "Evidence review"] }[id];
    var texts = {
      orders: ["Acknowledge the right version. Make quantity and date changes visible before they affect fulfillment.", "Commitment exceptions", "2", "Partner-specific deadlines", "Change acknowledgments", "1", "Latest order version must be accepted", "Decision owners", "Order management", "Commercial changes stay with the owner"],
      shipments: ["Separate ASN conformance, business acceptance, and physical receiving evidence.", "Readiness exceptions", "2", "Packing and sequence checks", "Receipt visibility", "Incomplete", "ASN acceptance is not proof of delivery", "Decision owners", "Logistics + EDI", "Review the evidence before release"],
      invoices: ["Compare source documents, explain the variance, and assemble the evidence for a decision.", "Invoice price variance", "$300", "Difference from accepted order price", "Observed deductions", "$750", "Validity and recovery are unconfirmed", "Decision owners", rtRole === "retailer" ? "AP + compliance" : "AR + deductions", "Prepared evidence is not recovered cash"]
    }[id];
    return '<div class="rt-page">' + rtHeading(w.title, texts[0], rtNavButton("Dashboard", "dash"), "Uses Performance Monitor document data") + '<p class="rt-note">Reference process sequence</p><div class="rt-process" aria-label="' + rte(kind) + '">' + stages.map(function (s, i) { return '<div class="rt-step"><i>' + (i + 1) + '</i><span>' + rte(s) + '</span></div>'; }).join('') + '</div><div class="rt-metrics">' + rtMetric(texts[1], texts[2], texts[3]) + rtMetric(texts[4], texts[5], texts[6]) + rtMetric(texts[7], texts[8], texts[9]) + rtMetric("Prepared next steps", cases.filter(function (c) { return rtCS(c).status === "prepared"; }).length + "/" + cases.length, "Review in the action queue", "act") + '</div><section class="rt-panel">' + rtSection("Exceptions to investigate", "Open a case to inspect the policy, document chain, and recommended next step.", rtButton("Export cases", 'data-rt-export="' + id + '"')) + rtToolbar(false) + rtCaseTable(cases) + '</section><div class="rt-grid">' + cases.map(function (c) { var x = rtContext(c); return '<section class="rt-panel"><div class="rt-section-head"><h3>' + rte(c.reference) + '</h3>' + rtSource(c) + '</div><p>' + rte(x.impact) + '</p><div class="rt-summary-list"><div><span>Policy owner</span><b>' + rte(rtCS(c).owner) + '</b></div><div><span>Evidence</span><b>' + c.documents.length + ' documents / events</b></div></div>' + rtButton("Investigate " + c.reference, 'data-rt-case="' + c.id + '"', true) + '</section>'; }).join('') + '</div>' + rtSnapshot() + '</div>';
  }
  ["orders", "shipments", "invoices"].forEach(function (id) { CXS["rt-" + id] = function () { return rtWorkflowPage(id); }; });
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
    return rtSection("Line-level comparison", c.lineNote || "Source values are shown independently; a missing value is not treated as zero.") + '<div class="rt-table-wrap"><table class="rt-table"><thead><tr>' + fields.map(function (f) { return '<th>' + f[1] + '</th>'; }).join('') + '</tr></thead><tbody>' + c.lines.map(function (l) { return '<tr>' + fields.map(function (f) { var val = l[f[0]]; return '<td>' + (val == null ? '—' : f[0].toLowerCase().indexOf("price") !== -1 ? '$' + Number(val).toFixed(2) : rte(val)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function rtCaseBody(c) {
    var x = rtContext(c), s = rtCS(c), rule = rtRule(c.ruleId);
    if (rtCaseTab === "evidence") {
      var selected = c.documents.filter(function (d) { return d.id === rtDoc; })[0] || c.documents[0];
      return '<div class="rt-docs">' + c.documents.map(function (d, i) { return '<button type="button" class="rt-doc' + (rtDoc === d.id || (!rtDoc && i === 0) ? ' on' : '') + '" data-rt-doc="' + rte(d.id) + '"><b>' + rte(d.type) + '</b><span>' + rte(d.id) + '</span><small>' + rte(d.time) + '</small></button>'; }).join('') + '</div>' +
        '<section class="rt-panel"><div class="rt-section-head"><h3>' + rte(selected.type) + ' · ' + rte(selected.id) + '</h3>' + rtChip(rtLabel(selected.status), selected.status === "pass" ? "ready" : selected.status === "fail" ? "critical" : "unknown") + '</div><p>' + rte(selected.detail) + '</p><span class="rt-note">Observed: ' + rte(selected.time) + ' · Case flow: ' + rte(x.direction || "Configured partner direction") + '</span></section>' + rtSection("Policy checks", c.policy || (rule ? rule.condition : "Configured partner policy")) + rtChecks(c) + rtLineTable(c) + (c.deductions ? rtDeductionTable(c) : '') + (c.evidenceGap ? '<div class="rt-callout"><b>Evidence still needed</b><p>' + rte(c.evidenceGap) + '</p></div>' : '') + '<p class="rt-note">' + rte(c.evidenceNotes || "Illustrative source records for this demonstration. Transport acceptance alone is not business acceptance.") + '</p>';
    }
    if (rtCaseTab === "activity") return rtSection("Document and decision timeline", "Business evidence and local demo actions are recorded separately.") + rtTimeline(c);
    if (rtCaseTab === "action") {
      return '<div class="rt-evidence-layout"><div><h3>Prepare the next step</h3><p>' + rte(x.nextAction) + '</p><div class="rt-form-grid"><label class="rt-field">Owner<select data-rt-owner>' + [c.owner, "EDI operations lead", "Order management lead", "Logistics planner", "Deductions analyst", "Finance lead"].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (o) { return '<option' + ((s.draftOwner || s.owner) === o ? ' selected' : '') + '>' + rte(o) + '</option>'; }).join('') + '</select></label><label class="rt-field">Decision status<input value="' + rte(rtLabel(s.status)) + '" readonly></label></div><label class="rt-field">Investigation note<textarea data-rt-note rows="4" placeholder="Record the evidence, decision, or follow-up needed.">' + rte(s.draftNote != null ? s.draftNote : (s.note || '')) + '</textarea></label><div class="rt-form-actions">' + rtButton("Save owner and note", 'data-rt-save-case="' + c.id + '"') + '</div>' + (s.status === "prepared" ? '<div class="rt-callout"><b>' + rte(c.action.completedLabel) + '</b><p>' + rte(c.action.completionNote) + '</p></div>' : '') + '</div><aside class="rt-panel"><h3>Handoff packet</h3><ul class="rt-summary-list"><li>Partner and business reference</li><li>Policy and observed exceptions</li><li>' + c.documents.length + ' source documents / events</li><li>Evidence gaps and assigned owner</li><li>Decision and investigation note</li></ul><p class="rt-note">Preparation is local to the demo. External execution belongs in the responsible operational application.</p>' + rtButton("Export evidence packet", 'data-rt-export-case="' + c.id + '"') + '</aside></div>';
    }
    return '<div class="rt-evidence-layout"><div><div class="rt-callout"><b>' + rte(x.impact) + '</b><p>' + rte(x.summary) + '</p></div>' + rtSection("Why this was raised", c.source === "IM" ? "Feed-level observation from Integration Monitor" : "Business-document observation from Performance Monitor") + '<p>' + rte(c.explanation) + '</p>' + '<div class="rt-docs">' + c.documents.map(function (d) { return '<button type="button" class="rt-doc" data-rt-doc="' + rte(d.id) + '"><b>' + rte(d.type) + '</b><span>' + rte(d.id) + '</span><small>' + rte(d.time) + '</small></button>'; }).join('') + '</div>' +
      (c.evidenceGap ? '<div class="rt-note"><b>Evidence boundary:</b> ' + rte(c.evidenceGap) + '</div>' : '') + '<h3>Recommended next step</h3><p>' + rte(x.nextAction) + '</p>' + rtButton("Review checks and evidence", 'data-rt-tab="evidence"') + '</div><aside class="rt-panel">' + rtKV([["Partner", x.partner], ["Direction", x.direction || "Configured partner direction"], ["Reference", c.reference], ["Monitor", c.source === "IM" ? "Integration Monitor" : "Performance Monitor"], ["Agent", c.agent], ["Owner", s.owner], ["Business process", PROCESSES.retail[c.process].n]]) + (c.amount ? rtKV([[c.amountLabel || "Amount under review", rtMoney(c.amount)]]) : '') + '<div class="rt-form-actions">' + rtButton("Inspect policy", 'data-rt-rule="' + rte(c.ruleId) + '"') + rtButton("Process context", 'data-rt-process="' + c.process + '"') + '</div></aside></div>';
  }
  function rtDeductionTable(c) {
    return rtSection("Deduction breakdown", "Recorded adjustments; validity and recovery remain unconfirmed.") + '<div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Reason</th><th>Observed amount</th><th>Required evidence</th><th>Status</th></tr></thead><tbody>' + c.deductions.map(function (d) { return '<tr><td><b>' + rte(d.label) + '</b><span class="rt-cell-sub">' + rte(d.code) + '</span></td><td>' + rtMoney(d.amount) + '</td><td>' + rte(d.evidence) + '</td><td>' + rtChip("Unconfirmed", "unknown") + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function rtDialog(title, eyebrow, body, footer, tabs, compact) {
    return '<div class="rt-backdrop" data-rt-backdrop><section class="rt-dialog' + (compact ? ' compact' : '') + '" role="dialog" aria-modal="true" aria-labelledby="rt-dialog-title" tabindex="-1"><header class="rt-dialog-head"><div class="rt-dialog-title"><span class="rt-eyebrow">' + rte(eyebrow) + '</span><h2 id="rt-dialog-title">' + rte(title) + '</h2></div><button type="button" class="rt-close rt-icon-button" data-rt-close aria-label="Close detail">' + ci("x") + '</button></header>' + (tabs || '') + '<div class="rt-dialog-body">' + body + '</div><footer class="rt-dialog-footer">' + footer + '</footer></section></div>';
  }
  function rtCaseDialog(c) {
    var s = rtCS(c), tabs = '<div class="rt-dialog-tabs" role="tablist" aria-label="Case detail">' + [["overview", "Overview"], ["evidence", "Evidence"], ["activity", "Activity"], ["action", "Next action"]].map(function (t) { return '<button type="button" role="tab" class="' + (rtCaseTab === t[0] ? 'on' : '') + '" aria-selected="' + (rtCaseTab === t[0]) + '" data-rt-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    return rtDialog(c.title, rtContext(c).partner + " · " + c.reference, '<div class="rt-detail-status">' + cxTag("RT") + rtSource(c) + rtChip(rtLabel(c.severity), c.severity) + rtStatus(c) + '<span>' + rte(c.agent) + ' · ' + rte(s.owner) + '</span></div>' + rtCaseBody(c), '<span class="rt-note">' + (s.status === "prepared" ? 'Task prepared; the business exception remains open.' : 'Review evidence before preparing the next step.') + '</span>' + rtButton("Assign / add note", 'data-rt-tab="action"') + rtButton(s.status !== "prepared" ? c.action.label : "Review prepared action", s.status !== "prepared" ? 'data-rt-prepare="' + c.id + '"' : 'data-rt-tab="action"', true), tabs);
  }
  function rtPartnerDialog(p) {
    var cv = rtCoverage(p), cases = RTDATA.cases.filter(function (c) { return rtContext(c).partner === p.names[rtRole]; });
    return rtDialog(p.names[rtRole], "Integration Monitor · Participation profile", '<div class="rt-metrics">' + rtMetric(p.status === "onboarding" ? "Required test routes" : "Required active", cv.healthy + "/" + cv.total, p.status === "onboarding" ? "Onboarding test evidence" : "Partner-specific feed coverage") + rtMetric("Last activity", p.lastActivity, "Illustrative observed event") + rtMetric("Owner", p.owner, "Integration responsibility") + rtMetric("Watchlist", rtBag().watches[p.id] ? "Watching" : "Not watched", "Your local demo preference") + '</div><div class="rt-table-wrap"><table class="rt-table"><thead><tr><th>Document</th><th>Required</th><th>Observed status</th><th>Last seen</th><th>Context</th></tr></thead><tbody>' + p.documents.map(function (d) { return '<tr><td><b>' + rte(d.type) + '</b><span class="rt-cell-sub">' + rte(d.label) + '</span></td><td>' + (d.required ? 'Required' : 'Optional / out of scope') + '</td><td>' + rtChip(d.status === "healthy" && p.status === "onboarding" ? "Test observed" : rtLabel(d.status), ({ healthy: "ready", late: "attention", missing: "critical", unconfigured: "unknown", "not-required": "neutral" })[d.status]) + '</td><td>' + rte(d.lastSeen || 'No observation') + '</td><td>' + rte(d.detail) + '</td></tr>'; }).join('') + '</tbody></table></div>' + (cases.length ? rtSection("Related exceptions", "Open the finding to examine integration or business evidence.") + rtCaseTable(cases, "compact") : '<div class="rt-note">No linked exceptions in this curated demo. Coverage alone does not establish process compliance.</div>'), rtButton("Close", "data-rt-close") + rtButton(rtBag().watches[p.id] ? "Remove from watchlist" : "Add to watchlist", 'data-rt-watch="' + p.id + '"', true));
  }
  function rtProcessDialog(index) {
    var p = PROCESSES.retail[index], cases = RTDATA.cases.filter(function (c) { return c.process === index; });
    return rtDialog(p.n, "Process Genome · Retail and CPG", '<p>' + rte(p.outcome) + '</p>' + rtKV([["Business owner", p.owner || "Process owner"], ["Connected exceptions", cases.length], ["Reference", "Process Genome definition"]]) + '<ol class="rt-timeline">' + p.steps.map(function (s, i) { return '<li class="rt-event"><time>Step ' + (i + 1) + '</time><div><b>' + rte(s[0]) + '</b><p>' + rte(s[1]) + '</p></div></li>'; }).join('') + '</ol>' + (cases.length ? rtCaseTable(cases, "compact") : ''), rtButton("Close", "data-rt-close") + '<a class="rt-button primary" href="' + CC_GENOME + '">Open Process Genome</a>');
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
    var results = rtRuleDraft.tested ? '<div class="rt-callout" data-rt-rule-results><b>Test complete · 2 fixtures evaluated</b>' + rtEvaluateRule(rule, rtRuleDraft.threshold).map(function (result) { return '<p><b>' + rte(result.label) + ': ' + (result.pass ? 'Pass' : 'Finding') + '</b><br>' + rte(result.value + ' ' + (rule.test.measure || rule.unit)) + ' · ' + rte(result.pass ? rule.test.passDecision : rule.test.failDecision) + '</p>'; }).join('') + '<small>Evaluated against the current demo threshold. No live records changed.</small></div>' : '';
    var body = '<div class="rt-evidence-layout"><div>' + rtKV([["Agent", rule.agent], ["Partner / process scope", rule.scope], ["Condition", rule.condition], ["Required evidence", rule.evidence]]) + '<label class="rt-field">' + (numeric ? 'Policy threshold' : 'Policy requirement') + '<input data-rt-threshold ' + (numeric ? 'type="number" min="0" step="any"' : 'type="text"') + ' value="' + rte(rtRuleDraft.threshold) + '"><span>' + rte(rule.unit || "Configured for this demo partner") + '</span></label><div class="rt-callout"><b>Evidence gate</b><p>' + rte(rule.guardrail) + '</p></div></div><aside class="rt-panel"><h3>Test before activation</h3><p>Run the configured policy against two illustrative fixtures.</p>' + rtKV([[rule.test.passLabel || "Fixture A", rule.test.pass], [rule.test.failLabel || "Fixture B", rule.test.fail]]) + rtButton("Run policy test", 'data-rt-test-rule="' + rule.id + '"', true) + results + '</aside></div>';
    return rtDialog(rule.name, "Retail policy · " + rule.agent + (saved && saved.active ? " · Active in demo" : " · Template"), body, '<span class="rt-note">Activation records a demo configuration for this perspective.</span>' + rtButton("Close", "data-rt-close") + '<button type="button" class="rt-button primary" data-rt-activate-rule="' + rule.id + '"' + (!rtRuleDraft.tested ? ' disabled' : '') + '>Activate in demo</button>');
  }
  /* Retail policy templates sit with the rules in Configuration */
  CXCFG.push(function () {
    return cxCard("Retail policies", '<p class="cx-sub">Inspect the partner scope, required evidence and policy test before activation.</p><div class="rt-grid">' + RTDATA.rules.map(function (r) { var saved = rtBag().rules[r.id]; return '<section class="rt-panel rt-rule"><div class="rt-section-head"><span class="rt-source ' + (r.agent === "Ivy" ? "im" : "pm") + '">' + (r.agent === "Ivy" ? "IM" : "PM") + ' · ' + rte(r.agent) + '</span>' + rtChip(saved && saved.active ? "Active in demo" : "Template", saved && saved.active ? "info" : "neutral") + '</div><h3>' + rte(r.name) + '</h3><p>' + rte(r.condition) + '</p><p class="rt-note">' + rte(r.scope) + '</p>' + rtButton("Inspect and test", 'data-rt-rule="' + r.id + '"') + '</section>'; }).join('') + '</div>', "", cxTag("RT"));
  });

  /* The Retail add-on: its workspaces in the navigation, its cases in the shared findings and action queue, its components on the dashboard. */
  CXNAV.push(["rt", "Retail add-on", "flow", [["rt-partners", "Partner participation", "users"], ["rt-orders", "Orders and commitments", "doc"], ["rt-shipments", "ASNs and readiness", "box"], ["rt-invoices", "Invoices and deductions", "chart"]]]);
  function rtAt(c) { var t = String((c.timeline[c.timeline.length - 1] || {}).time || ""), m = /(\d\d:\d\d)$/.exec(t); return m && (t === m[1] || t.indexOf(RTDATA.snapshot.date.slice(8) + " Oct") === 0) ? "Today, " + m[1] : t; }
  CXITEMS.push(function () {
    return RTDATA.cases.map(function (c) {
      var x = rtContext(c), s = rtCS(c), rule = rtRule(c.ruleId), w = rtWorkflow(c.workflow), at = rtAt(c);
      return { key: "rt:" + c.id, mod: "RT", title: c.title, partner: x.partner, check: rule ? rule.name : c.reference, proc: c.process, sev: c.severity === "critical" ? "h" : "m",
        agent: c.agent + " · " + w.title, owner: s.owner, status: ({ open: "New", assigned: "Assigned", prepared: "Action prepared" })[s.status] || "New", done: false, at: at, ord: cxOrd(at.replace(/^Today, /, "")), val: c.amount || 0,
        open: 'data-rt-case="' + rte(c.id) + '"', act: x.nextAction, appr: s.owner, actDone: s.status === "prepared", actState: c.action.completedLabel + ". " + c.action.completionNote,
        actBtn: '<button type="button" class="cx-btn p" data-rt-prepare="' + rte(c.id) + '">' + rte(c.action.label) + '</button>' };
    });
  });
  CXDASH.push(
    { o: 30, mod: "RT", w: 2, t: "Retail workflows", h: function () {
      return '<ul class="rt-wl">' + RTDATA.workflows.map(function (w) {
        var cases = rtCases(w.id), hi = cases.filter(function (c) { return c.severity === "critical"; }).length;
        return '<li><button type="button" data-cxgo="rt-' + w.id + '">' + rtIcon(["users", "flow", "box", "doc"][RTDATA.workflows.indexOf(w)]) + '<span><b>' + rte(w.title) + '</b><small>' + rte(w.subtitle) + '</small></span><em>' + cases.length + '</em>' + (hi ? '<i class="rt-hi">' + hi + ' high</i>' : '') + '</button></li>'; }).join('') + '</ul>'; },
      f: function () { return '<span class="cx-note">Open cases by workflow</span>'; } },
    { o: 90, mod: "RT", w: 2, t: "Partner participation", h: function () {
      var total = 0, healthy = 0, late = 0, gaps = 0;
      RTDATA.partners.forEach(function (p) { p.documents.forEach(function (d) { if (!d.required) return; if (p.status !== "onboarding") { total++; if (d.status === "healthy") healthy++; } if (d.status === "missing" || d.status === "late") late++; if (d.status === "unconfigured") gaps++; }); });
      return '<div class="cx-k2">' + cxKpi("Production feeds active", healthy + "/" + total, "Required routes") + cxKpi("Late or missing", late, "Feed window breached") + cxKpi("Configuration gaps", gaps, "Required route not set up") + cxKpi(rtProfile().partnerLabel, RTDATA.partners.length, "In this demo") + '</div>'; },
      f: function () { return cxGoBtn("Participation matrix", "rt-partners"); } }
  );
  CXACTX.push(function () { return '<span class="rt-head-actions">' + rtButton("Export retail cases", 'data-rt-export="actions"') + rtButton("Reset demo", "data-rt-reset") + '</span>'; });
  CXQ.push({ q: function () { return "What does the order-feed failure prove?"; }, a: function () { var c = rtCase("rt-partner-signature"); return [c.explanation + " " + c.evidenceGap, ccItems().filter(function (i) { return i.key === "rt:" + c.id; })]; } },
    { q: function () { return "Which evidence is still missing?"; }, a: function () {
      return ["Shipping and settlement cases need receiving, approval, or price-authorization evidence. An ASN or functional acknowledgment alone cannot establish physical receipt or deduction validity.",
        ccItems().filter(function (i) { return /^rt:rt-(shipment|invoice)/.test(i.key); })]; } });
  var rtBaseRender = cxRender, rtBaseDrawer = cxDrawer;
  cxDrawer = function () {
    if (!ccDr || ccDr[0].indexOf("rt-") !== 0) return rtBaseDrawer();
    if (ccDr[0] === "rt-case") return rtCaseDialog(rtCase(ccDr[1]));
    if (ccDr[0] === "rt-partner") return rtPartnerDialog(rtPartner(ccDr[1]));
    if (ccDr[0] === "rt-rule") return rtRuleDialog(rtRule(ccDr[1]));
    if (ccDr[0] === "rt-process") return rtProcessDialog(Number(ccDr[1]));
    if (ccDr[0] === "rt-reset") return rtDialog("Reset this demo perspective?", rtProfile().company, '<p>This clears locally prepared actions, notes, watchlist entries, and activated demo policies for ' + rte(rtProfile().label) + '. You can immediately replay every scenario.</p>', rtButton("Keep exploring", "data-rt-close") + rtButton("Reset perspective", "data-rt-confirm-reset", true), '', true);
    if (ccDr[0] === "rt-help") return rtDialog("Command Center for Retail and CPG", "Clickable prototype", '<p>One dashboard, one findings list and one action queue across three modules. Each dashboard component and finding names its module.</p><dl class="rt-kv"><div><dt>Integration Monitor</dt><dd>Network activity, partner connections and volume anomalies</dd></div><div><dt>Performance Monitor</dt><dd>Business process rules, agents and findings</dd></div><div><dt>Retail add-on</dt><dd>Partner participation, order commitments, shipment readiness and settlement</dd></div></dl><ol><li>Switch between the retailer and CPG supplier perspectives.</li><li>Open a finding to inspect its evidence, rule and business process.</li><li>Approve or prepare the recommended action in the action queue.</li></ol><div class="rt-callout">All partners, records, metrics, and action outcomes are illustrative. No live network or operational application is connected.</div>', rtButton("Start exploring", "data-rt-close", true), '', true);
    return '';
  };
  cxRender = function () {
    var oldMain = cx.querySelector(".cx-main"), scroll = oldMain ? oldMain.scrollTop : 0;
    rtBaseRender();
    cx.classList.add("rt-app");
    var toolbar = cx.querySelector(".cx-tb");
    if (toolbar) toolbar.insertAdjacentHTML("beforebegin", '<div class="rt-role" role="group" aria-label="Demo perspective"><span>Demo perspective</span><button type="button" class="' + (rtRole === "retailer" ? 'on' : '') + '" data-rt-role="retailer" aria-pressed="' + (rtRole === "retailer") + '">Retailer</button><button type="button" class="' + (rtRole === "supplier" ? 'on' : '') + '" data-rt-role="supplier" aria-pressed="' + (rtRole === "supplier") + '">CPG supplier</button></div>');
    var help = cx.querySelector("[data-cxhelp]"); if (help) help.setAttribute("data-rt-help", "");
    var main = cx.querySelector(".cx-main"); if (main) main.scrollTop = scroll;
    if (rtToastText) cx.insertAdjacentHTML("beforeend", '<div class="rt-toast" role="status">' + ci("ok") + '<span>' + rte(rtToastText) + '</span></div>');
    var dialog = cx.querySelector(".rt-dialog");
    if (dialog) {
      var base = cx.querySelector(".cx-body"), top = cx.querySelector(".cx-top");
      if (base) base.inert = true; if (top) top.inert = true;
      dialog.focus({ preventScroll: true });
    }
  };

  function rtToast(message) {
    rtToastText = message; clearTimeout(rtToastTimer);
    rtToastTimer = setTimeout(function () { rtToastText = ''; var t = cx.querySelector(".rt-toast"); if (t) t.remove(); }, 4200);
  }
  function rtOpen(type, id, tab) {
    var active = document.activeElement;
    if (ccDr && ccDr[0].indexOf("rt-") === 0) rtModalStack.push({ drawer: ccDr.slice(), tab: rtCaseTab, doc: rtDoc, trigger: rtFocusBack, rule: rtRuleDraft });
    else rtModalStack = [];
    rtFocusBack = null;
    if (active && active.getAttributeNames) {
      var attrs = active.getAttributeNames(), attr = attrs.filter(function (name) { return name.indexOf("data-rt-") === 0; })[0];
      if (attr) rtFocusBack = { attr: attr, value: active.getAttribute(attr) };
    }
    ccDr = [type, id]; rtCaseTab = tab || "overview"; rtDoc = ''; rtRuleDraft = null; cxRender();
  }
  function rtClose() {
    var focus = rtFocusBack;
    if (rtModalStack.length) { var previous = rtModalStack.pop(); ccDr = previous.drawer; rtCaseTab = previous.tab; rtDoc = previous.doc; rtFocusBack = previous.trigger; rtRuleDraft = previous.rule; }
    else { ccDr = null; rtRuleDraft = null; }
    cxRender();
    if (focus) { var controls = cx.querySelectorAll('[' + focus.attr + ']'); for (var i = 0; i < controls.length; i++) if (controls[i].getAttribute(focus.attr) === focus.value) { controls[i].focus({ preventScroll: true }); break; } }
  }
  function rtRecord(c, title, detail) {
    rtCS(c).history.push({ time: "Demo action", title: title, detail: detail, status: "pass" });
    rtSave();
  }
  function rtSaveCase(c) {
    var owner = cx.querySelector("[data-rt-owner]"), note = cx.querySelector("[data-rt-note]"), s = rtCS(c);
    if (owner) s.owner = owner.value;
    if (note) s.note = note.value.trim();
    delete s.draftOwner; delete s.draftNote;
    if (s.status === "open") s.status = "assigned";
    rtRecord(c, "Owner and investigation note saved", "Assigned to " + s.owner + (s.note ? ". Note: " + s.note : "."));
  }
  function rtDownload(filename, content, type) {
    var blob = new Blob([content], { type: type || "text/plain;charset=utf-8" }), url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function rtCSV(rows) { return rows.map(function (row) { return row.map(function (v) { var s = String(v == null ? '' : v); if (/^[=+@-]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'); }
  function rtExport(kind) {
    var rows;
    if (kind === "coverage") {
      rows = [["Demo perspective", "Partner", "Document", "Required", "Status", "Last seen", "Context"]];
      RTDATA.partners.forEach(function (p) { p.documents.forEach(function (d) { rows.push([rtProfile().label, p.names[rtRole], d.type, d.required ? "Yes" : "No", rtLabel(d.status), d.lastSeen, d.detail]); }); });
    } else {
      rows = [["Demo perspective", "Case", "Partner", "Reference", "Monitor", "Agent", "Priority", "Owner", "Action status", "Amount under review", "Evidence gap", "Note"]];
      (kind === "actions" ? RTDATA.cases : rtCases(kind)).forEach(function (c) { var s = rtCS(c); rows.push([rtProfile().label, c.title, rtContext(c).partner, c.reference, c.source, c.agent, rtLabel(c.severity), s.owner, rtLabel(s.status), c.amount || '', c.evidenceGap || '', s.note || '']); });
    }
    rtDownload("retail-" + rtRole + "-" + kind + "-demo.csv", '\ufeff' + rtCSV(rows), "text/csv;charset=utf-8"); rtToast("Demo export prepared."); cxRender();
  }
  function rtExportCase(c) {
    var x = rtContext(c), s = rtCS(c);
    var text = ["COMMAND CENTER FOR RETAIL AND CPG — ILLUSTRATIVE EVIDENCE PACKET", "", "Perspective: " + rtProfile().label + " / " + rtProfile().company, "Case: " + c.title, "Reference: " + c.reference, "Partner: " + x.partner, "Monitor: " + c.source + " / " + c.agent, "Owner: " + (s.draftOwner || s.owner), "Action status: " + rtLabel(s.status), "", "OBSERVATION", x.summary, x.impact, "", "PARTNER POLICY", c.policy, "", "AMOUNT", c.amount ? (c.amountLabel || "Amount under review") + ": " + rtMoney(c.amount) : "No financial amount inferred", "", "EVIDENCE", c.documents.map(function (d) { return d.type + " | " + d.id + " | " + d.time + " | " + d.status + " | " + (d.detail || ""); }).join('\n'), "", "CHECKS", c.checks.map(function (ch) { return ch.name + " | Expected: " + ch.expected + " | Observed: " + ch.observed + " | " + ch.status; }).join('\n'), "", "LINE COMPARISONS", c.lines ? JSON.stringify(c.lines, null, 2) : "No line comparison for this case.", c.lineNote || "", "", "DEDUCTIONS", c.deductions ? JSON.stringify(c.deductions, null, 2) : "No deduction breakdown for this case.", "", "EVIDENCE GAP", c.evidenceGap || "No additional gap recorded in this illustrative case.", "", "NEXT STEP", x.nextAction, "", "INVESTIGATION NOTE", s.draftNote != null ? s.draftNote + " (unsaved draft)" : s.note || "No note recorded.", "", "This packet contains fictional demo data. Preparation does not send a document, decide a dispute, confirm delivery, or recover money."].join('\n');
    rtDownload("retail-evidence-" + c.id + "-" + rtRole + ".txt", text); rtToast("Evidence packet exported for review."); cxRender();
  }

  cx.addEventListener("click", function (event) {
    var b = event.target.closest('[data-rt-role],[data-rt-case],[data-rt-partner],[data-rt-rule],[data-rt-process],[data-rt-tab],[data-rt-doc],[data-rt-watch],[data-rt-close],[data-rt-prepare],[data-rt-save-case],[data-rt-reset],[data-rt-confirm-reset],[data-rt-test-rule],[data-rt-activate-rule],[data-rt-export],[data-rt-export-case],[data-rt-clear],[data-rt-help]');
    if (!b) { if (event.target.hasAttribute && event.target.hasAttribute("data-rt-backdrop")) rtClose(); return; }
    var id;
    if (b.hasAttribute("data-rt-role")) { rtRole = b.getAttribute("data-rt-role"); rtSave(); ccDr = null; rtFilters = {}; ccAvLog = []; rtModalStack = []; rtToast("Demo perspective: " + rtProfile().label); cxRender(); return; }
    if (b.hasAttribute("data-rt-case")) return rtOpen("rt-case", b.getAttribute("data-rt-case"), b.getAttribute("data-rt-open-tab"));
    if (b.hasAttribute("data-rt-partner")) return rtOpen("rt-partner", b.getAttribute("data-rt-partner"));
    if (b.hasAttribute("data-rt-rule")) return rtOpen("rt-rule", b.getAttribute("data-rt-rule"));
    if (b.hasAttribute("data-rt-process")) return rtOpen("rt-process", b.getAttribute("data-rt-process"));
    if (b.hasAttribute("data-rt-close")) return rtClose();
    if (b.hasAttribute("data-rt-tab")) { rtCaseTab = b.getAttribute("data-rt-tab"); cxRender(); var tabButton = cx.querySelector('[role="tab"][data-rt-tab="' + rtCaseTab + '"]'); if (tabButton) tabButton.focus({ preventScroll: true }); return; }
    if (b.hasAttribute("data-rt-doc")) { rtDoc = b.getAttribute("data-rt-doc"); rtCaseTab = "evidence"; cxRender(); return; }
    if (b.hasAttribute("data-rt-watch")) { id = b.getAttribute("data-rt-watch"); rtBag().watches[id] = !rtBag().watches[id]; rtSave(); rtToast(rtBag().watches[id] ? "Partner added to your demo watchlist." : "Partner removed from your demo watchlist."); cxRender(); return; }
    if (b.hasAttribute("data-rt-prepare")) { var c = rtCase(b.getAttribute("data-rt-prepare")); var s = rtCS(c); if (cx.querySelector("[data-rt-note]")) rtSaveCase(c); s.status = "prepared"; rtRecord(c, c.action.completedLabel, c.action.completionNote); rtCaseTab = "action"; rtToast("Next step prepared. The business exception remains open."); cxRender(); return; }
    if (b.hasAttribute("data-rt-save-case")) { rtSaveCase(rtCase(b.getAttribute("data-rt-save-case"))); rtToast("Owner and investigation note saved."); cxRender(); return; }
    if (b.hasAttribute("data-rt-reset")) return rtOpen("rt-reset", "reset");
    if (b.hasAttribute("data-rt-confirm-reset")) { delete rtState[rtRole]; rtBag(); rtSave(); rtFilters = {}; ccDr = null; rtModalStack = []; rtToast("This perspective is ready to replay."); cxRender(); return; }
    if (b.hasAttribute("data-rt-help")) return rtOpen("rt-help", "help");
    if (b.hasAttribute("data-rt-test-rule")) { var input = cx.querySelector("[data-rt-threshold]"); var rule = rtRule(b.getAttribute("data-rt-test-rule")); var v = input.value.trim(); if (!v || (typeof rule.threshold === "number" && (!isFinite(Number(v)) || Number(v) < 0))) { input.setCustomValidity("Enter a valid policy threshold."); input.reportValidity(); return; } input.setCustomValidity(""); rtRuleDraft.threshold = typeof rule.threshold === "number" ? Number(v) : v; rtRuleDraft.tested = true; cxRender(); return; }
    if (b.hasAttribute("data-rt-activate-rule")) { if (!rtRuleDraft || !rtRuleDraft.tested) return; rtBag().rules[rtRuleDraft.id] = { threshold: rtRuleDraft.threshold, active: true }; rtSave(); rtToast("Policy activated in this demo perspective."); rtClose(); return; }
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
  cx.addEventListener("keydown", function (event) {
    var dialog = cx.querySelector(".rt-dialog"); if (!dialog) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); rtClose(); return; }
    if (event.key === "Tab") { var items = dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'); if (!items.length) return; var first = items[0], last = items[items.length - 1]; if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first.focus(); } }
  });
