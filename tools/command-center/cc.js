  /* Command Center for Retail and CPG (owner, Oct 24): one dashboard, one findings list and one action queue across
     Integration Monitor, Performance Monitor and the Retail add-on. Recreated from the Command Center prototypes and
     extended with business process monitoring and AI agents. Illustrative values for the concept preview.
     Two perspectives of the same network: a retailer (Northfield Stores) and a CPG supplier (Nuvori Beauty). */
  var ccEl = document.getElementById("cc"), cx = document.getElementById("cx");
  var ccScr = "dash", ccGrp = { ws: true, im: true, pm: true, rt: true }, ccNavMin = false, ccAv = false, ccDr = null, ccTab = "sc", ccTpt = "Customer", ccPj = 0, ccAvLog = [];
  var ccCfgTab = "rp", ccModF = "all", ccSevF = "all", ccStF = "open", ccActTab = "open";
  var CC_GENOME = "../#retail/map";
  function ccRole() { return typeof rtRole === "string" ? rtRole : "supplier"; }
  function ccCompany() { return ccRole() === "retailer" ? "Northfield Stores" : "Nuvori Beauty"; }

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
  CXI.moon = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>'; CXI.sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  CXI.gen = '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7M8 8l8 8"/>';
  CXI.ext = '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>';
  function ci(n, c) { return '<svg class="ci' + (c ? " " + c : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + CXI[n] + '</svg>'; }
  function cxe(s) { return esc(s); }

  /* Agents: four from the prototype, plus a volume agent that turns Integration Monitor anomalies into findings */
  var CXA = [
    { id: "lex", n: "Lex", r: "Timing and SLA agent", d: "Watches every document clock: acknowledgment windows and ship notice timing.", f: ["f1", "f3"] },
    { id: "nora", n: "Nora", r: "Conformance agent", d: "Checks documents against partner rules before and after they are sent: price, quantity, labels and required fields.", f: ["f4", "f11"] },
    { id: "liz", n: "Liz", r: "Process agent", d: "Follows each business process across documents and systems, and flags steps that will fail later in the process.", f: ["f9"] },
    { id: "reese", n: "Reese", r: "Reconciliation agent", d: "Matches deductions, credits and remittances to orders, shipments and invoices, and builds dispute backup.", f: ["f5"] },
    { id: "ivy", n: "Ivy", r: "Volume agent", d: "Compares document volume with its projection by partner and hour, and raises missing documents and volume drops as findings.", f: ["f2", "f7", "f10"], nw: true }
  ];
  var CXAF = {}; CXA.forEach(function (a) { a.f.forEach(function (id) { CXAF[id] = a; }); });
  var CXST = { f1: "New", f2: "New", f3: "Acknowledged", f4: "New", f5: "Acknowledged", f7: "New", f9: "New", f10: "New", f11: "Acknowledged" };
  var CXAS = { f3: "Dana Ortiz", f5: "Priya Nair", f4: "Dana Ortiz" };
  var CXDOC = { f1: "Ship notice (856)", f2: "Purchase order (850)", f3: "Order acknowledgment (855)", f4: "Invoice (810)", f5: "Debit memo (812)", f7: "Remittance advice (820)", f9: "Price catalog (832)", f10: "Functional acknowledgment (997)", f11: "Ship notice (856)" };
  var CXRULE = { f1: "Ship notice within 1 hour of pickup", f2: "Order volume against projection", f3: "Acknowledgment within 24 hours", f4: "Invoice matches order price", f5: "Deduction backup inside the dispute window",
    f7: "Remittance advice on schedule", f9: "Cost change applied to open orders", f10: "Functional acknowledgments on time", f11: "Carton labels carry serial codes" };
  /* Demo client solution: Order to cash, Receive, match and pay, and Deductions */
  var CXR = [
    ["lex", "Ship notice within 1 hour of pickup", "Ship notice (856)", "Order to cash", 97.1, 31, "1 minute ago", "Active"],
    ["lex", "Acknowledgment within 24 hours", "Order acknowledgment (855)", "Order to cash", 95.8, 44, "3 minutes ago", "Active"],
    ["nora", "Invoice matches order price", "Invoice (810)", "Order to cash", 96.6, 38, "2 minutes ago", "Active"],
    ["nora", "Carton labels carry serial codes", "Ship notice (856)", "Receive, match and pay", 99.0, 9, "4 minutes ago", "Active"],
    ["nora", "Required fields by partner guide", "All outbound documents", "All three processes", 99.4, 6, "5 minutes ago", "Over budget"],
    ["liz", "Cost change applied to open orders", "Price catalog (832)", "Order to cash", 94.1, 17, "8 minutes ago", "Active"],
    ["liz", "Ship notice before invoice", "Ship notice (856), Invoice (810)", "Order to cash", 99.3, 4, "7 minutes ago", "Active"],
    ["reese", "Deduction backup inside the dispute window", "Debit memo (812)", "Deductions", 88.5, 23, "14 minutes ago", "Active"],
    ["reese", "Remittance matches open invoices", "Remittance advice (820)", "Deductions", 97.9, 5, "19 minutes ago", "Paused"],
    ["ivy", "Order volume against projection", "Purchase order (850)", "Order to cash", 93.2, 11, "1 minute ago", "Active"],
    ["ivy", "Remittance advice on schedule", "Remittance advice (820)", "Order to cash", 98.7, 3, "11 minutes ago", "Active"],
    ["ivy", "Functional acknowledgments on time", "Functional acknowledgment (997)", "Receive, match and pay", 96.0, 8, "2 minutes ago", "Active"]
  ];
  var CXP = [["Northfield Stores", "NFS-RT-0112", "Active", "BU-0451", "Mar 4, 2021", "Today, 08:42"], ["Harbor Grocers", "HBG-RT-0207", "Active", "BU-0367", "Jun 18, 2020", "Today, 05:52"],
    ["Westline Home", "WLH-RT-0331", "Active", "BU-0442", "Jan 9, 2022", "Today, 08:31"], ["Brightway Marketplace", "BWM-MP-0415", "Active", "BU-0249", "Sep 27, 2023", "Today, 05:00"],
    ["Lakeshore Market", "LSM-RT-0520", "Active", "BU-0425", "Feb 2, 2024", "Today, 08:12"], ["Pinecrest Department Stores", "PDS-RT-0618", "Active", "BU-0019", "Nov 15, 2019", "Today, 07:58"],
    ["Coastal Drug", "CDR-RT-0702", "Active", "BU-0480", "Apr 30, 2023", "Today, 08:05"], ["Summit Beauty Supply", "SBS-DS-0811", "Inactive", "BU-0082", "Jul 21, 2022", "Aug 3, 2026"],
    ["Ridgeway Freight", "RDF-CA-0905", "Active", "BU-0395", "May 6, 2021", "Today, 08:40"], ["Crestline Logistics", "CRL-3P-1010", "Active", "BU-0132", "Oct 11, 2020", "Today, 07:20"]];
  var CXPR = [["Nuvori Beauty", "NUV-SP-0112", "Active", "BU-0451", "Mar 4, 2021", "Today, 09:12"], ["Meadowline Care", "MDC-SP-0207", "Active", "BU-0367", "Jun 18, 2020", "Today, 05:52"],
    ["Copperleaf Living", "CPL-SP-0331", "Active", "BU-0442", "Jan 9, 2022", "Today, 09:22"], ["Tidewell Home", "TDH-DS-0415", "Active", "BU-0249", "Sep 27, 2023", "Today, 09:24"],
    ["Solara Personal Care", "SPC-SP-0520", "Active", "BU-0425", "Feb 2, 2024", "Today, 09:15"], ["Fieldstone Essentials", "FSE-SP-0618", "Active", "BU-0019", "Nov 15, 2019", "Today, 09:10"],
    ["Liora Wellness", "LRW-SP-0702", "Active", "BU-0480", "Oct 20, 2026", "Yesterday, 16:20"], ["Brookfield Pet Supply", "BPS-SP-0811", "Inactive", "BU-0082", "Jul 21, 2022", "Aug 3, 2026"],
    ["Ridgeway Freight", "RDF-CA-0905", "Active", "BU-0395", "May 6, 2021", "Today, 08:40"], ["Crestline Logistics", "CRL-3P-1010", "Active", "BU-0132", "Oct 11, 2020", "Today, 09:26"]];
  function cxPartners() { return ccRole() === "retailer" ? CXPR : CXP; }

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

  /* Modules and shared records. Each finding and dashboard component carries the module that produces it. */
  var CCMOD = { IM: ["Integration Monitor", "im"], PM: ["Performance Monitor", "pm"], RT: ["Retail add-on", "rt"] };
  function cxTag(m) { return m && CCMOD[m] ? '<span class="cx-mod ' + CCMOD[m][1] + '"><i></i>' + CCMOD[m][0] + '</span>' : '<span class="cx-mod all"><i></i>All modules</span>'; }
  function cxModKey(scr) { scr = scr || ccScr; return scr.indexOf("im-") === 0 ? "IM" : scr.indexOf("pm-") === 0 || scr === "an" ? "PM" : scr.indexOf("rt-") === 0 ? "RT" : ""; }
  function cxF(f) { var o = ccRole() === "retailer" && CCFR[f.id], r = {}, k; if (!o) return f; for (k in f) r[k] = f[k]; for (k in o) r[k] = o[k]; return r; }
  function cxAll() { return CCF.map(cxF); }
  function cxById(id) { return cxF(CCF.filter(function (x) { return x.id === id; })[0]); }
  function cxOpen() { return cxAll().filter(function (f) { return !ccDone[f.id]; }); }
  function cxSevChip(s) { return s === "c" || s === "h" ? '<span class="cx-sev h">' + ci("warn") + 'High</span>' : '<span class="cx-sev m">' + ci("warn") + 'Medium</span>'; }
  function cxStPill(st) { return '<span class="cx-st s-' + st.replace(/ /g, "").toLowerCase() + '"><i></i>' + st + '</span>'; }
  function cxStChip(f) { return cxStPill(ccDone[f.id] ? (ccDone[f.id] === 2 ? "Known issue" : "Resolved") : CXST[f.id]); }
  function cxAt(f) { return /^\d/.test(f.at) ? "Today, " + f.at : f.at; }
  function cxAgentName(f) { var a = CXAF[f.id]; return a.n + " · " + a.r; }
  function cxOrd(t) { var m = /^(\d\d):(\d\d)/.exec(String(t)); return m ? +m[1] * 60 + +m[2] : -1; }
  function cxProcName(i) { return PROCESSES.retail[i].n; }

  /* Item providers: the core monitors register here, and industry add-ons append their own. One record shape for findings and actions. */
  var CXITEMS = [function () {
    return cxAll().map(function (f) {
      var d = ccDone[f.id], a = CXAF[f.id];
      return { key: "f:" + f.id, mod: f.mod === "Integration Monitor" ? "IM" : "PM", title: f.ot, partner: f.partner, check: CXRULE[f.id], proc: f.p, sev: f.sev === "c" ? "h" : "m",
        agent: a.n + " · " + a.r, owner: CXAS[f.id] || "Unassigned", status: d ? (d === 2 ? "Known issue" : "Resolved") : CXST[f.id], done: !!d, at: cxAt(f), ord: cxOrd(f.at), val: f.val,
        open: 'data-cxf="' + f.id + '"', act: f.act, appr: f.appr, actDone: !!d, actState: d === 2 ? "Marked as known issue" : "Action approved. The finding is closed.",
        actBtn: '<button type="button" class="cx-btn p" data-cxapp="' + f.id + '">Approve action</button>' };
    });
  }];
  function ccItems() { return [].concat.apply([], CXITEMS.map(function (p) { return p(); })); }
  function cxSort(list) { return list.slice().sort(function (a, b) { return (a.sev === "h" ? 0 : 1) - (b.sev === "h" ? 0 : 1) || (b.ord - a.ord); }); }
  function cxModF(list) { return ccModF === "all" ? list : list.filter(function (i) { return i.mod === ccModF; }); }
  function cxModSeg() {
    return '<span class="cx-seg cx-mseg" role="group" aria-label="Filter by module">' + [["all", "All modules"], ["IM", "Integration Monitor"], ["PM", "Performance Monitor"], ["RT", "Retail add-on"]].map(function (o) {
      return '<button type="button" data-cxmod="' + o[0] + '" aria-pressed="' + (ccModF === o[0]) + '">' + (o[0] === "all" ? "" : '<i class="cx-md ' + CCMOD[o[0]][1] + '"></i>') + o[1] + '</button>'; }).join("") + '</span>';
  }

  /* Screens */
  var CXS = {};
  var CCSNAP = "24 Oct 2026, 09:30 ET";
  function cxHead(t, extra) { var m = cxModKey(); return '<header class="cx-ph"><h2>' + t + '</h2>' + (m ? cxTag(m) : "") + (extra || "") + '</header>'; }
  function cxCard(t, body, cls, right) { return '<section class="cx-card' + (cls ? " " + cls : "") + '">' + (t ? '<header><h3>' + t + '</h3>' + (right || "") + '</header>' : "") + body + '</section>'; }
  function cxKpi(l, v, s, cls) { return '<div class="cx-kpi' + (cls ? " " + cls : "") + '"><span>' + l + '</span><b>' + v + '</b>' + (s ? '<small>' + s + '</small>' : "") + '</div>'; }
  function cxSeg(name, opts, cur) { return '<span class="cx-seg" role="group">' + opts.map(function (o) { return '<button type="button" data-cxseg="' + name + '" data-v="' + o + '" aria-pressed="' + (o === cur) + '">' + o + '</button>'; }).join("") + '</span>'; }
  function cxGoBtn(label, scr) { return '<button type="button" class="cx-lk" data-cxgo="' + scr + '">' + label + ci("chev", "cx-lki") + '</button>'; }
  function cxItemLink(i, cls) { return '<button type="button" class="cx-lk' + (cls ? " " + cls : "") + '" ' + i.open + '>' + cxe(i.title) + '</button>'; }

  var CXCAT = [["Order and fulfillment", "850 PO · 855 PO Ack · 856 ASN", 85, [["PO acknowledgment rate", "855 PO acknowledgment", "96.5%", "≥ 98%", 98, 5, 0], ["PO acknowledgment cycle time", "850 PO to 855 PO acknowledgment", "5.5 hrs", "≤ 4 hrs", 73, 4, 1], ["Order accuracy", "850 PO and 855 PO acknowledgment", "98.2%", "≥ 99%", 99, 5, 0], ["Order fill rate", "855 PO acknowledgment", "95.5%", "≥ 98%", 97, 5, 0], ["Backorder rate", "855 PO acknowledgment", "3.5%", "≤ 2%", 57, 4, 1]]],
    ["Shipping and delivery", "856 ASN · 214 Shipment status", 94, [["Ship notice timeliness", "856 before arrival", "97.1%", "≥ 98%", 96, 6, 0], ["On-time in-full (OTIF)", "850, 856 and 214", "91.5%", "≥ 95%", 96, 8, 1], ["ASN accuracy", "856 against receipt", "98.8%", "≥ 99%", 98, 5, 0]]],
    ["Invoicing and financial", "810 Invoice · 820 Remittance", 90, [["Invoice accuracy rate", "810 against 850 and 856", "96.6%", "≥ 98%", 92, 6, 1], ["Chargeback and deduction rate", "812 against 810", "2.1%", "≤ 1.5%", 64, 5, 1]]],
    ["Partner compliance and EDI health", "997 Functional acknowledgments", 92, [["First-pass acceptance", "997 and 824", "97.4%", "≥ 98%", 94, 5, 0], ["Transaction rejection rate", "824 rejections", "1.8%", "≤ 1%", 70, 4, 1]]]];
  CXS["an"] = function () {
    var h = cxHead("Performance Analytics") + '<nav class="cx-tabs"><button type="button" data-cxtab="sc" aria-pressed="' + (ccTab === "sc") + '">Partner scorecard</button><button type="button" data-cxtab="km" aria-pressed="' + (ccTab === "km") + '">Key metrics</button></nav>' +
      '<div class="cx-bar"><span class="cx-lb">Partner type</span>' + cxSeg("tpt", ["Customer", "Supplier", "Logistics"], ccTpt) + '</div>';
    if (ccTab === "sc") {
      h += '<section class="cx-hero"><div class="cx-ov"><span>Overall partner score</span><b>91.3</b><small>/100 · Grade B</small><em>' + ci("warn") + 'Performance requires watching</em></div>' +
        [["On-time in-full (OTIF)", "850/856/214", "91.5%", "score 96", "Target ≥ 95%", "3.5 pts"], ["Perfect order rate", "850-856-810", "90%", "score 95", "Target ≥ 95%", "5.0 pts"], ["PO acknowledgment rate", "855", "96.5%", "score 98", "Target ≥ 98%", "1.5 pts"]].map(function (k) {
          return '<div class="cx-kc"><header><b>' + k[0] + '</b><code>' + k[1] + '</code></header><strong>' + k[2] + '<small>' + k[3] + '</small></strong><span class="cx-pb"><i style="width:92%"></i><u style="left:96%"></u></span><div class="cx-ft"><span>' + k[4] + '</span><em>' + ci("warn") + '↓ ' + k[5] + '</em></div></div>';
        }).join("") + '</section><h4 class="cx-sh">Performance by category</h4>' +
        CXCAT.map(function (c, ci_) {
          return '<details class="cx-cat"' + (ci_ === 0 ? " open" : "") + '><summary>' + ci("down") + '<b>' + c[0] + '</b><span>' + c[1] + '</span><em class="' + (c[2] < 88 ? "w" : "g") + '">avg score ' + c[2] + '</em></summary>' + c[3].map(function (m) {
            return '<div class="cx-mt"><div><b>' + m[0] + '</b><span><code>' + m[1] + '</code>' + (m[6] ? '<em class="w">' + ci("warn") + 'Off target</em>' : '<em class="g">' + ci("ok") + 'On target</em>') + '</span></div><div class="cx-mb"><span>Target: ' + m[3] + '</span><span>Score: ' + m[4] + '</span><span>Weight: ' + m[5] + '%</span><span class="cx-pb ' + (m[6] ? "w" : "") + '"><i style="width:' + m[4] + '%"></i></span></div><strong class="' + (m[6] ? "w" : "g") + '">' + m[2] + '</strong></div>';
          }).join("") + '</details>';
        }).join("");
    } else {
      h += '<div class="cx-g2">' + cxCard("Where to focus", '<p class="cx-sub">Lowest-scoring KPIs pulling the rating down</p>' + cxBars([["Backorder rate", 57, "", "r"], ["Chargeback and deduction rate", 64, "", "y"], ["Transaction rejection rate", 70, "", "y"], ["PO acknowledgment cycle time", 73, "", "y"], ["Acknowledgment timeliness", 81, "", "y"], ["Perfect order rate", 95, "", "g"]], {})) +
        cxCard("Category health", '<p class="cx-sub">Average score by KPI group</p><div class="cx-dw">' + cxDonut(CXCAT.map(function (c, i) { return [c[0], c[2], ["#0066FF", "#001889", "#5B8DEF", "#9DB7F2", "#3F4D62"][i]]; }), 80, "89", "avg score") + '<ul class="cx-lg">' + CXCAT.map(function (c, i) { return '<li><i style="background:' + ["#0066FF", "#001889", "#5B8DEF", "#9DB7F2", "#3F4D62"][i] + '"></i>' + c[0] + '<b>' + c[2] + '</b></li>'; }).join("") + '</ul></div>') + '</div>' +
        '<div class="cx-g2">' + cxCard("Weighted partner score trend", cxLine([{ v: [86.2, 87.1, 87.0, 88.4, 89.9, 91.3], area: true }], { w: 600, h: 220, min: 80, max: 100, xl: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Score trend" })) +
        cxCard("Score contribution by KPI", '<p class="cx-sub">Weighted points contributed to the 91.3 overall score</p>' + cxBars([["On-time in-full (OTIF)", 7.7, "", "g"], ["Ship notice timeliness", 5.8, "", "g"], ["Invoice accuracy rate", 5.5, "", "y"], ["ASN accuracy", 4.9, "", "y"], ["Chargeback and deduction rate", 3.2, "", "y"]], { max: 8, fmt: function (v) { return v.toFixed(1); } })) + '</div>';
    }
    return h;
  };
  CXS["im-tp"] = function () {
    return cxHead("Partners") + cxCard("Partner integration analysis", '<div class="cx-k3">' + cxKpi("Total partners", "208", "78% active") + cxKpi("Active partners", "163", "Sent or received in 30 days") + cxKpi("Inactive partners", "45", "No activity in 30 days") + '</div>') +
      cxCard("Partner stats", cxLine([{ v: [172, 176, 179, 183, 186, 190, 193, 196, 199, 203, 205, 208] }, { v: [3, 4, 3, 4, 3, 4, 3, 3, 3, 4, 2, 3], c: "b2" }], { w: 1060, h: 230, max: 240, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Partners over 12 months" }) + '<ul class="cx-lg row"><li><i style="background:var(--pa)"></i>Total partners</li><li><i style="background:#001889"></i>Onboarded</li></ul>', "", cxSeg("rng", ["24M", "12M", "6M", "3M", "1M"], "12M"));
  };
  CXS["im-com"] = function () {
    return cxHead("Community") + '<div class="cx-k4">' + cxKpi("Total partners", "208") + cxKpi("Added this month", "3") + cxKpi("Added last month", "4") + cxKpi("Added this year", "21") + '</div>' +
      cxCard("Partners", '<table class="cx-tbl"><thead><tr><th>Partner name</th><th>Partner alias</th><th>Status</th><th>BUID</th><th>Onboarding date</th><th>Last activity</th></tr></thead><tbody>' +
        cxPartners().map(function (p) { return '<tr><td><b>' + p[0] + '</b></td><td><code>' + p[1] + '</code></td><td><span class="cx-st s-' + (p[2] === "Active" ? "resolved" : "known") + '"><i></i>' + p[2] + '</span></td><td>' + p[3] + '</td><td>' + p[4] + '</td><td>' + p[5] + '</td></tr>'; }).join("") + '</tbody></table>', "", '<span class="cx-note">Showing 10 of 208</span>');
  };
  var CXPJ = [["Harbor Grocers orders", "Order volume drop", 5, "Inbound", "Purchase order (850)", "X12", "Harbor Grocers", "f2"], ["Westline Home acknowledgments", "Volume drop", 3, "Inbound", "Functional acknowledgment (997)", "X12", "Westline Home", "f10"],
    ["Harbor Grocers remittances", "Document missing", 1, "Inbound", "Remittance advice (820)", "X12", "Harbor Grocers", "f7"], ["Northfield Stores invoices", "Within projection", 0, "Outbound", "Invoice (810)", "X12", "Northfield Stores", null],
    ["Westline Home orders", "Within projection", 0, "Inbound", "Purchase order (850)", "X12", "Westline Home", null]];
  var CXPJR = [["Meadowline Care orders", "Order volume drop", 5, "Outbound", "Purchase order (850)", "X12", "Meadowline Care", "f2"], ["Tidewell Home acknowledgments", "Volume drop", 3, "Outbound", "Functional acknowledgment (997)", "X12", "Tidewell Home", "f10"],
    ["Meadowline Care remittances", "Document missing", 1, "Outbound", "Remittance advice (820)", "X12", "Meadowline Care", "f7"], ["Nuvori Beauty invoices", "Within projection", 0, "Inbound", "Invoice (810)", "X12", "Nuvori Beauty", null],
    ["Copperleaf Living orders", "Within projection", 0, "Outbound", "Purchase order (850)", "X12", "Copperleaf Living", null]];
  function cxProj() { return ccRole() === "retailer" ? CXPJR : CXPJ; }
  CXS["im-proj"] = function () {
    var PJ = cxProj(), p = PJ[ccPj], act = ccPj === 0 ? [62, 88, 91, 41, null, null, null, null, null, null] : [70, 72, 75, 74, null, null, null, null, null, null], prj = [null, null, null, 112, 108, 104, 98, 96, 94, 95];
    return cxHead("Projections and anomalies") + '<div class="cx-pj"><nav class="cx-pjl"><header><b>Projections</b><span>Anomalies</span></header>' + PJ.map(function (x, i) {
      return '<button type="button" data-cxpj="' + i + '" aria-pressed="' + (i === ccPj) + '"><b>' + x[0] + '</b><small>' + x[1] + ' · Executed today, 08:00</small>' + (x[2] ? '<em>' + x[2] + ci("warn") + '</em>' : '') + '</button>';
    }).join("") + '</nav><section class="cx-pjd"><header><h3>' + p[0] + '</h3>' + (p[7] ? '<button type="button" class="cx-btn" data-cxf="' + p[7] + '">Open finding</button>' : '') + '</header>' +
      '<div class="cx-chips">' + [["D", "Direction", p[3]], ["D", "Document type", p[4]], ["S", "Document standard", p[5]], ["P", "Partner", p[6]]].map(function (c) { return '<div><i>' + c[0] + '</i><span>' + c[1] + '<b>' + c[2] + '</b></span></div>'; }).join("") + '</div>' +
      '<div class="cx-bar"><span class="cx-lb">Projection for</span>' + cxSeg("pjr", ["7d", "30d"], "7d") + '</div>' +
      cxLine([{ v: act, c: "act" }, { v: prj, c: "prj" }], { w: 840, h: 210, max: 140, xl: ["Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29"], now: 3, band: prj.map(function (v) { return v == null ? null : [v - 16, v + 16]; }), label: "Projection and actual" }) +
      '<ul class="cx-lg row"><li><i class="bd"></i>Projected range</li><li><i style="background:#5B8DEF"></i>Projection</li><li><i style="background:#E8590C"></i>Actual</li></ul><h4 class="cx-sh">Heat map: hourly activity projection</h4>' + cxHeat() + '</section></div>';
  };
  /* Solution: the business documents behind the client's three processes */
  var CXSOL = [["Purchase order", "850, 860", "Sales order", "Order to cash"], ["Order acknowledgment", "855, 865", "Order confirmation", "Order to cash"], ["Price catalog", "832", "Condition record", "Order to cash"],
    ["Ship notice", "856", "Outbound delivery", "Order to cash, Receive, match and pay"], ["Application advice", "824", "Rejection message", "Order to cash, Receive, match and pay"], ["Invoice", "810", "Billing document", "Order to cash, Receive, match and pay"],
    ["Functional acknowledgment", "997", "Transmission status", "All three processes"], ["Remittance advice", "820", "Incoming payment", "Order to cash, Deductions"], ["Debit memo", "812", "Dispute case", "Deductions"]];
  var CXCFG = [];
  CXS["cfg"] = function () {
    var tab = ccCfgTab === "ps" ? "ps" : "rp";
    var h = cxHead("Configuration") + '<nav class="cx-tabs"><button type="button" data-cxcfg="rp" aria-pressed="' + (tab === "rp") + '">Rules &amp; Policies</button><button type="button" data-cxcfg="ps" aria-pressed="' + (tab === "ps") + '">Partner settings</button></nav>';
    if (tab === "ps") return h + cxCard("Partner activity", '<p class="cx-sub">Days without activity before a partner is marked inactive.</p><label class="cx-fl">Threshold (days)<input type="number" value="30" min="1"></label><button type="button" class="cx-btn p">Save</button>', "", cxTag("IM"));
    return h + '<section class="cx-card cx-rh"><div><span>Total rules</span><b>' + CXR.length + '</b><small><i class="g"></i>' + CXR.filter(function (r) { return r[7] === "Active"; }).length + ' active <i class="r"></i>1 over budget <i class="y"></i>1 paused</small></div>' +
      cxKpi("Total findings", "238") + cxKpi("Total inspections", "159.9K") + cxKpi("Average conformance", "95.8%") + cxKpi("Total deviation", "6,653") + '</section>' +
      cxCard("Rules", '<table class="cx-tbl"><thead><tr><th>Rule</th><th>Transaction</th><th>Process</th><th class="n">Conformance</th><th class="n">Findings (30d)</th><th>Last executed</th><th>Status</th></tr></thead><tbody>' + CXA.map(function (a) {
        return '<tr class="gh"><td colspan="7">' + a.n + ' · ' + a.r + '</td></tr>' + CXR.filter(function (r) { return r[0] === a.id; }).map(function (r) {
          return '<tr><td><b class="cx-lkt">' + cxe(r[1]) + '</b></td><td>' + cxe(r[2]) + '</td><td>' + cxe(r[3]) + '</td><td class="n">' + r[4].toFixed(1) + '%</td><td class="n">' + r[5] + '</td><td>' + r[6] + '</td><td><span class="cx-st s-' + (r[7] === "Active" ? "resolved" : r[7] === "Paused" ? "acknowledged" : "new") + '"><i></i>' + r[7] + '</span></td></tr>';
        }).join("");
      }).join("") + '</tbody></table>', "", '<span class="cx-note">Grouped by agent</span>' + cxTag("PM") + '<button type="button" class="cx-btn p" data-rwnew>' + ci("plus") + 'Create rule</button>') + CXCFG.map(function (f) { return f(); }).join("");
  };
  /* Dashboard: one view of the network. Each component names the module that produces it. */
  var CXDASH = [];
  function cxDc(c) { return '<section class="cx-card cx-dc w' + c.w + '" data-mod="' + (c.mod || "all") + '"><header><h3>' + c.t + '</h3>' + cxTag(c.mod) + '</header><div class="cx-dcb">' + c.h() + '</div>' + (c.f ? '<footer class="cx-dcf">' + c.f() + '</footer>' : "") + '</section>'; }
  /* Overview hero: the client's processes stream into the ring of process instances; ribbons split what needs action from what was resolved */
  function cxBez(p0, p1, p2, p3, t) { var u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; }
  function cxHero() {
    var X = 548, Y = 270, R = 128, items = ccItems(), open = items.filter(function (i) { return !i.done; }), hi = cxSort(open.filter(function (i) { return i.sev === "h"; }));
    var tot = 0, ok = 0, rk = 0, br = 0; [0, 1, 3].forEach(function (i) { var F = CCFLOW[i]; tot += F.n; ok += F.ok; rk += F.risk; br += F.br; });
    var svg = '<svg class="cx-ring" viewBox="0 0 820 560" role="img" aria-label="' + tot.toLocaleString("en-US") + ' process instances in flight, ' + open.length + ' findings need action"><defs>' +
      '<filter id="cxbl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="cxsf" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="28"/></filter>' +
      '<radialGradient id="cxdisc" cx="50%" cy="40%" r="62%"><stop offset="0" style="stop-color:var(--g-disc2)"/><stop offset="1" style="stop-color:var(--g-disc)"/></radialGradient>' +
      '<linearGradient id="cxrr" x1="0" x2="1"><stop offset="0" style="stop-color:var(--g-red);stop-opacity:0"/><stop offset=".45" style="stop-color:var(--g-red);stop-opacity:.85"/><stop offset="1" style="stop-color:var(--g-red)"/></linearGradient>' +
      '<linearGradient id="cxrb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--g-blue);stop-opacity:0"/><stop offset=".45" style="stop-color:var(--g-blue);stop-opacity:.85"/><stop offset="1" style="stop-color:var(--g-blue)"/></linearGradient></defs>' +
      '<circle cx="' + X + '" cy="' + Y + '" r="190" class="g-halo" filter="url(#cxsf)"/>' +
      '<text x="0" y="20" class="g-eb">BUSINESS PROCESSES</text><text x="276" y="20" class="g-fn" text-anchor="end">In flight</text>';
    [0, 1, 3].forEach(function (i, k) {
      var F = CCFLOW[i], P = PROCESSES.retail[i], y = 92 + k * 150, n = open.filter(function (x) { return x.proc === i; }), sev = n.some(function (x) { return x.sev === "h"; }) ? "red" : n.length ? "amb" : "blue";
      var ang = (200 - k * 22) * Math.PI / 180, tx = X + (R + 22) * Math.cos(ang), ty = Y + (R + 22) * Math.sin(ang), d = "M304 " + y + " C400 " + y + " " + (tx - 90).toFixed(1) + " " + ty.toFixed(1) + " " + tx.toFixed(1) + " " + ty.toFixed(1);
      var w = 80, okw = w * F.ok / F.n, rw = w * F.risk / F.n, bw = w * F.br / F.n, docs = [].concat.apply([], P.steps.map(function (s) { return s[1].split(" / ")[0].split(/,\s*/); })).filter(function (v, j, a) { return /^\d/.test(v) && a.indexOf(v) === j; }).join(", ");
      svg += '<path d="' + d + '" class="g-st ' + sev + '"/>' + [0, 1, 2].map(function (q) { return '<circle r="2.4" class="g-pt ' + sev + '"><animateMotion dur="3.6s" begin="-' + (q * 1.2) + 's" repeatCount="indefinite" path="' + d + '"/></circle>'; }).join("") +
        '<text x="0" y="' + (y - 6) + '" class="g-pn">' + cxe(GENOME.retail.short[i]) + '</text><text x="0" y="' + (y + 12) + '" class="g-fn">' + cxe(docs) + '</text>' +
        '<text x="276" y="' + (y - 6) + '" class="g-pc" text-anchor="end">' + F.n.toLocaleString("en-US") + '</text>' +
        '<rect x="196" y="' + (y + 22) + '" width="' + w + '" height="4" rx="2" class="g-tr"/><rect x="196" y="' + (y + 22) + '" width="' + okw.toFixed(1) + '" height="4" rx="2" class="g-f blue"/>' +
        '<rect x="' + (196 + okw).toFixed(1) + '" y="' + (y + 22) + '" width="' + rw.toFixed(1) + '" height="4" class="g-f amb"/><rect x="' + (196 + okw + rw).toFixed(1) + '" y="' + (y + 22) + '" width="' + bw.toFixed(1) + '" height="4" class="g-f red"/>' +
        '<circle cx="300" cy="' + y + '" r="9" class="g-f ' + sev + '" opacity=".18"/><circle cx="300" cy="' + y + '" r="4.5" class="g-nd ' + sev + '"/>' +
        (n.length ? '<text x="0" y="' + (y + 44) + '" class="g-fs ' + sev + '">' + n.length + ' open finding' + (n.length > 1 ? "s" : "") + '</text>' : "");
    });
    for (var a = 0; a < 360; a += 3) { var rd = a * Math.PI / 180, big = a % 30 === 0, r1 = R + 38, r2 = r1 + (big ? 11 : 5);
      svg += '<line x1="' + (X + r1 * Math.cos(rd)).toFixed(1) + '" y1="' + (Y + r1 * Math.sin(rd)).toFixed(1) + '" x2="' + (X + r2 * Math.cos(rd)).toFixed(1) + '" y2="' + (Y + r2 * Math.sin(rd)).toFixed(1) + '" class="g-tk" opacity="' + (0.18 + 0.5 * Math.pow(Math.cos((a - 300) * Math.PI / 360), 2)).toFixed(2) + '"/>'; }
    svg += '<circle cx="' + X + '" cy="' + Y + '" r="' + (R + 18) + '" class="g-l2"/><circle cx="' + X + '" cy="' + Y + '" r="' + (R - 18) + '" fill="url(#cxdisc)" class="g-l2s"/><circle cx="' + X + '" cy="' + Y + '" r="' + (R - 42) + '" class="g-l1"/>';
    var S = [["On track", ok, "blue", 5], ["At risk", rk, "amb", 8], ["Breached", br, "red", 9]], at = -96, gap = 2.6, mids = [];
    S.forEach(function (sg) {
      var span = Math.max(360 * sg[1] / tot, 7), a0 = (at + gap / 2) * Math.PI / 180, a1 = (at + span - gap / 2) * Math.PI / 180, dd; mids.push((at + span / 2) * Math.PI / 180); at += span;
      dd = "M" + (X + R * Math.cos(a0)).toFixed(1) + " " + (Y + R * Math.sin(a0)).toFixed(1) + "A" + R + " " + R + " 0 " + (span > 180 ? 1 : 0) + " 1 " + (X + R * Math.cos(a1)).toFixed(1) + " " + (Y + R * Math.sin(a1)).toFixed(1);
      svg += '<path d="' + dd + '" class="g-arc-t"/><path d="' + dd + '" class="g-arc ' + sg[2] + '" style="stroke-width:' + sg[3] + 'px"/>';
    });
    [1, 2].forEach(function (k, j) {
      var m = mids[k], x0 = X + (R + 10) * Math.cos(m), y0 = Y + (R + 10) * Math.sin(m), ly = 34 + j * 40, lx = 640;
      svg += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + (x0 + 26).toFixed(1) + ' ' + ly + 'H' + (lx - 8) + '" class="g-cl ' + S[k][2] + '"/><circle cx="' + (lx - 8) + '" cy="' + ly + '" r="3" class="g-f ' + S[k][2] + '"/>' +
        '<text x="' + lx + '" y="' + (ly - 3) + '" class="g-cn">' + S[k][0] + ' · ' + S[k][1] + '</text><text x="' + lx + '" y="' + (ly + 12) + '" class="g-cs ' + S[k][2] + '">' + ["Expected document due soon", "Window passed"][j] + '</text>';
    });
    svg += '<text x="' + X + '" y="' + (Y - 46) + '" class="g-eb" text-anchor="middle">IN FLIGHT</text><text x="' + X + '" y="' + (Y + 10) + '" class="g-big" text-anchor="middle">' + tot.toLocaleString("en-US") + '</text>' +
      '<text x="' + X + '" y="' + (Y + 33) + '" class="g-ok" text-anchor="middle">' + (100 * ok / tot).toFixed(1) + '% on track</text><line x1="' + (X - 66) + '" y1="' + (Y + 48) + '" x2="' + (X + 66) + '" y2="' + (Y + 48) + '" class="g-l2"/>' +
      '<text x="' + (X - 44) + '" y="' + (Y + 70) + '" class="g-sm" text-anchor="middle">1,930</text><text x="' + (X - 44) + '" y="' + (Y + 85) + '" class="g-fn" text-anchor="middle">Closed today</text>' +
      '<text x="' + (X + 44) + '" y="' + (Y + 70) + '" class="g-sm" text-anchor="middle">' + open.length + '</text><text x="' + (X + 44) + '" y="' + (Y + 85) + '" class="g-fn" text-anchor="middle">Need action</text>';
    function rib(y0, y1, cls, grad, lbl) {
      var d = "M" + (X + R - 4) + " " + y0 + " C" + (X + R + 70) + " " + y0 + " 720 " + y1 + " 816 " + y1;
      return '<path d="' + d + '" class="g-rg ' + cls + '" filter="url(#cxsf)"/><path d="' + d + '" stroke="' + grad + '" class="g-rb"/>' + [0, 1, 2, 3].map(function (q) { return '<circle r="2.2" class="g-rp"><animateMotion dur="2.8s" begin="-' + (q * 0.7) + 's" repeatCount="indefinite" path="' + d + '"/></circle>'; }).join("") +
        '<text x="816" y="' + (y1 + (y1 < Y ? -22 : 34)) + '" class="g-cn" text-anchor="end">' + lbl + '</text>';
    }
    svg += rib(Y - 30, 210, "red", "url(#cxrr)", open.length + " need action") + rib(Y + 36, 452, "blue", "url(#cxrb)", "24 resolved today");
    svg += '<text x="0" y="552" class="g-fn">Ring: process instances by state · Strands: live document flow per process</text></svg>';
    var done = Object.keys(ccDone).filter(function (k) { return ccDone[k] === 1; }).length;
    function spark(v) { var mx = Math.max.apply(null, v), l = v.map(function (y, i) { return (i ? "L" : "M") + (i * 64 / (v.length - 1)).toFixed(1) + " " + (26 - y / (mx || 1) * 24).toFixed(1); }).join(" "); return '<svg viewBox="0 0 64 26" width="64" height="26" aria-hidden="true"><path d="' + l + 'L64 26L0 26Z" class="g-sa"/><path d="' + l + '" class="g-sl"/></svg>'; }
    var side = '<div class="cx-hs"><h3 class="cx-hh"><span class="cx-hi r">' + ci("warn") + '</span>Failure points now<small>' + open.length + ' open</small></h3>' + hi.slice(0, 3).map(function (i) {
      return '<button type="button" class="cx-gc' + (i === hi[0] ? " crit" : "") + '" ' + i.open + '><span class="cx-gct">' + cxTag(i.mod) + cxSevChip(i.sev) + '</span><b>' + cxe(i.title) + '</b><small>' + cxe(i.partner) + '</small><span class="cx-gca">' + ci("spark") + '<span><b>' + cxe(i.agent.split(" · ")[0]) + '</b> ' + cxe(i.act) + '</span></span></button>'; }).join("") +
      '<h3 class="cx-hh"><span class="cx-hi b">' + ci("ok") + '</span>Resolved today<small>' + (24 + done) + '</small></h3>' +
      [["14", "Recovered by Integration Monitor", [1, 3, 4, 6, 8, 11, 13, 14]], [String(7 + done), "Agent actions approved", [0, 1, 1, 2, 4, 5, 6, 7 + done]], ["3", "Awaiting partner confirmation", [0, 0, 1, 1, 2, 3, 3, 3]]].map(function (d) {
        return '<div class="cx-gc cx-gr"><div><b class="cx-gv">' + d[0] + '</b><small>' + d[1] + '</small></div>' + spark(d[2]) + '</div>'; }).join("") + '</div>';
    return '<section class="cx-hero2" aria-label="Process health"><div class="cx-hv">' + svg + '</div>' + side + '</section>';
  }
  CXS["dash"] = function () {
    var list = CXDASH.slice().sort(function (a, b) { return a.o - b.o; }).filter(function (c) { return ccModF === "all" || !c.mod || c.mod === ccModF; });
    return '<header class="cx-ph cx-dh cx-gh"><div><p class="cx-gk">Command Center · Overview</p><h2>' + cxe(ccCompany()) + '</h2><p>Retail and CPG · Order to cash; Receive, match and pay; Deductions · Illustrative data</p></div><span class="cx-live"><i></i>Live · updated ' + CCSNAP.split(", ")[1] + '</span></header>' + cxHero() +
      '<header class="cx-ph cx-dh cx-ms"><div><h2>By module</h2><p>Each component names the module that produces it.</p></div>' + cxModSeg() + '</header><div class="cx-dg">' + list.map(cxDc).join("") + '</div>';
  };
  CXDASH.push(
    { o: 10, mod: "IM", w: 2, t: "Network activity", h: function () {
      return '<div class="cx-k2">' + cxKpi("Documents this week", "2,056", '<em class="up">↑ 11% vs last week</em>') + cxKpi("Volume anomalies", "3", '<em class="dn">↑ 2 vs yesterday</em>') +
        cxKpi("Failed transactions", "121", "Last 24 hours") + cxKpi("Active partners", "163", "Of 208 connected") + '</div>'; }, f: function () { return cxGoBtn("Projections and anomalies", "im-proj"); } },
    { o: 20, mod: "PM", w: 2, t: "Process performance", h: function () {
      var op = cxOpen().filter(function (f) { return f.mod === "Performance Monitor"; }), hi = op.filter(function (f) { return f.sev === "c"; }).length, val = op.reduce(function (a, f) { return a + f.val; }, 0);
      return '<div class="cx-k2">' + cxKpi("Open findings", op.length, hi + " high severity") + cxKpi("Value at risk", "$" + Math.round(val / 1000) + "K", "Across open findings") +
        cxKpi("Average conformance", "95.8%", "Last 30 days") + cxKpi("Active rules", CXR.filter(function (r) { return r[7] === "Active"; }).length, "Across " + CXA.length + " agents") + '</div>'; }, f: function () { return cxGoBtn("Business processes", "ws-proc"); } },
    { o: 40, mod: "", w: 4, t: "Priority findings", h: function () {
      var op = cxSort(cxModF(ccItems()).filter(function (i) { return !i.done; })).slice(0, 6);
      return '<table class="cx-tbl cx-pf"><thead><tr><th>Finding</th><th>Module</th><th>Severity</th><th>Detected</th></tr></thead><tbody>' + op.map(function (i) {
        return '<tr><td>' + cxItemLink(i, "b") + '<small>' + cxe(i.partner) + '</small></td><td>' + cxTag(i.mod) + '</td><td>' + cxSevChip(i.sev) + '</td><td>' + cxe(i.at) + '</td></tr>'; }).join("") +
        (op.length ? "" : '<tr><td colspan="4" class="cx-empty">No open findings.</td></tr>') + '</tbody></table>'; },
      f: function () { return cxGoBtn("View all " + cxModF(ccItems()).filter(function (i) { return !i.done; }).length + " open findings", "find"); } },
    { o: 50, mod: "", w: 2, t: "Action queue", h: function () {
      var it = cxModF(ccItems()), w = cxSort(it.filter(function (i) { return !i.actDone; })), d = it.length - w.length;
      return '<div class="cx-k2 cx-k2s">' + cxKpi("Awaiting decision", w.length) + cxKpi("Completed", d) + '</div><ul class="cx-aq">' + w.slice(0, 3).map(function (i) {
        return '<li>' + cxTag(i.mod) + cxItemLink(i, "b") + '<p>' + cxe(i.act) + '</p></li>'; }).join("") + '</ul>'; }, f: function () { return cxGoBtn("Open action queue", "act"); } },
    { o: 60, mod: "PM", w: 3, t: "Process health", h: function () {
      var op = cxOpen();
      return '<p class="cx-sub">Open findings by retail business process</p><ul class="cx-ph2">' + CCSTG.map(function (g) {
        return '<li><b>' + g[0] + '</b>' + g[1].map(function (i) { var n = op.filter(function (f) { return f.p === i; }), sev = n.some(function (f) { return f.sev === "c"; }) ? "c" : n.length ? "w" : "ok";
          return '<button type="button" class="cx-pc ' + sev + '" data-cxproc="' + i + '"><i></i>' + cxe(GENOME.retail.short[i]) + (n.length ? '<em>' + n.length + '</em>' : '') + '</button>'; }).join("") + '</li>'; }).join("") + '</ul>'; },
      f: function () { return cxGoBtn("View processes", "ws-proc"); } },
    { o: 70, mod: "IM", w: 3, t: "Document transaction summary", h: function () {
      return '<div class="cx-g2 in">' + [["Yesterday", "Friday, October 23, 2026", "2,056"], ["Last month", "September 1 to 30, 2026", "45,231"]].map(function (p) {
        return '<div><b class="cx-pl">' + p[0] + '</b><small class="cx-pd">' + p[1] + '</small>' + cxDonut([["850", 34, "#0066FF"], ["856", 27, "#001889"], ["810", 25, "#5B8DEF"], ["Other", 14, "#9DB7F2"]], 54, p[2], "Total") + '</div>'; }).join("") +
        '</div><ul class="cx-lg row"><li><i style="background:#0066FF"></i>850 Purchase order</li><li><i style="background:#001889"></i>856 Ship notice</li><li><i style="background:#5B8DEF"></i>810 Invoice</li><li><i style="background:#9DB7F2"></i>Other</li></ul>'; } },
    { o: 80, mod: "IM", w: 4, t: "Transaction volume", h: function () {
      return cxLine([{ v: [3820, 3960, 4100, 4120, 4010, 3890, 4240, 4380, 4510, 4460, 4620, 4590], area: true }], { w: 760, h: 220, min: 3000, max: 5000, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Transaction volume, last 12 months" }); },
      f: function () { return '<span class="cx-note">Documents per day, last 12 months</span>'; } },
    { o: 100, mod: "PM", w: 3, t: "Findings by agent", h: function () {
      return cxBars(CXA.map(function (a, k) { return [a.n + " · " + a.r, a.f.filter(function (id) { return !ccDone[id]; }).length + [12, 5, 3, 4, 6][k], "", "b"]; }), { max: 20 }); },
      f: function () { return '<span class="cx-note">Last 30 days</span>' + cxGoBtn("Agents", "ws-agents"); } },
    { o: 110, mod: "IM", w: 3, t: "Community", h: function () {
      return '<ul class="cx-stl">' + [["Total partners", "208"], ["Added this year", "21"], ["Added this month", "3"], ["Added last month", "4"], ["Active partners", "163"]].map(function (r) { return '<li><span>' + r[0] + '</span><b>' + r[1] + '</b></li>'; }).join("") + '</ul>'; },
      f: function () { return cxGoBtn("Community", "im-com"); } }
  );

  /* Findings: every module in one list */
  var CXKA = {
    supplier: "Order to cash carries three of the high-severity findings. Harbor Grocers orders stopped at 05:52 after a certificate rotation, 14 Northfield Stores shipments have no ship notices, and $46,200 in invoices is held on price. Approve these actions first, then work the Westline Home acknowledgment backlog.",
    retailer: "Order to cash carries three of the high-severity findings. Orders are not reaching Meadowline Care after an endpoint change, 14 Nuvori Beauty loads arrive without ship notices, and $46,200 in Solara Personal Care invoices is held on price. Approve these actions first, then clear the Copperleaf Living acknowledgment backlog."
  };
  CXS["find"] = function () {
    var all = cxModF(ccItems()), op = all.filter(function (i) { return !i.done; }), hi = op.filter(function (i) { return i.sev === "h"; }).length;
    var list = cxSort(all.filter(function (i) { return (ccStF === "all" || !i.done) && (ccSevF === "all" || i.sev === ccSevF); }));
    var by = function (m) { return op.filter(function (i) { return i.mod === m; }).length; };
    var sel = function (name, opts, cur, label) { return '<label class="cx-sel"><span class="sr-only">' + label + '</span><select data-' + name + ' aria-label="' + label + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (cur === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") + '</select></label>'; };
    var groups = ["IM", "PM", "RT"].map(function (m) { return [m, list.filter(function (i) { return i.mod === m; })]; }).filter(function (g) { return g[1].length; });
    return cxHead("Findings", cxModSeg()) +
      '<div class="cx-fsum">' + cxKpi("Open findings", op.length, hi + " high severity") + ["IM", "PM", "RT"].filter(function (m) { return ccModF === "all" || ccModF === m; }).map(function (m) {
        return '<div class="cx-kpi cx-km"><span>' + cxTag(m) + '</span><b>' + by(m) + '</b><small>Open</small></div>'; }).join("") + '</div>' +
      (ccModF === "all" ? cxCard("", '<p class="cx-ka">' + ci("spark") + 'Key analysis</p><p class="cx-sub">' + cxe(CXKA[ccRole()]) + (by("RT") ? " The Retail add-on adds " + by("RT") + " open cases on partner readiness, order commitments, shipment readiness and settlement." : "") + '</p>', "cx-kac") : "") +
      cxCard("All findings", '<table class="cx-tbl cx-ftb"><thead><tr><th>Finding</th><th>Rule or check</th><th>Process</th><th>Owner</th><th>Status</th><th>Detected</th><th>Severity</th></tr></thead><tbody>' + groups.map(function (g) {
        return '<tr class="gh"><td colspan="7">' + cxTag(g[0]) + '<span>' + g[1].length + ' shown</span></td></tr>' + g[1].map(function (i) {
          return '<tr><td>' + cxItemLink(i, "b") + '<small>' + cxe(i.partner) + ' · ' + cxe(i.agent) + '</small></td><td>' + cxe(i.check) + '</td><td>' + cxe(GENOME.retail.short[i.proc]) + '</td><td>' + cxe(i.owner) + '</td><td>' + cxStPill(i.status) + '</td><td>' + cxe(i.at) + '</td><td>' + cxSevChip(i.sev) + '</td></tr>'; }).join("");
      }).join("") + (list.length ? "" : '<tr><td colspan="7" class="cx-empty">No findings match these filters.</td></tr>') + '</tbody></table>', "",
        sel("cxsev", [["all", "All severities"], ["h", "High"], ["m", "Medium"]], ccSevF, "Severity") + sel("cxstf", [["open", "Open"], ["all", "Open and closed"]], ccStF, "Status"));
  };

  /* Action queue: recommendations from agents and add-on workflows */
  var CXACTX = [];
  CXS["act"] = function () {
    var it = cxModF(ccItems()), wait = cxSort(it.filter(function (i) { return !i.actDone; })), done = it.filter(function (i) { return i.actDone; }), list = ccActTab === "open" ? wait : done;
    return cxHead("Action queue", CXACTX.map(function (f) { return f(); }).join("") + cxModSeg()) + '<p class="cx-lead">Recommended actions from Performance Monitor agents, Integration Monitor anomalies and Retail add-on workflows. An action runs only after a person approves it.</p>' +
      '<nav class="cx-tabs"><button type="button" data-cxat="open" aria-pressed="' + (ccActTab === "open") + '">Awaiting decision <em>' + wait.length + '</em></button><button type="button" data-cxat="done" aria-pressed="' + (ccActTab === "done") + '">Completed <em>' + done.length + '</em></button></nav>' +
      '<ul class="cx-acl">' + list.map(function (i) {
        return '<li class="' + (i.sev === "h" ? "c" : "w") + '"><div><header>' + cxTag(i.mod) + cxSevChip(i.sev) + '<span>' + cxe(i.agent) + ' · ' + cxe(i.at) + '</span></header>' + cxItemLink(i, "b") + '<p>' + cxe(i.act) + '</p><small>' + cxe(i.partner) + ' · ' + cxe(cxProcName(i.proc)) + ' · ' + (i.mod === "RT" ? "Owner: " + cxe(i.owner) : "Approver: " + cxe(i.appr)) + '</small></div>' +
          '<div class="cx-acb">' + (i.actDone ? '<span class="cx-done">' + ci("ok") + cxe(i.actState) + '</span>' : i.actBtn) + '<button type="button" class="cx-btn" ' + i.open + '>Review</button></div></li>';
      }).join("") + (list.length ? "" : '<li class="cx-empty">' + (ccActTab === "open" ? "No actions waiting." : "No completed actions yet.") + '</li>') + '</ul>';
  };

  /* Drawers: a finding, or a business process */
  function cxDrawer() {
    if (!ccDr) return "";
    var h;
    if (ccDr[0] === "f") {
      var f = cxById(ccDr[1]), P = PROCESSES.retail[f.p], done = ccDone[f.id];
      h = '<header><span><p>Finding · ' + cxe(cxAgentName(f)) + '</p><h3>' + cxe(f.ot) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
        '<p class="cx-chipsr">' + cxSevChip(f.sev) + cxStChip(f) + cxTag(f.mod === "Integration Monitor" ? "IM" : "PM") + '<span class="cx-tg">' + cxe(f.how) + '</span></p><p>' + cxe(f.os) + '</p>' +
        '<div class="cx-imp"><b>' + cxe(f.bt) + '</b><span>' + cxe(f.bs) + '</span></div>' +
        '<dl class="cx-dl"><div><dt>Partner</dt><dd>' + cxe(f.partner) + '</dd></div><div><dt>Process</dt><dd><button type="button" class="cx-lk" data-cxproc="' + f.p + '">' + cxe(P.n) + '</button>, step ' + (f.st + 1) + ': ' + cxe(P.steps[f.st][0]) + '</dd></div><div><dt>Rule</dt><dd>' + cxe(CXRULE[f.id]) + '</dd></div><div><dt>Transactions</dt><dd>' + cxe(CXDOC[f.id]) + '</dd></div></dl>' +
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
        '</ol></div><div class="cx-ft"><button type="button" class="cx-btn p" data-cxwsproc="' + i + '">Open process view</button><a class="cx-btn" href="' + CC_GENOME + '">Open in Process Genome</a></div>';
    }
    return '<div class="cx-scrim" data-cxclose></div><aside class="cx-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  }

  /* Aviator: scripted answers over the shared findings. Add-ons append questions. */
  var CXQ = [
    { q: function () { return "What should I work on first?"; }, a: function () {
      var hi = cxSort(ccItems().filter(function (i) { return !i.done && i.sev === "h"; }));
      return [hi.length + " high-severity findings are open across Integration Monitor, Performance Monitor and the Retail add-on. Start with these three.", hi.slice(0, 3)]; } },
    { q: function () { return ccRole() === "retailer" ? "Why are orders to Meadowline Care down?" : "Why are Harbor Grocers orders down?"; }, a: function () {
      var t = ccRole() === "retailer" ? "Ivy found outbound order volume to Meadowline Care 64% below projection since 05:52. Meadowline Care moved its AS2 endpoint in a maintenance window, so deliveries to the previous address fail. The weekly remittance advice to Meadowline Care is blocked by the same change."
        : "Ivy found order volume 64% below projection since 05:52. AS2 receipts from Harbor Grocers fail signature checks because the partner rotated its signing certificate. The weekly remittance advice is missing for the same reason.";
      return [t, ccItems().filter(function (i) { return i.key === "f:f2" || i.key === "f:f7"; })]; } },
    { q: function () { return "What needs my approval?"; }, a: function () {
      var w = cxSort(ccItems().filter(function (i) { return !i.actDone; }));
      return [w.length + " actions wait for a decision. The most urgent:", w.filter(function (i) { return i.sev === "h"; }).slice(0, 3)]; } }
  ];
  function cxAviator() {
    if (!ccAv) return "";
    var log = ccAvLog.map(function (m) { return '<li class="' + m[0] + '">' + m[1] + '</li>'; }).join("");
    return '<aside class="cx-av"><header>' + ci("spark") + '<b>Aviator</b><button type="button" class="cx-ic" data-cxav aria-label="Close Aviator">' + ci("x") + '</button></header><div class="cx-avb"><p class="cx-hi">Ask about processes, partners, findings or agents for ' + cxe(ccCompany()) + '.</p><ul class="cx-avl">' + log + '</ul>' +
      '<ul class="cx-avq">' + CXQ.map(function (q, i) { return '<li><button type="button" data-cxq="' + i + '">' + cxe(q.q()) + '</button></li>'; }).join("") + '</ul></div><div class="cx-ft"><span>Ask Aviator. Use @ to add agents.</span><button type="button" class="cx-ic" aria-label="Send" disabled>' + ci("send") + '</button><small>Scripted answers over illustrative data. AI can make mistakes. Check important information.</small></div></aside>';
  }
  function cxAsk(k) {
    var q = CXQ[k], r = q.a();
    ccAvLog.push(["q", cxe(q.q())], ["a", cxe(r[0]) + (r[1].length ? '<span class="cx-avr">' + r[1].map(function (i) { return cxItemLink(i); }).join("") + '</span>' : "")]);
  }

  /* Shell */
  var CXNAV = [["dash", "Overview", "dash"], ["find", "Findings", "search"], ["act", "Action queue", "check"],
    ["ws", "Workspace", "grid", [["ws-proc", "Business processes", "flow"], ["ws-dash", "Dashboards", "dash"], ["ws-rep", "Reports", "doc"], ["ws-not", "Notifications", "bell"], ["ws-task", "Tasks and reminders", "clock"], ["ws-agents", "Agents", "bot"]]],
    ["im", "Integration Monitor", "im", [["im-tp", "Partners", "users"], ["im-com", "Community", "net"], ["im-proj", "Projections and anomalies", "trend"]]],
    ["pm", "Performance Monitor", "pm", [["an", "Performance Analytics", "chart"]]]];
  var CXNAVEND = [["cfg", "Configuration", "cog"]];
  var CXALIAS = { "im-dash": "dash", "pm-dash": "dash", "rt-home": "dash", "pm-find": "find", "pm-act": "act", "rt-actions": "act", "pm-agents": "ws-agents", "ws": "ws-agents", "pm-rules": "cfg", "rt-rules": "cfg", "im-cfg": "cfg", "im-map": "ws-proc", "pm-proc": "ws-proc" };
  function cxMod() { var m = cxModKey(); return m ? CCMOD[m][0] : ""; }
  function cxBadge(k) { var it = ccItems(); var n = k === "find" ? it.filter(function (i) { return !i.done; }).length : k === "act" ? it.filter(function (i) { return !i.actDone; }).length : 0; return n ? '<em class="cx-nb">' + n + '</em>' : ""; }
  function cxTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function cxRender() {
    var nav = CXNAV.concat(CXNAVEND).map(function (g) {
      if (!g[3]) return '<li><button type="button" class="cx-n1' + (ccScr === g[0] ? " on" : "") + '" data-cxgo="' + g[0] + '" title="' + g[1] + '"' + (ccScr === g[0] ? ' aria-current="page"' : "") + '>' + ci(g[2]) + '<span>' + g[1] + '</span>' + cxBadge(g[0]) + '</button></li>';
      return '<li class="cx-ng"><button type="button" class="cx-n1 cx-grp" data-cxgrp="' + g[0] + '" aria-expanded="' + !!ccGrp[g[0]] + '" title="' + g[1] + '">' + ci("chev", "cv") + ci(g[2]) + '<span>' + g[1] + '</span>' + (g[0] !== "ws" ? '<i class="cx-md ' + g[0] + '" aria-hidden="true"></i>' : "") + '</button>' + (ccGrp[g[0]] ? '<ul>' + g[3].map(function (s) {
        return '<li><button type="button" class="cx-n2' + (ccScr === s[0] ? " on" : "") + '" data-cxgo="' + s[0] + '" title="' + s[1] + '"' + (ccScr === s[0] ? ' aria-current="page"' : "") + '>' + ci(s[2]) + '<span>' + s[1] + (s[3] ? ' <em class="cx-new">New</em>' : '') + '</span></button></li>'; }).join("") + '</ul>' : '') + '</li>';
    }).join("");
    var th = cxTheme();
    cx.classList.toggle("glass", ccScr === "dash");
    cx.innerHTML = '<header class="cx-top"><span class="cx-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#0066FF"/><path d="M22.5 13.6h1.8l1.3-2.1h-3.1V8.1h-3.9v5.9a6.8 6.8 0 1 0 0 6.3c0 1 .1 1.7.6 2.4.8 1.2 2.3 1.3 3.6 1.3.7 0 1.1-.1 1.8-.2v-2.8l-1 .1c-1 0-1-.7-1-1.5zM12.6 20.2a3.1 3.1 0 1 1 0-6.1 3.1 3.1 0 0 1 0 6.1z" fill="#fff"/></svg>Command Center' + (cxMod() ? '<em>' + cxMod() + '</em>' : '') + '</span>' +
      '<span class="cx-cust">' + cxe(ccCompany()) + ' · Retail and CPG</span><span class="cx-tb"><button type="button" class="cx-avt" data-cxav aria-pressed="' + ccAv + '">' + ci("spark") + 'Aviator</button><button type="button" class="cx-ic" data-cxgo="act" aria-label="Open action queue">' + ci("bell") + '</button><button type="button" class="cx-ic" data-cxhelp aria-label="Help">' + ci("help") + '</button>' +
      '<button type="button" class="cx-ic" data-cxtheme aria-label="' + (th === "dark" ? "Switch to light theme" : "Switch to dark theme") + '">' + ci(th === "dark" ? "sun" : "moon") + '</button><button type="button" class="cx-ic" data-cxfs aria-label="Full screen">' + ci("full") + '</button><span class="cx-me" title="' + cxe(ccCompany()) + '">' + (ccRole() === "retailer" ? "NS" : "NB") + '</span></span></header>' +
      '<div class="cx-body' + (ccNavMin ? " min" : "") + (ccAv ? " av" : "") + '"><nav class="cx-nav" aria-label="Command Center"><ul>' + nav + '</ul><a class="cx-n1 cx-col" href="' + CC_GENOME + '" title="Open Process Genome">' + ci("gen") + '<span>Open Process Genome</span></a><button type="button" class="cx-n1 cx-col" data-cxmin title="' + (ccNavMin ? "Expand panel" : "Collapse panel") + '">' + ci("side") + '<span>Collapse panel</span></button></nav>' +
      '<main class="cx-main" id="cx-main">' + CXS[ccScr]() + '</main>' + cxAviator() + '</div>' + cxDrawer();
  }
  function cxGo(s) { if (s === "im-map") ccWsProc = "sol"; if (s === "rt-rules") ccCfgTab = "rp"; s = CXALIAS[s] || s; if (!CXS[s]) s = "dash"; ccScr = s; ccDr = null; var m = cxModKey(s); if (m) ccGrp[CCMOD[m][1]] = true; if (s.indexOf("ws-") === 0) ccGrp.ws = true; cxRender(); var el = document.getElementById("cx-main"); if (el) el.scrollTop = 0; }
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cxgo],[data-cxgrp],[data-cxmin],[data-cxav],[data-cxf],[data-cxproc],[data-cxclose],[data-cxapp],[data-cxknown],[data-cxtab],[data-cxseg],[data-cxpj],[data-cxq],[data-cxfs],[data-cxmod],[data-cxat],[data-cxtheme],[data-cxcfg]"); if (!b) return;
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
    else if (b.hasAttribute("data-cxmod")) { ccModF = b.getAttribute("data-cxmod"); cxRender(); var f = cx.querySelector('[data-cxmod="' + ccModF + '"]'); if (f) f.focus({ preventScroll: true }); }
    else if (b.hasAttribute("data-cxcfg")) { ccCfgTab = b.getAttribute("data-cxcfg"); cxRender(); }
    else if (b.hasAttribute("data-cxat")) { ccActTab = b.getAttribute("data-cxat"); cxRender(); }
    else if (b.hasAttribute("data-cxtheme")) { var n = cxTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("edi-guide-theme", n); } catch (err) {} cxRender(); }
    else if (b.hasAttribute("data-cxfs")) { if (document.fullscreenElement) document.exitFullscreen(); else if (ccEl.requestFullscreen) ccEl.requestFullscreen().catch(function () {}); }
  });
  cx.addEventListener("change", function (e) {
    if (e.target.matches("[data-cxsev]")) { ccSevF = e.target.value; cxRender(); }
    else if (e.target.matches("[data-cxstf]")) { ccStF = e.target.value; cxRender(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key !== "Escape" || !ccDr || ccDr[0] !== "f" && ccDr[0] !== "p") return; e.preventDefault(); ccDr = null; cxRender(); });
  function ccFit() { ccEl.classList.toggle("small", window.innerWidth < 1024 || window.innerHeight < 560); }
  function ccStart() { ccFit(); cxRender(); }
  window.addEventListener("resize", ccFit);
