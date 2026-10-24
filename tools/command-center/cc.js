  /* Command Center for Retail and CPG (owner, Oct 24): the Command Center prototype (Analytics, Integration Monitor,
     Performance Monitor, Aviator) recreated in this site, extended with business process monitoring and AI agents.
     Illustrative values for the concept preview. Demo customer: Nuvori Beauty, a beauty and personal care supplier. */
  var ccEl = document.getElementById("cc"), ccFrame = document.getElementById("cc-frame"), cx = document.getElementById("cx");
  var ccScr = "pm-dash", ccGrp = { im: false, pm: true }, ccNavMin = false, ccAv = false, ccDr = null, ccTab = "sc", ccTpt = "Customer", ccFAgent = "all", ccPj = 0, ccAvLog = [];
  var ccDone = {};
  var CCNET = /^(\d{3}|GDSN)/;
  function ccToks(lbl) { return lbl.split(" / ")[0].replace(/^GDSN /, "").split(/,\s*| or /); }

  /* Icons (Lucide paths) */
  var CXI = {
    chart: '<path d="M3 3v18h18"/><path d="M7 16h3V9H7zM14 16h3V5h-3z"/>', im: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4"/>',
    pm: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>', dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    net: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M12 11l-6 6M12 11l6 6"/>',
    trend: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>', map: '<path d="M4 4h6v6H4zM14 14h6v6h-6z"/><path d="M10 7h4a3 3 0 0 1 3 3v4"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h4a2 2 0 0 1 2 2v7"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M8 4h8M9 14h.01M15 14h.01"/>',
    rules: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>', spark: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>', help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    chev: '<path d="m9 18 6-6-6-6"/>', down: '<path d="m6 9 6 6 6-6"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', side: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>', warn: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>', plus: '<path d="M12 5v14M5 12h14"/>', filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>'
  };
  function ci(n, c) { return '<svg class="ci' + (c ? " " + c : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + CXI[n] + '</svg>'; }
  function cxe(s) { return esc(s); }

  /* Agents: four from the prototype, plus a volume agent that turns Integration Monitor anomalies into findings */
  var CXA = [
    { id: "lex", n: "Lex", r: "Timing and SLA agent", d: "Watches every document clock: acknowledgment windows, ship notice timing, delivery events and shipping advice.", f: ["f1", "f3", "f6", "f8"] },
    { id: "nora", n: "Nora", r: "Conformance agent", d: "Checks documents against partner rules before and after they are sent: price, quantity, labels and required fields.", f: ["f4", "f11"] },
    { id: "liz", n: "Liz", r: "Process agent", d: "Follows each business process across documents and systems, and flags steps that will fail later in the process.", f: ["f9"] },
    { id: "reese", n: "Reese", r: "Reconciliation agent", d: "Matches deductions, credits and remittances to orders, shipments and invoices, and builds dispute backup.", f: ["f5"] },
    { id: "ivy", n: "Ivy", r: "Volume agent", d: "Compares document volume with its projection by partner and hour, and raises missing feeds and volume drops as findings.", f: ["f2", "f7", "f10"], nw: true }
  ];
  var CXAF = {}; CXA.forEach(function (a) { a.f.forEach(function (id) { CXAF[id] = a; }); });
  var CXST = { f1: "New", f2: "New", f3: "Acknowledged", f4: "New", f5: "Acknowledged", f6: "New", f7: "New", f8: "Acknowledged", f9: "New", f10: "New", f11: "Acknowledged" };
  var CXAS = { f3: "Dana Ortiz", f5: "Priya Nair", f8: "Sam Lee", f4: "Dana Ortiz" };
  var CXDOC = { f1: "Ship notice (856)", f2: "Purchase order (850)", f3: "Order acknowledgment (855)", f4: "Invoice (810)", f5: "Debit memo (812)", f6: "Shipment status (214)", f7: "Product activity (852)", f8: "Warehouse shipping advice (945)", f9: "Price catalog (832)", f10: "Inventory advice (846)", f11: "Ship notice (856)" };
  var CXRULE = { f1: "Ship notice within 1 hour of pickup", f2: "Order volume against projection", f3: "Acknowledgment within 24 hours", f4: "Invoice matches order price", f5: "Deduction backup inside the dispute window",
    f6: "Delivery events for every tendered load", f7: "Sales feed on schedule", f8: "Shipping advice for every warehouse order", f9: "Cost change loaded before invoicing", f10: "Inventory feed on schedule", f11: "Carton labels carry serial codes" };
  var CXR = [
    ["lex", "Ship notice within 1 hour of pickup", "Ship notice (856)", "Order to cash", 97.1, 31, "1 minute ago", "Active"],
    ["lex", "Acknowledgment within 24 hours", "Order acknowledgment (855)", "Order to cash", 95.8, 44, "3 minutes ago", "Active"],
    ["lex", "Delivery events for every tendered load", "Shipment status (214)", "Routing and delivery", 92.4, 27, "6 minutes ago", "Active"],
    ["lex", "Shipping advice for every warehouse order", "Warehouse shipping advice (945)", "3PL fulfillment", 98.2, 12, "9 minutes ago", "Active"],
    ["nora", "Invoice matches order price", "Invoice (810)", "Order to cash", 96.6, 38, "2 minutes ago", "Active"],
    ["nora", "Carton labels carry serial codes", "Ship notice (856)", "Receive, match and pay", 99.0, 9, "4 minutes ago", "Active"],
    ["nora", "Required fields by partner guide", "All outbound documents", "All processes", 99.4, 6, "5 minutes ago", "Over budget"],
    ["liz", "Cost change loaded before invoicing", "Price catalog (832)", "Item and price synchronization", 94.1, 17, "8 minutes ago", "Active"],
    ["liz", "Ship notice before invoice", "Ship notice (856), Invoice (810)", "Order to cash", 99.3, 4, "7 minutes ago", "Active"],
    ["reese", "Deduction backup inside the dispute window", "Debit memo (812)", "Deductions", 88.5, 23, "14 minutes ago", "Active"],
    ["reese", "Return credit matches an authorization", "Return authorization (180)", "Returns", 97.9, 5, "19 minutes ago", "Paused"],
    ["ivy", "Order volume against projection", "Purchase order (850)", "Order to cash", 93.2, 11, "1 minute ago", "Active"],
    ["ivy", "Inventory feed on schedule", "Inventory advice (846)", "Drop ship and marketplaces", 96.0, 8, "2 minutes ago", "Active"],
    ["ivy", "Sales feed on schedule", "Product activity (852)", "Sales reporting", 98.7, 3, "11 minutes ago", "Active"]
  ];
  var CXP = [["Northfield Stores", "NFS-RT-0112", "Active", "BU-0451", "Mar 4, 2021", "Today, 08:42"], ["Harbor Grocers", "HBG-RT-0207", "Active", "BU-0367", "Jun 18, 2020", "Today, 05:52"],
    ["Westline Home", "WLH-RT-0331", "Active", "BU-0442", "Jan 9, 2022", "Today, 08:31"], ["Brightway Marketplace", "BWM-MP-0415", "Active", "BU-0249", "Sep 27, 2023", "Today, 05:00"],
    ["Lakeshore Market", "LSM-RT-0520", "Active", "BU-0425", "Feb 2, 2024", "Today, 08:12"], ["Pinecrest Department Stores", "PDS-RT-0618", "Active", "BU-0019", "Nov 15, 2019", "Today, 07:58"],
    ["Coastal Drug", "CDR-RT-0702", "Active", "BU-0480", "Apr 30, 2023", "Today, 08:05"], ["Summit Beauty Supply", "SBS-DS-0811", "Inactive", "BU-0082", "Jul 21, 2022", "Aug 3, 2026"],
    ["Ridgeway Freight", "RDF-CA-0905", "Active", "BU-0395", "May 6, 2021", "Today, 08:40"], ["Crestline Logistics", "CRL-3P-1010", "Active", "BU-0132", "Oct 11, 2020", "Today, 07:20"]];

  /* Small chart helpers */
  function cxLine(series, o) {
    var W = o.w || 900, H = o.h || 220, L = 44, B = 26, T = 12, R = 12, n = series[0].v.length, mx = o.max || Math.max.apply(null, [].concat.apply([], series.map(function (s) { return s.v; }))) * 1.15, mn = o.min || 0;
    var x = function (i) { return L + (W - L - R) * i / (n - 1); }, y = function (v) { return T + (H - T - B) * (1 - (v - mn) / (mx - mn)); };
    var s = '<svg class="cx-ch" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + cxe(o.label || "Chart") + '">';
    for (var g = 0; g <= 4; g++) { var gv = mn + (mx - mn) * g / 4, gy = y(gv); s += '<line class="g" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy + '" y2="' + gy + '"/><text class="t" x="' + (L - 8) + '" y="' + (gy + 4) + '" text-anchor="end">' + (o.fmt ? o.fmt(gv) : Math.round(gv)) + '</text>'; }
    (o.xl || []).forEach(function (t, i) { s += '<text class="t" x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + t + '</text>'; });
    if (o.band) s += '<path class="band" d="M' + o.band.map(function (b, i) { return b == null ? "" : x(i) + " " + y(b[1]); }).filter(Boolean).join(" L") + " L" + o.band.map(function (b, i) { return b == null ? "" : x(i) + " " + y(b[0]); }).filter(Boolean).reverse().join(" L") + 'Z"/>';
    series.forEach(function (sr) {
      var pts = sr.v.map(function (v, i) { return v == null ? null : [x(i), y(v)]; }).filter(Boolean);
      if (sr.area) s += '<path class="ar" d="M' + pts[0][0] + ' ' + y(mn) + ' L' + pts.map(function (p) { return p.join(" "); }).join(" L") + ' L' + pts[pts.length - 1][0] + ' ' + y(mn) + 'Z"/>';
      s += '<path class="ln ' + (sr.c || "") + '" d="M' + pts.map(function (p) { return p.join(" "); }).join(" L") + '"/>' + pts.map(function (p) { return '<circle class="dt ' + (sr.c || "") + '" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5"/>'; }).join("");
    });
    if (o.now != null) s += '<line class="now" x1="' + x(o.now) + '" x2="' + x(o.now) + '" y1="' + T + '" y2="' + (H - B) + '"/><text class="nt" x="' + x(o.now) + '" y="' + (T + 2) + '" text-anchor="middle">Now</text>';
    return s + '</svg>';
  }
  function cxDonut(parts, r, mid, sub) {
    var tot = parts.reduce(function (a, p) { return a + p[1]; }, 0), a0 = -Math.PI / 2, s = '<svg class="cx-dn" viewBox="0 0 ' + (2 * r + 20) + ' ' + (2 * r + 20) + '" aria-hidden="true">', c = r + 10, w = r * 0.32;
    parts.forEach(function (p) { var a1 = a0 + 2 * Math.PI * p[1] / tot - 0.02, la = a1 - a0 > Math.PI ? 1 : 0, rr = r - w / 2;
      s += '<path d="M' + (c + rr * Math.cos(a0)) + ' ' + (c + rr * Math.sin(a0)) + ' A' + rr + ' ' + rr + ' 0 ' + la + ' 1 ' + (c + rr * Math.cos(a1)) + ' ' + (c + rr * Math.sin(a1)) + '" fill="none" stroke="' + p[2] + '" stroke-width="' + w + '"/>'; a0 = a1 + 0.02; });
    return s + '<text class="dv" x="' + c + '" y="' + (c + 4) + '" text-anchor="middle">' + mid + '</text><text class="ds" x="' + c + '" y="' + (c + 22) + '" text-anchor="middle">' + (sub || "") + '</text></svg>';
  }
  function cxGauge(parts) {
    parts = parts.filter(function (p) { return p[1] > 0; });
    var tot = parts.reduce(function (a, p) { return a + p[1]; }, 0), a0 = Math.PI, s = '<svg class="cx-gg" viewBox="0 0 240 130" aria-hidden="true">';
    parts.forEach(function (p) { var a1 = a0 + Math.PI * p[1] / tot; s += '<path d="M' + (120 + 90 * Math.cos(a0)) + ' ' + (120 + 90 * Math.sin(a0)) + ' A90 90 0 0 1 ' + (120 + 90 * Math.cos(a1)) + ' ' + (120 + 90 * Math.sin(a1)) + '" fill="none" stroke="' + p[2] + '" stroke-width="30"/>'; a0 = a1; });
    return s + '<text class="dv" x="120" y="118" text-anchor="middle">' + tot + '</text></svg>';
  }
  function cxBars(rows, o) {
    return '<ul class="cx-bars">' + rows.map(function (r) { return '<li><span class="bl">' + cxe(r[0]) + (r[2] ? '<small>' + cxe(r[2]) + '</small>' : '') + '</span><span class="bt"><i class="' + (r[3] || "") + '" style="width:' + Math.round(100 * r[1] / (o.max || 100)) + '%"></i></span><b>' + (o.fmt ? o.fmt(r[1]) : r[1]) + '</b></li>'; }).join("") + '</ul>';
  }
  function cxHeat() {
    var h = '<div class="cx-hm"><span></span>' + Array.apply(null, Array(24)).map(function (_, i) { return '<b>' + (i < 10 ? "0" : "") + i + '</b>'; }).join("");
    for (var d = 0; d < 7; d++) { h += '<span>Day ' + (d + 1) + '</span>'; for (var i = 0; i < 24; i++) { var v = (Math.sin(i / 3.8 - 1.2) + 1) / 2 * (d > 4 ? 0.5 : 1) + ((i * 7 + d * 13) % 10) / 30; h += '<i style="--v:' + Math.min(1, v).toFixed(2) + '"></i>'; } }
    return h + '</div>';
  }

  /* Findings helpers */
  function cxOpen() { return CCF.filter(function (f) { return !ccDone[f.id]; }); }
  function cxSevChip(s) { return s === "c" ? '<span class="cx-sev h">' + ci("warn") + 'High</span>' : '<span class="cx-sev m">' + ci("warn") + 'Medium</span>'; }
  function cxStChip(f) { var st = ccDone[f.id] ? (ccDone[f.id] === 2 ? "Known issue" : "Resolved") : CXST[f.id]; return '<span class="cx-st s-' + st.replace(/ /g, "").toLowerCase() + '"><i></i>' + st + '</span>'; }
  function cxAt(f) { return /^\d/.test(f.at) ? "Today, " + f.at : f.at; }
  function cxAgentName(f) { var a = CXAF[f.id]; return a.n + " · " + a.r; }
  function cxProcName(i) { return PROCESSES.retail[i].n; }
  function cxFindRows(list, opt) {
    var groups = CXA.map(function (a) { return [a, list.filter(function (f) { return CXAF[f.id] === a; })]; }).filter(function (g) { return g[1].length; });
    return '<table class="cx-tbl"><thead><tr><th>Finding</th><th>Rule</th><th>Process</th><th>Trading partner</th><th>Transactions</th>' + (opt && opt.noAs ? '' : '<th>Assigned to</th>') + '<th>Status</th><th>Detected</th><th>Severity</th></tr></thead><tbody>' +
      groups.map(function (g) {
        return '<tr class="gh"><td colspan="9">' + cxe(g[0].n + " · " + g[0].r) + '</td></tr>' + g[1].map(function (f) {
          return '<tr><td><button type="button" class="cx-lk" data-cxf="' + f.id + '">' + cxe(f.ot) + '</button></td><td>' + cxe(CXRULE[f.id]) + '</td><td>' + cxe(GENOME.retail.short[f.p]) + '</td><td>' + cxe(f.partner) + '</td><td>' + cxe(CXDOC[f.id]) + '</td>' +
            (opt && opt.noAs ? '' : '<td>' + cxe(CXAS[f.id] || "Unassigned") + '</td>') + '<td>' + cxStChip(f) + '</td><td>' + cxAt(f) + '</td><td>' + cxSevChip(f.sev) + '</td></tr>';
        }).join("");
      }).join("") + '</tbody></table>';
  }

  /* Screens */
  var CXS = {};
  function cxHead(t, extra) { return '<header class="cx-ph"><h2>' + t + '</h2>' + (extra || "") + '</header>'; }
  function cxCard(t, body, cls, right) { return '<section class="cx-card' + (cls ? " " + cls : "") + '">' + (t ? '<header><h3>' + t + '</h3>' + (right || "") + '</header>' : "") + body + '</section>'; }
  function cxKpi(l, v, s, cls) { return '<div class="cx-kpi' + (cls ? " " + cls : "") + '"><span>' + l + '</span><b>' + v + '</b>' + (s ? '<small>' + s + '</small>' : "") + '</div>'; }
  function cxSeg(name, opts, cur) { return '<span class="cx-seg" role="group">' + opts.map(function (o) { return '<button type="button" data-cxseg="' + name + '" data-v="' + o + '" aria-pressed="' + (o === cur) + '">' + o + '</button>'; }).join("") + '</span>'; }

  var CXCAT = [["Order and fulfillment", "850 PO · 855 PO Ack · 856 ASN", 85, [["PO acknowledgment rate", "855 PO acknowledgment", "96.5%", "≥ 98%", 98, 5, 0], ["PO acknowledgment cycle time", "850 PO to 855 PO acknowledgment", "5.5 hrs", "≤ 4 hrs", 73, 4, 1], ["Order accuracy", "850 PO and 855 PO acknowledgment", "98.2%", "≥ 99%", 99, 5, 0], ["Order fill rate", "855 PO acknowledgment", "95.5%", "≥ 98%", 97, 5, 0], ["Backorder rate", "855 PO acknowledgment", "3.5%", "≤ 2%", 57, 4, 1]]],
    ["Shipping and delivery", "856 ASN · 214 Shipment status", 94, [["Ship notice timeliness", "856 before arrival", "97.1%", "≥ 98%", 96, 6, 0], ["On-time in-full (OTIF)", "850, 856 and 214", "91.5%", "≥ 95%", 96, 8, 1], ["ASN accuracy", "856 against receipt", "98.8%", "≥ 99%", 98, 5, 0]]],
    ["Invoicing and financial", "810 Invoice · 820 Remittance", 90, [["Invoice accuracy rate", "810 against 850 and 856", "96.6%", "≥ 98%", 92, 6, 1], ["Chargeback and deduction rate", "812 against 810", "2.1%", "≤ 1.5%", 64, 5, 1]]],
    ["Inventory and planning", "846 Inventory advice · 852 Product activity", 83, [["Inventory feed timeliness", "846 hourly", "96.0%", "≥ 99%", 81, 4, 1], ["Sales feed completeness", "852 weekly", "98.7%", "≥ 99%", 95, 3, 0]]],
    ["Partner compliance and EDI health", "997 Functional acknowledgments", 92, [["First-pass acceptance", "997 and 824", "97.4%", "≥ 98%", 94, 5, 0], ["Transaction rejection rate", "824 rejections", "1.8%", "≤ 1%", 70, 4, 1]]]];
  CXS["an"] = function () {
    var h = cxHead("Analytics") + '<nav class="cx-tabs"><button type="button" data-cxtab="sc" aria-pressed="' + (ccTab === "sc") + '">Trading partner scorecard</button><button type="button" data-cxtab="km" aria-pressed="' + (ccTab === "km") + '">Key metrics</button></nav>' +
      '<div class="cx-bar"><span class="cx-lb">Trading partner type</span>' + cxSeg("tpt", ["Customer", "Supplier", "Logistics"], ccTpt) + '</div>';
    if (ccTab === "sc") {
      h += '<section class="cx-hero"><div class="cx-ov"><span>Overall trading partner score</span><b>91.3</b><small>/100 · Grade B</small><em>' + ci("warn") + 'Performance requires watching</em></div>' +
        [["On-time in-full (OTIF)", "850/856/214", "91.5%", "score 96", "Target ≥ 95%", "3.5 pts"], ["Perfect order rate", "850-856-810", "90%", "score 95", "Target ≥ 95%", "5.0 pts"], ["PO acknowledgment rate", "855", "96.5%", "score 98", "Target ≥ 98%", "1.5 pts"]].map(function (k) {
          return '<div class="cx-kc"><header><b>' + k[0] + '</b><code>' + k[1] + '</code></header><strong>' + k[2] + '<small>' + k[3] + '</small></strong><span class="cx-pb"><i style="width:92%"></i><u style="left:96%"></u></span><div class="cx-ft"><span>' + k[4] + '</span><em>' + ci("warn") + '↓ ' + k[5] + '</em></div></div>';
        }).join("") + '</section><h4 class="cx-sh">Performance by category</h4>' +
        CXCAT.map(function (c, ci_) {
          return '<details class="cx-cat"' + (ci_ === 0 ? " open" : "") + '><summary>' + ci("down") + '<b>' + c[0] + '</b><span>' + c[1] + '</span><em class="' + (c[2] < 88 ? "w" : "g") + '">avg score ' + c[2] + '</em></summary>' + c[3].map(function (m) {
            return '<div class="cx-mt"><div><b>' + m[0] + '</b><span><code>' + m[1] + '</code>' + (m[6] ? '<em class="w">' + ci("warn") + 'Off target</em>' : '<em class="g">' + ci("ok") + 'On target</em>') + '</span></div><div class="cx-mb"><span>Target: ' + m[3] + '</span><span>Score: ' + m[4] + '</span><span>Weight: ' + m[5] + '%</span><span class="cx-pb ' + (m[6] ? "w" : "") + '"><i style="width:' + m[4] + '%"></i></span></div><strong class="' + (m[6] ? "w" : "g") + '">' + m[2] + '</strong></div>';
          }).join("") + '</details>';
        }).join("");
    } else {
      h += '<div class="cx-g2">' + cxCard("Where to focus", '<p class="cx-sub">Lowest-scoring KPIs pulling the rating down</p>' + cxBars([["Backorder rate", 57, "", "r"], ["Chargeback and deduction rate", 64, "", "y"], ["Transaction rejection rate", 70, "", "y"], ["PO acknowledgment cycle time", 73, "", "y"], ["Inventory feed timeliness", 81, "", "y"], ["Perfect order rate", 95, "", "g"]], {})) +
        cxCard("Category health", '<p class="cx-sub">Average score by KPI group</p><div class="cx-dw">' + cxDonut(CXCAT.map(function (c, i) { return [c[0], c[2], ["#0066FF", "#001889", "#5B8DEF", "#9DB7F2", "#3F4D62"][i]]; }), 80, "89", "avg score") + '<ul class="cx-lg">' + CXCAT.map(function (c, i) { return '<li><i style="background:' + ["#0066FF", "#001889", "#5B8DEF", "#9DB7F2", "#3F4D62"][i] + '"></i>' + c[0] + '<b>' + c[2] + '</b></li>'; }).join("") + '</ul></div>') + '</div>' +
        '<div class="cx-g2">' + cxCard("Weighted trading partner score trend", cxLine([{ v: [86.2, 87.1, 87.0, 88.4, 89.9, 91.3], area: true }], { w: 600, h: 220, min: 80, max: 100, xl: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Score trend" })) +
        cxCard("Score contribution by KPI", '<p class="cx-sub">Weighted points contributed to the 91.3 overall score</p>' + cxBars([["On-time in-full (OTIF)", 7.7, "", "g"], ["Ship notice timeliness", 5.8, "", "g"], ["Invoice accuracy rate", 5.5, "", "y"], ["ASN accuracy", 4.9, "", "y"], ["Chargeback and deduction rate", 3.2, "", "y"]], { max: 8, fmt: function (v) { return v.toFixed(1); } })) + '</div>';
    }
    return h;
  };
  CXS["im-dash"] = function () {
    return cxHead("Dashboard") + cxCard("Daily digest", '<div class="cx-k5">' + cxKpi("Transaction volume, top 10 partners", "27,022", '<button type="button" class="cx-lk" data-cxgo="im-com">View partner list</button>') + cxKpi("Partners onboarded", "13", '<em class="up">↑ 18% vs last week</em>') +
      cxKpi("Document volume this week", "2,056", '<em class="up">↑ 11% vs last week</em>') + cxKpi("Anomalies detected", "3", '<em class="dn">↑ 2 vs yesterday</em>') + cxKpi("Failed transactions", "121", '<button type="button" class="cx-lk" data-cxgo="pm-find">View findings</button>') + '</div>', "", '<span class="cx-note">Updated for Friday, October 23, 2026 (UTC) ' + ci("spark") + '</span>') +
      '<div class="cx-g21">' + cxCard("Document transaction summary", '<div class="cx-g2 in">' + [["Yesterday", "Thursday, October 22, 2026", "2,056"], ["Last month", "September 1 to 30, 2026", "45,231"]].map(function (p) {
        return '<div><b class="cx-pl">' + p[0] + '</b><small class="cx-pd">' + p[1] + '</small><div class="cx-dw">' + cxDonut([["850", 34, "#0066FF"], ["856", 27, "#001889"], ["810", 25, "#5B8DEF"], ["Other", 14, "#9DB7F2"]], 62, p[2], "Total") + '<ul class="cx-lg"><li><i style="background:#0066FF"></i>850 Purchase order</li><li><i style="background:#001889"></i>856 Ship notice</li><li><i style="background:#5B8DEF"></i>810 Invoice</li><li><i style="background:#9DB7F2"></i>Other documents</li></ul></div></div>';
      }).join("") + '</div>', "", ci("spark", "cx-ai")) +
      cxCard("Trading community statistics", '<ul class="cx-stl">' + [["Total partners", "208"], ["Added this year", "21"], ["Added this month", "3"], ["Added last month", "4"], ["Active partners", "163"]].map(function (r) { return '<li><span>' + r[0] + '</span><b>' + r[1] + '</b>' + ci("chev") + '</li>'; }).join("") + '</ul>') + '</div>' +
      cxCard("Transaction volume", cxLine([{ v: [3820, 3960, 4100, 4120, 4010, 3890, 4240, 4380, 4510, 4460, 4620, 4590], area: true }], { w: 1060, h: 230, min: 3000, max: 5000, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Transaction volume, last 12 months" }), "", cxSeg("rng", ["12M", "3M", "24M"], "12M"));
  };
  CXS["im-tp"] = function () {
    return cxHead("Trading partners") + cxCard("Partner integration analysis", '<div class="cx-k3">' + cxKpi("Total partners", "208", "78% active") + cxKpi("Active partners", "163", "Sent or received in 30 days") + cxKpi("Inactive partners", "45", "No activity in 30 days") + '</div>') +
      cxCard("Trading partner stats", cxLine([{ v: [172, 176, 179, 183, 186, 190, 193, 196, 199, 203, 205, 208] }, { v: [3, 4, 3, 4, 3, 4, 3, 3, 3, 4, 2, 3], c: "b2" }], { w: 1060, h: 230, max: 240, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Partners over 12 months" }) + '<ul class="cx-lg row"><li><i style="background:var(--pa)"></i>Total partners</li><li><i style="background:#001889"></i>Onboarded</li></ul>', "", cxSeg("rng", ["24M", "12M", "6M", "3M", "1M"], "12M"));
  };
  CXS["im-com"] = function () {
    return cxHead("Trading community") + '<div class="cx-k4">' + cxKpi("Total partners", "208") + cxKpi("Added this month", "3") + cxKpi("Added last month", "4") + cxKpi("Added this year", "21") + '</div>' +
      cxCard("Partners", '<table class="cx-tbl"><thead><tr><th>Partner name</th><th>Partner alias</th><th>Status</th><th>BUID</th><th>Onboarding date</th><th>Last activity</th></tr></thead><tbody>' +
        CXP.map(function (p) { return '<tr><td><b>' + p[0] + '</b></td><td><code>' + p[1] + '</code></td><td><span class="cx-st s-' + (p[2] === "Active" ? "resolved" : "known") + '"><i></i>' + p[2] + '</span></td><td>' + p[3] + '</td><td>' + p[4] + '</td><td>' + p[5] + '</td></tr>'; }).join("") + '</tbody></table>', "", '<span class="cx-note">Showing 10 of 208</span>');
  };
  var CXPJ = [["Harbor Grocers orders", "Order volume drop", 5, "Inbound", "Purchase order (850)", "X12", "Harbor Grocers", "f2"], ["Brightway inventory feed", "Feed late", 3, "Outbound", "Inventory advice (846)", "X12", "Brightway Marketplace", "f10"],
    ["Harbor Grocers sales feed", "Feed missing", 1, "Inbound", "Product activity (852)", "X12", "Harbor Grocers", "f7"], ["Northfield Stores invoices", "Within projection", 0, "Outbound", "Invoice (810)", "X12", "Northfield Stores", null],
    ["Westline Home orders", "Within projection", 0, "Inbound", "Purchase order (850)", "X12", "Westline Home", null]];
  CXS["im-proj"] = function () {
    var p = CXPJ[ccPj], act = ccPj === 0 ? [62, 88, 91, 41, null, null, null, null, null, null] : [70, 72, 75, 74, null, null, null, null, null, null], prj = [null, null, null, 112, 108, 104, 98, 96, 94, 95];
    return cxHead("Projections and anomalies") + '<div class="cx-pj"><nav class="cx-pjl"><header><b>Projections</b><span>Anomalies</span></header>' + CXPJ.map(function (x, i) {
      return '<button type="button" data-cxpj="' + i + '" aria-pressed="' + (i === ccPj) + '"><b>' + x[0] + '</b><small>' + x[1] + ' · Executed today, 08:00</small>' + (x[2] ? '<em>' + x[2] + ci("warn") + '</em>' : '') + '</button>';
    }).join("") + '</nav><section class="cx-pjd"><header><h3>' + p[0] + '</h3>' + (p[7] ? '<button type="button" class="cx-btn" data-cxf="' + p[7] + '">Open finding</button>' : '') + '</header>' +
      '<div class="cx-chips">' + [["D", "Direction", p[3]], ["D", "Document type", p[4]], ["S", "Document standard", p[5]], ["T", "Trading partner", p[6]]].map(function (c) { return '<div><i>' + c[0] + '</i><span>' + c[1] + '<b>' + c[2] + '</b></span></div>'; }).join("") + '</div>' +
      '<div class="cx-bar"><span class="cx-lb">Projection for</span>' + cxSeg("pjr", ["7d", "30d"], "7d") + '</div>' +
      cxLine([{ v: act, c: "act" }, { v: prj, c: "prj" }], { w: 840, h: 210, max: 140, xl: ["Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29"], now: 3, band: prj.map(function (v) { return v == null ? null : [v - 16, v + 16]; }), label: "Projection and actual" }) +
      '<ul class="cx-lg row"><li><i class="bd"></i>Projected range</li><li><i style="background:#5B8DEF"></i>Projection</li><li><i style="background:#E8590C"></i>Actual</li></ul><h4 class="cx-sh">Heat map: hourly activity projection</h4>' + cxHeat() + '</section></div>';
  };
  CXS["im-map"] = function () {
    return cxHead("Document mapping") + cxCard("Business documents", '<table class="cx-tbl"><thead><tr><th>Business document</th><th>EDI documents</th><th>ERP document</th><th>Processes</th></tr></thead><tbody>' +
      [["Purchase order", "850, 860", "Sales order", "Order to cash, Drop ship, 3PL"], ["Order acknowledgment", "855, 865", "Order confirmation", "Order to cash"], ["Ship notice", "856", "Outbound delivery", "Order to cash, Receive, match and pay"], ["Invoice", "810", "Billing document", "Order to cash"],
        ["Remittance", "820", "Incoming payment", "Order to cash, Deductions"], ["Debit memo", "812", "Dispute case", "Deductions"], ["Inventory advice", "846", "Stock report", "Drop ship, VMI"], ["Product activity", "852", "Sales report", "VMI, Sales reporting"]].map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td><td><code>' + r[1] + '</code></td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join("") + '</tbody></table>');
  };
  CXS["im-cfg"] = function () {
    return cxHead("System configuration") + cxCard("Trading partner settings", '<p class="cx-sub">Days without activity before a trading partner is marked inactive.</p><label class="cx-fl">Threshold (days)<input type="number" value="30" min="1"></label><button type="button" class="cx-btn p">Save</button>');
  };
  CXS["pm-dash"] = function () {
    var op = cxOpen(), hi = op.filter(function (f) { return f.sev === "c"; }).length, val = op.reduce(function (a, f) { return a + f.val; }, 0);
    return cxHead("Dashboard") + cxCard("Key metrics", '<div class="cx-k5">' + cxKpi("Active rules", "14", "Across 5 agents") + cxKpi("Open findings", op.length, hi + " high severity") + cxKpi("Value at risk", "$" + Math.round(val / 1000) + "K", "Across open findings") +
      cxKpi("Total inspections", "159,920", "Documents checked") + '<div class="cx-kpi"><span>Avg conformance and deviation</span><b>95.8%<small class="r">4.2%</small></b><span class="cx-pb"><i style="width:95.8%"></i></span></div></div>', "", '<span class="cx-note">Last 30 days</span>') +
      '<div class="cx-g2">' + cxCard("My actions", '<p class="cx-sub">' + op.length + ' items need attention</p><ul class="cx-acts">' + op.slice(0, 4).map(function (f) {
        return '<li><header><button type="button" class="cx-lk b" data-cxf="' + f.id + '">' + cxe(f.ot) + '</button>' + cxSevChip(f.sev) + '</header><p><code>' + f.id.toUpperCase() + '</code> Rule: ' + cxe(CXRULE[f.id]) + '</p><p><b>' + cxe(f.partner) + '</b> | ' + cxe(cxAgentName(f)) + '<span>' + cxAt(f) + '</span></p></li>';
      }).join("") + '</ul>', "", '<button type="button" class="cx-lk" data-cxgo="pm-act">View all</button>') +
      cxCard("Process health", '<p class="cx-sub">Open findings by retail business process</p><ul class="cx-ph2">' + CCSTG.map(function (g) {
        return '<li><b>' + g[0] + '</b>' + g[1].map(function (i) { var n = op.filter(function (f) { return f.p === i; }), sev = n.some(function (f) { return f.sev === "c"; }) ? "c" : n.length ? "w" : "ok";
          return '<button type="button" class="cx-pc ' + sev + '" data-cxproc="' + i + '"><i></i>' + cxe(GENOME.retail.short[i]) + (n.length ? '<em>' + n.length + '</em>' : '') + '</button>'; }).join("") + '</li>';
      }).join("") + '</ul>', "", '<button type="button" class="cx-lk" data-cxgo="pm-proc">View processes</button>') + '</div>' +
      cxCard("Findings by agent", cxBars(CXA.map(function (a) { return [a.n + " · " + a.r, a.f.filter(function (id) { return !ccDone[id]; }).length + [12, 5, 3, 4, 6][CXA.indexOf(a)], "", "b"]; }), { max: 20 }), "", '<span class="cx-note">Last 30 days</span>');
  };
  CXS["pm-proc"] = function () {
    var op = cxOpen();
    return cxHead("Business processes", '<span class="cx-new">New</span>') + '<p class="cx-lead">Each retail business process with its steps, the agents watching it and the findings open against it.</p>' +
      cxCard("", '<table class="cx-tbl cx-pt"><thead><tr><th>Process</th><th>Steps</th><th>Key measure</th><th>Agents</th><th>Open findings</th><th>Value at risk</th><th>Health</th></tr></thead><tbody>' + CCSTG.map(function (g) {
        return '<tr class="gh"><td colspan="7">' + g[0] + '</td></tr>' + g[1].map(function (i) {
          var P = PROCESSES.retail[i], n = op.filter(function (f) { return f.p === i; }), sev = n.some(function (f) { return f.sev === "c"; }) ? "c" : n.length ? "w" : "ok", ag = {}, v = n.reduce(function (a, f) { return a + f.val; }, 0);
          CCF.filter(function (f) { return f.p === i; }).forEach(function (f) { ag[CXAF[f.id].n] = 1; });
          var steps = P.steps.map(function (s, k) { var fs = n.filter(function (f) { return f.st === k; }); return '<i class="' + (fs.some(function (f) { return f.sev === "c"; }) ? "c" : fs.length ? "w" : "ok") + '" title="' + cxe(s[0]) + '"></i>'; }).join("");
          return '<tr><td><button type="button" class="cx-lk b" data-cxproc="' + i + '">' + cxe(P.n) + '</button></td><td><span class="cx-steps">' + steps + '</span></td><td>' + cxe(P.measures[CCM[i][0]]) + ' <b>' + CCM[i][1] + '</b></td><td>' + (Object.keys(ag).join(", ") || "Lex, Nora") + '</td><td>' + (n.length || "None") + '</td><td>' + (v ? "$" + v.toLocaleString("en-US") : "None") + '</td><td><span class="cx-hl ' + sev + '"><i></i>' + { c: "Critical", w: "Warning", ok: "Healthy" }[sev] + '</span></td></tr>';
        }).join("");
      }).join("") + '</tbody></table>');
  };
  CXS["pm-find"] = function () {
    var all = CCF.filter(function (f) { return ccFAgent === "all" || CXAF[f.id].id === ccFAgent; }), op = all.filter(function (f) { return !ccDone[f.id]; }), nw = op.filter(function (f) { return CXST[f.id] === "New"; }).length;
    return cxHead("Findings", '<label class="cx-sel">' + '<select data-cxag>' + '<option value="all">All agents</option>' + CXA.map(function (a) { return '<option value="' + a.id + '"' + (ccFAgent === a.id ? " selected" : "") + '>' + a.n + " · " + a.r + '</option>'; }).join("") + '</select></label>') +
      '<div class="cx-g12">' + cxCard("Total findings", '<div class="cx-dw">' + cxGauge([["New", nw, "#E8590C"], ["Ack", op.length - nw, "#F4B740"], ["Closed", all.length - op.length, "#0066FF"]]) +
        '<ul class="cx-lg"><li><i style="background:#E8590C"></i>New<b>' + nw + '</b></li><li><i style="background:#F4B740"></i>Acknowledged<b>' + (op.length - nw) + '</b></li><li><i style="background:#0066FF"></i>Closed<b>' + (all.length - op.length) + '</b></li></ul></div>') +
      cxCard("", '<p class="cx-ka">' + ci("spark") + 'Key analysis</p><span class="cx-tag">' + ci("warn") + 'Order to cash</span><h4 class="cx-kt">Four of eleven findings sit in Order to cash, two of them critical</h4><p class="cx-sub">Harbor Grocers orders stopped at 05:52 after a certificate rotation, and Northfield Stores shipments have no ship notices. Both block revenue this morning. Approve the two critical actions first, then work the acknowledgment backlog for Westline Home before the 12:00 cutoff.</p>') + '</div>' +
      cxCard("List of findings", cxFindRows(all), "", '<span class="cx-note">Grouped by agent</span>');
  };
  CXS["pm-act"] = function () {
    var op = cxOpen();
    return cxHead("My actions") + '<p class="cx-lead">Agent recommendations waiting for a decision. Actions run after approval.</p>' + '<ul class="cx-acl">' + op.map(function (f) {
      return '<li class="' + f.sev + '"><div><header>' + cxSevChip(f.sev) + '<span>' + cxe(cxAgentName(f)) + ' · ' + cxAt(f) + '</span></header><button type="button" class="cx-lk b" data-cxf="' + f.id + '">' + cxe(f.ot) + '</button><p>' + cxe(f.act) + '</p><small>' + cxe(f.partner) + ' · ' + cxe(cxProcName(f.p)) + ' · Approver: ' + cxe(f.appr) + '</small></div>' +
        '<div class="cx-acb"><button type="button" class="cx-btn p" data-cxapp="' + f.id + '">Approve action</button><button type="button" class="cx-btn" data-cxf="' + f.id + '">Review</button></div></li>';
    }).join("") + (op.length ? "" : '<li class="cx-empty">No actions waiting.</li>') + '</ul>';
  };
  CXS["pm-agents"] = function () {
    return cxHead("Agents", '<span class="cx-new">New</span>') + '<p class="cx-lead">Agents inspect documents and processes, raise findings and recommend actions. A person approves each action before it runs.</p><div class="cx-ag">' + CXA.map(function (a) {
      var rs = CXR.filter(function (r) { return r[0] === a.id; }), op = a.f.filter(function (id) { return !ccDone[id]; });
      return '<section class="cx-card"><header class="cx-agh"><span class="cx-agi">' + a.n[0] + '</span><div><h3>' + a.n + '</h3><span>' + a.r + (a.nw ? ' <em class="cx-new">New</em>' : '') + '</span></div></header><p class="cx-sub">' + a.d + '</p>' +
        '<dl class="cx-dl"><div><dt>Rules</dt><dd>' + rs.length + '</dd></div><div><dt>Open findings</dt><dd>' + op.length + '</dd></div><div><dt>Approval</dt><dd>Required</dd></div></dl><ul class="cx-agr">' + rs.map(function (r) { return '<li>' + ci("check") + cxe(r[1]) + '</li>'; }).join("") + '</ul></section>';
    }).join("") + '</div>';
  };
  CXS["pm-rules"] = function () {
    return cxHead("Rules", '<button type="button" class="cx-btn">' + ci("plus") + 'Create new rule</button>') + '<section class="cx-card cx-rh"><div><span>Total rules</span><b>' + CXR.length + '</b><small><i class="g"></i>' + CXR.filter(function (r) { return r[7] === "Active"; }).length + ' active <i class="r"></i>1 over budget <i class="y"></i>1 paused</small></div>' +
      cxKpi("Total findings", "238") + cxKpi("Total inspections", "159.9K") + cxKpi("Average conformance", "95.8%") + cxKpi("Total deviation", "6,653") + '</section>' +
      cxCard("List of rules", '<table class="cx-tbl"><thead><tr><th>Rule</th><th>Transaction</th><th>Process</th><th class="n">Conformance</th><th class="n">Findings (30d)</th><th>Last executed</th><th>Status</th></tr></thead><tbody>' + CXA.map(function (a) {
        return '<tr class="gh"><td colspan="7">' + a.n + ' · ' + a.r + '</td></tr>' + CXR.filter(function (r) { return r[0] === a.id; }).map(function (r) {
          return '<tr><td><b class="cx-lkt">' + cxe(r[1]) + '</b></td><td>' + cxe(r[2]) + '</td><td>' + cxe(r[3]) + '</td><td class="n">' + r[4].toFixed(1) + '%</td><td class="n">' + r[5] + '</td><td>' + r[6] + '</td><td><span class="cx-st s-' + (r[7] === "Active" ? "resolved" : r[7] === "Paused" ? "acknowledged" : "new") + '"><i></i>' + r[7] + '</span></td></tr>';
        }).join("");
      }).join("") + '</tbody></table>', "", '<span class="cx-note">Grouped by agent</span>');
  };

  /* Drawers: a finding, or a business process */
  function cxDrawer() {
    if (!ccDr) return "";
    var h;
    if (ccDr[0] === "f") {
      var f = CCF.filter(function (x) { return x.id === ccDr[1]; })[0], P = PROCESSES.retail[f.p], done = ccDone[f.id];
      h = '<header><span><p>Finding · ' + cxe(cxAgentName(f)) + '</p><h3>' + cxe(f.ot) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
        '<p class="cx-chipsr">' + cxSevChip(f.sev) + cxStChip(f) + '<span class="cx-tg">' + cxe(f.mod) + ' · ' + cxe(f.how) + '</span></p><p>' + cxe(f.os) + '</p>' +
        '<div class="cx-imp"><b>' + cxe(f.bt) + '</b><span>' + cxe(f.bs) + '</span></div>' +
        '<dl class="cx-dl"><div><dt>Trading partner</dt><dd>' + cxe(f.partner) + '</dd></div><div><dt>Process</dt><dd><button type="button" class="cx-lk" data-cxproc="' + f.p + '">' + cxe(P.n) + '</button>, step ' + (f.st + 1) + ': ' + cxe(P.steps[f.st][0]) + '</dd></div><div><dt>Rule</dt><dd>' + cxe(CXRULE[f.id]) + '</dd></div><div><dt>Transactions</dt><dd>' + cxe(CXDOC[f.id]) + '</dd></div></dl>' +
        '<h4>Timeline</h4><ol class="cx-tl">' + f.ev.map(function (e) { return '<li><b>' + cxe(e[0]) + '</b><span>' + cxe(e[1]) + '</span></li>'; }).join("") + '</ol>' +
        '<h4>Root cause</h4><p>' + cxe(f.cause) + '</p><h4>Recommended action</h4><div class="cx-rec">' + ci("bot") + '<span>' + cxe(f.act) + '<small>Approver: ' + cxe(f.appr) + '</small></span></div>' +
        '<h4>Teams involved</h4><p>' + f.who.map(cxe).join(", ") + '</p></div><div class="cx-ft">' + (done ? '<span class="cx-done">' + ci("ok") + (done === 2 ? "Marked as known issue" : "Action approved. The finding is closed.") + '</span>' :
          '<button type="button" class="cx-btn p" data-cxapp="' + f.id + '">Approve action</button><button type="button" class="cx-btn" data-cxknown="' + f.id + '">Mark as known issue</button>') + '</div>';
    } else {
      var i = ccDr[1], Q = PROCESSES.retail[i], op = cxOpen().filter(function (x) { return x.p === i; });
      h = '<header><span><p>Business process · Retail and CPG</p><h3>' + cxe(Q.n) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db"><p>' + cxe(Q.outcome) + '</p>' +
        '<dl class="cx-dl"><div><dt>Owner</dt><dd>' + cxe(Q.owner || "") + '</dd></div><div><dt>' + cxe(Q.measures[CCM[i][0]]) + '</dt><dd>' + CCM[i][1] + '</dd></div><div><dt>Open findings</dt><dd>' + op.length + '</dd></div></dl><h4>Steps</h4><ol class="cx-sp">' +
        Q.steps.map(function (s, k) { var fs = op.filter(function (x) { return x.st === k; }), sev = fs.some(function (x) { return x.sev === "c"; }) ? "c" : fs.length ? "w" : "ok";
          return '<li class="' + sev + '"><i>' + (k + 1) + '</i><div><b>' + cxe(s[0]) + '</b><code>' + cxe(s[1]) + '</code>' + fs.map(function (x) { return '<button type="button" class="cx-lk" data-cxf="' + x.id + '">' + cxe(x.ot) + '</button>'; }).join("") + '</div></li>'; }).join("") +
        '</ol></div><div class="cx-ft"><button type="button" class="cx-btn" data-gv="map" data-gk="retail">Open in Process Genome</button></div>';
    }
    return '<div class="cx-scrim" data-cxclose></div><aside class="cx-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  }

  /* Aviator */
  var CXQ = [["Which processes are at risk this morning?", "Order to cash is critical: Harbor Grocers orders stopped at 05:52 (f2) and 14 Northfield Stores shipments have no ship notice (f1). Item and price synchronization, Deductions and Routing and delivery each have one warning.", ["f2", "f1"]],
    ["Why are Harbor Grocers orders down?", "Ivy found order volume 64% below projection since 05:52. AS2 receipts from Harbor Grocers fail signature checks because the partner rotated its signing certificate. The weekly sales feed is missing for the same reason.", ["f2", "f7"]],
    ["What needs my approval?", null, null]];
  function cxAviator() {
    if (!ccAv) return "";
    var log = ccAvLog.map(function (m) { return '<li class="' + m[0] + '">' + m[1] + '</li>'; }).join("");
    return '<aside class="cx-av"><header>' + ci("spark") + '<b>Aviator</b><button type="button" class="cx-ic" data-cxav aria-label="Close Aviator">' + ci("x") + '</button></header><div class="cx-avb"><p class="cx-hi">Hi. Ask about processes, partners, findings or agents.</p><ul class="cx-avl">' + log + '</ul>' +
      '<ul class="cx-avq">' + CXQ.map(function (q, i) { return '<li><button type="button" data-cxq="' + i + '">' + q[0] + '</button></li>'; }).join("") + '</ul></div><div class="cx-ft"><span>Ask Aviator. Use @ to add agents.</span><button type="button" class="cx-ic" aria-label="Send" disabled>' + ci("send") + '</button><small>AI can make mistakes. Check important information.</small></div></aside>';
  }
  function cxAsk(i) {
    var q = CXQ[i], a;
    if (q[1]) a = cxe(q[1]) + '<span class="cx-avr">' + q[2].map(function (id) { var f = CCF.filter(function (x) { return x.id === id; })[0]; return '<button type="button" class="cx-lk" data-cxf="' + id + '">' + cxe(f.ot) + '</button>'; }).join("") + '</span>';
    else { var op = cxOpen(); a = op.length + ' actions wait for approval. The two most urgent:' + '<span class="cx-avr">' + op.filter(function (f) { return f.sev === "c"; }).slice(0, 2).map(function (f) { return '<button type="button" class="cx-lk" data-cxf="' + f.id + '">' + cxe(f.act) + '</button>'; }).join("") + '</span>'; }
    ccAvLog.push(["q", cxe(q[0])], ["a", a]);
  }

  /* Shell */
  var CXNAV = [["an", "Analytics", "chart"], ["im", "Integration monitor", "im", [["im-dash", "Dashboard", "dash"], ["im-tp", "Trading partners", "users"], ["im-com", "TP community", "net"], ["im-proj", "Projection and anomalies", "trend"], ["im-map", "Document mapping", "map"], ["im-cfg", "System configuration", "cog"]]],
    ["pm", "Performance monitor", "pm", [["pm-dash", "Dashboard", "dash"], ["pm-proc", "Business processes", "flow", 1], ["pm-find", "Findings", "search"], ["pm-act", "My actions", "check"], ["pm-agents", "Agents", "bot", 1], ["pm-rules", "Rules", "rules"]]]];
  function cxMod() { return ccScr === "an" ? "" : ccScr.indexOf("im-") === 0 ? "Integration Monitor" : "Performance Monitor"; }
  function cxRender() {
    var nav = CXNAV.map(function (g) {
      if (!g[3]) return '<li><button type="button" class="cx-n1' + (ccScr === g[0] ? " on" : "") + '" data-cxgo="' + g[0] + '" title="' + g[1] + '">' + ci(g[2]) + '<span>' + g[1] + '</span></button></li>';
      return '<li><button type="button" class="cx-n1 cx-grp" data-cxgrp="' + g[0] + '" aria-expanded="' + !!ccGrp[g[0]] + '" title="' + g[1] + '">' + ci("chev", "cv") + ci(g[2]) + '<span>' + g[1] + '</span></button>' + (ccGrp[g[0]] ? '<ul>' + g[3].map(function (s) {
        return '<li><button type="button" class="cx-n2' + (ccScr === s[0] ? " on" : "") + '" data-cxgo="' + s[0] + '" title="' + s[1] + '">' + ci(s[2]) + '<span>' + s[1] + (s[3] ? ' <em class="cx-new">New</em>' : '') + '</span></button></li>'; }).join("") + '</ul>' : '') + '</li>';
    }).join("");
    cx.innerHTML = '<header class="cx-top"><span class="cx-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#0066FF"/><path d="M22.5 13.6h1.8l1.3-2.1h-3.1V8.1h-3.9v5.9a6.8 6.8 0 1 0 0 6.3c0 1 .1 1.7.6 2.4.8 1.2 2.3 1.3 3.6 1.3.7 0 1.1-.1 1.8-.2v-2.8l-1 .1c-1 0-1-.7-1-1.5zM12.6 20.2a3.1 3.1 0 1 1 0-6.1 3.1 3.1 0 0 1 0 6.1z" fill="#fff"/></svg>Command Center<em>' + cxMod() + '</em></span>' +
      '<span class="cx-cust">Nuvori Beauty · Retail and CPG</span><span class="cx-tb"><button type="button" class="cx-avt" data-cxav aria-pressed="' + ccAv + '">' + ci("spark") + 'Aviator</button><button type="button" class="cx-ic" aria-label="Notifications">' + ci("bell") + '</button><button type="button" class="cx-ic" aria-label="Help">' + ci("help") + '</button>' +
      '<button type="button" class="cx-ic" data-cxfs aria-label="Full screen">' + ci("full") + '</button><span class="cx-me">KM</span></span></header>' +
      '<div class="cx-body' + (ccNavMin ? " min" : "") + (ccAv ? " av" : "") + '"><nav class="cx-nav" aria-label="Command Center"><ul>' + nav + '</ul><button type="button" class="cx-n1 cx-col" data-cxmin title="' + (ccNavMin ? "Expand panel" : "Collapse panel") + '">' + ci("side") + '<span>Collapse panel</span></button></nav>' +
      '<main class="cx-main" id="cx-main">' + CXS[ccScr]() + '</main>' + cxAviator() + '</div>' + cxDrawer();
  }
  function cxGo(s) { ccScr = s; ccDr = null; if (s.indexOf("im-") === 0) ccGrp.im = true; if (s.indexOf("pm-") === 0) ccGrp.pm = true; cxRender(); var m = document.getElementById("cx-main"); if (m) m.scrollTop = 0; }
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cxgo],[data-cxgrp],[data-cxmin],[data-cxav],[data-cxf],[data-cxproc],[data-cxclose],[data-cxapp],[data-cxknown],[data-cxtab],[data-cxseg],[data-cxpj],[data-cxq],[data-cxfs]"); if (!b) return;
    if (b.hasAttribute("data-cxgo")) cxGo(b.getAttribute("data-cxgo"));
    else if (b.hasAttribute("data-cxgrp")) { var g = b.getAttribute("data-cxgrp"); ccGrp[g] = !ccGrp[g]; if (ccNavMin) { ccNavMin = false; ccGrp[g] = true; } cxRender(); }
    else if (b.hasAttribute("data-cxmin")) { ccNavMin = !ccNavMin; cxRender(); }
    else if (b.hasAttribute("data-cxav")) { ccAv = !ccAv; cxRender(); }
    else if (b.hasAttribute("data-cxf")) { ccDr = ["f", b.getAttribute("data-cxf")]; cxRender(); }
    else if (b.hasAttribute("data-cxproc")) { ccDr = ["p", +b.getAttribute("data-cxproc")]; cxRender(); }
    else if (b.hasAttribute("data-cxclose")) { ccDr = null; cxRender(); }
    else if (b.hasAttribute("data-cxapp")) { ccDone[b.getAttribute("data-cxapp")] = 1; cxRender(); }
    else if (b.hasAttribute("data-cxknown")) { ccDone[b.getAttribute("data-cxknown")] = 2; cxRender(); }
    else if (b.hasAttribute("data-cxtab")) { ccTab = b.getAttribute("data-cxtab"); cxRender(); }
    else if (b.hasAttribute("data-cxseg")) { if (b.getAttribute("data-cxseg") === "tpt") { ccTpt = b.getAttribute("data-v"); cxRender(); } else { b.parentNode.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); } }
    else if (b.hasAttribute("data-cxpj")) { ccPj = +b.getAttribute("data-cxpj"); cxRender(); }
    else if (b.hasAttribute("data-cxq")) { cxAsk(+b.getAttribute("data-cxq")); cxRender(); var l = cx.querySelector(".cx-avb"); if (l) l.scrollTop = l.scrollHeight; }
    else if (b.hasAttribute("data-cxfs")) { if (document.fullscreenElement) document.exitFullscreen(); else if (ccEl.requestFullscreen) ccEl.requestFullscreen().catch(function () {}); }
  });
  cx.addEventListener("change", function (e) { if (e.target.matches("[data-cxag]")) { ccFAgent = e.target.value; cxRender(); } });
  document.addEventListener("keydown", function (e) { if (ccEl.hidden || e.key !== "Escape" || !ccDr) return; e.preventDefault(); ccDr = null; cxRender(); });
  function ccFit() {
    var fs = document.fullscreenElement === ccEl;
    ccEl.classList.toggle("small", !fs && (window.innerWidth < 1024 || window.innerHeight < 560));
    var w = fs ? window.innerWidth : ccFrame.clientWidth, hh = fs ? window.innerHeight : window.innerHeight - 81;
    if (w) ccEl.style.setProperty("--s", Math.min(w / 1440, hh / 810));
  }
  function ccOpen() { ccEl.hidden = false; ccFit(); cxRender(); }
  function ccClose() { if (ccEl.hidden) return; if (document.fullscreenElement === ccEl) { try { document.exitFullscreen(); } catch (err) {} } ccEl.hidden = true; }
  document.getElementById("cc-back").addEventListener("click", function () { curV = "ops"; render("all"); window.scrollTo({ top: 0 }); });
  document.addEventListener("fullscreenchange", function () { if (!ccEl.hidden) setTimeout(ccFit, 50); });
  window.addEventListener("resize", function () { if (!ccEl.hidden) ccFit(); });
