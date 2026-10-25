  /* Command Center (owner, Oct 24). Three packages:
     Integration Monitor, standard for every Trading Grid client; Performance Monitor, an industry-neutral add-on;
     and the Retail pack, which includes Performance Monitor and specializes it for retail and CPG.
     One Overview, one findings list and one action queue; every record names the module that produced it.
     Illustrative values for the concept preview. */
  var ccEl = document.getElementById("cc"), cx = document.getElementById("cx");
  var ccScr = "dash", ccNavMin = false, ccAv = false, ccDr = null, ccTab = "sc", ccPj = 0, ccAvLog = [];
  var ccCfgTab = "", ccModF = "all", ccSevF = "all", ccStF = "open", ccActTab = "open", ccPtTab = "all";
  var CC_GENOME = "../#retail/map";
  var CCPKG = { im: ["im"], pm: ["im", "pm"], rt: ["im", "pm", "rt"] }, CCPKGN = { im: "Integration Monitor", pm: "+ Performance Monitor", rt: "+ Retail pack" };
  var ccPkg = "rt"; try { var ccPk0 = localStorage.getItem("process-genome-cc-package"); if (CCPKG[ccPk0]) ccPkg = ccPk0; } catch (e) {}
  function ccOn(t) { return CCPKG[ccPkg].indexOf(String(t).toLowerCase()) >= 0; }
  function ccRole() { return ccOn("rt") && typeof rtRole === "string" ? rtRole : "supplier"; }
  function ccCompany() { return ccRole() === "retailer" ? "Northfield Stores" : "Nuvori Beauty"; }
  function ccIndustry() { return ccOn("rt") ? "Retail and CPG" : "Trading Grid"; }
  /* Process definitions come from the active package: retail definitions with the Retail pack, generic templates otherwise */
  function ccSol() { return CCSOL[ccRole()]; }
  function ccView(i) { return (CCVIEW[ccRole()] || {})[i] || {}; }
  function ccProc(i) {
    var g = ccOn("rt") ? PROCESSES.retail[i] : CCGEN[i], v = ccView(i), base = g.steps || PROCESSES.retail[i].steps;
    return { n: (ccOn("rt") && v.n) || g.n, owner: v.owner || g.owner, outcome: g.outcome, steps: (v.pre || []).concat(base, v.add || []), order: v.order };
  }
  function ccFlow(i) {
    var F = CCFLOW[ccRole()][i], n = 0, br = 0, risk = F.pred || 0, ack = 0, rej = 0;
    F.steps.forEach(function (s) { if (s) { n += s[1]; br += s[2] + s[4]; risk += s[3]; ack += s[3]; rej += s[4]; } });
    return { n: n, risk: risk, br: br, ok: n - risk - br, ack: ack, rej: rej, steps: F.steps };
  }
  /* Command Center sees EDI traffic only. Process views show the steps that exchange a document, with names for that document where the reference step is wider. */
  function ccSteps(i) { var hide = ccView(i).hide || [], P = ccProc(i), ix = P.order || P.steps.map(function (_, k) { return k; }); return ix.map(function (k) { return [k, P.steps[k]]; }).filter(function (p) { return hide.indexOf(p[0]) < 0 && CCFLOW[ccRole()][i].steps[p[0]] && ccToks(p[1][1]).some(function (t) { return /^(\d{3}|[A-Z]{6})$/.test(t.trim()); }); }); }
  function ccStepName(i, k) { var s = ccProc(i).steps[k]; return /^861\b/.test(s[1]) ? "Receiving advice" : s[0]; }
  function ccStepNo(i, k) { var s = ccSteps(i); for (var j = 0; j < s.length; j++) if (s[j][0] === k) return j + 1; return 0; }
  function ccStepDoc(s) { return s[1].replace(/,?\s*(WMS|ERP)\b/g, ""); }
  function ccShort(i) { return ccOn("rt") ? ccView(i).short || GENOME.retail.short[i] : CCGEN[i].n; }

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

  /* Agents. Ivy belongs to Integration Monitor; the others come with Performance Monitor. */
  var CXA = [
    { id: "lex", n: "Lex", r: "Timing and SLA agent", d: "Watches every document clock: acknowledgment windows and ship notice timing.", f: ["f1", "f3"], t: "pm" },
    { id: "nora", n: "Nora", r: "Conformance agent", d: "Checks documents against partner rules before and after they are sent: price, quantity, labels and required fields.", f: ["f4"], t: "pm" },
    { id: "liz", n: "Liz", r: "Process agent", d: "Follows each business process across its EDI documents, and flags steps that will fail later in the process.", f: ["f9"], t: "pm" },
    { id: "reese", n: "Reese", r: "Reconciliation agent", d: "Reconciles values across orders, shipments, invoices and remittances.", f: [], t: "pm" },
    { id: "ivy", n: "Ivy", r: "Volume agent", d: "Compares document volume with its projection by partner and hour, and raises missing documents and volume drops as findings.", f: ["f2", "f7", "f10"], t: "im" }
  ];
  var CXAF = {}; CXA.forEach(function (a) { a.f.forEach(function (id) { CXAF[id] = a; }); });
  var CXST = { f1: "New", f2: "New", f3: "Acknowledged", f4: "New", f7: "New", f9: "New", f10: "New" };
  var CXAS = { f3: "Dana Ortiz", f4: "Dana Ortiz" };
  var CXDOC = { f1: "Ship notice (856)", f2: "Purchase order (850)", f3: "Order acknowledgment (855)", f4: "Invoice (810)", f7: "Remittance advice (820)", f9: "Price catalog (832)", f10: "Functional acknowledgment (997)" };
  var CXRULE = { f1: "Ship notice within 1 hour of shipment", f2: "Order volume against projection", f3: "Acknowledgment within 24 hours", f4: "Invoice matches order price",
    f7: "Remittance advice on schedule", f9: "Cost change applied to open orders", f10: "Functional acknowledgments on time" };
  /* Rules: [agent, rule, document, process indices, conformance, findings 30d, last run, status]. Ivy's rules are Integration Monitor checks. */
  var CXR = [
    ["lex", "Ship notice within 1 hour of shipment", "Ship notice (856)", [0], 97.1, 31, "1 minute ago", "Active"],
    ["lex", "Acknowledgment within 24 hours", "Order acknowledgment (855)", [0], 96.5, 44, "3 minutes ago", "Active"],
    ["nora", "Invoice matches order price", "Invoice (810)", [0], 96.6, 38, "2 minutes ago", "Active"],
    ["nora", "Required fields by partner guide", "All outbound documents", [0, 8, 3], 99.4, 6, "5 minutes ago", "Over budget"],
    ["liz", "Cost change applied to open orders", "Price catalog (832)", [0], 94.1, 17, "8 minutes ago", "Active"],
    ["liz", "Ship notice before invoice", "Ship notice (856), Invoice (810)", [0], 99.3, 4, "7 minutes ago", "Active"],
    ["reese", "Remittance matches open invoices", "Remittance advice (820)", [0, 3], 97.9, 5, "19 minutes ago", "Paused"],
    ["ivy", "Order volume against projection", "Purchase order (850)", [0], 93.2, 11, "1 minute ago", "Active"],
    ["ivy", "Remittance advice on schedule", "Remittance advice (820)", [0], 98.7, 3, "11 minutes ago", "Active"],
    ["ivy", "Functional acknowledgments on time", "Functional acknowledgment (997)", [0, 3], 96.0, 8, "2 minutes ago", "Active"]
  ];
  function cxAgentFind(id) { return CXR.filter(function (r) { return r[0] === id; }).reduce(function (s, r) { return s + r[5]; }, 0); }
  function cxAgents() { return CXA.filter(function (a) { return ccOn(a.t); }); }
  function cxProcNames(ix) { return ix.length === 3 ? "All processes" : ix.map(ccShort).join(", "); }
  var CXP = [["Northfield Stores", "NFS-RT-0112", "Active", "BU-0451", "Mar 4, 2021", "Today, 08:42"], ["Harbor Grocers", "HBG-RT-0207", "Active", "BU-0367", "Jun 18, 2020", "Today, 05:52"],
    ["Westline Home", "WLH-RT-0331", "Active", "BU-0442", "Jan 9, 2022", "Today, 08:31"], ["Brightway Marketplace", "BWM-MP-0415", "Active", "BU-0249", "Sep 27, 2023", "Today, 09:24"],
    ["Cedar & Coast", "CDC-RT-0520", "Active", "BU-0425", "Feb 2, 2024", "Today, 08:12"], ["Eastbank Market", "EBM-RT-0618", "Active", "BU-0019", "Nov 15, 2019", "Today, 07:58"],
    ["Coastal Drug", "CDR-RT-1020", "Onboarding", "BU-0512", "Oct 20, 2026", "Yesterday, 16:20"], ["Summit Beauty Supply", "SBS-DS-0811", "Inactive", "BU-0082", "Jul 21, 2022", "Aug 3, 2026"],
    ["Ridgeway Freight", "RDF-CA-0905", "Active", "BU-0395", "May 6, 2021", "Today, 08:40"], ["Crestline Logistics", "CRL-3P-1010", "Active", "BU-0132", "Oct 11, 2020", "Today, 07:20"]];
  var CXPR = [["Nuvori Beauty", "NUV-SP-0112", "Active", "BU-1451", "Mar 4, 2021", "Today, 09:12"], ["Meadowline Care", "MDC-SP-0207", "Active", "BU-1367", "Jun 18, 2020", "Today, 09:18"],
    ["Copperleaf Living", "CPL-SP-0331", "Active", "BU-1442", "Jan 9, 2022", "Today, 09:22"], ["Tidewell Home", "TDH-DS-0415", "Active", "BU-1249", "Sep 27, 2023", "Today, 09:24"],
    ["Solara Personal Care", "SPC-SP-0520", "Active", "BU-1425", "Feb 2, 2024", "Today, 09:15"], ["Fieldstone Essentials", "FSE-SP-0618", "Active", "BU-1019", "Nov 15, 2019", "Today, 09:10"],
    ["Liora Wellness", "LRW-SP-0702", "Onboarding", "BU-1480", "Oct 20, 2026", "Yesterday, 16:20"], ["Brookfield Pet Supply", "BPS-SP-0811", "Inactive", "BU-1082", "Jul 21, 2022", "Aug 3, 2026"],
    ["Ridgeway Freight", "RDF-CA-0905", "Active", "BU-1395", "May 6, 2021", "Today, 08:40"], ["Bayview Carriers", "BVC-CA-1010", "Active", "BU-1132", "Oct 11, 2020", "Today, 09:26"]];
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
  var CCMOD = { IM: ["Integration Monitor", "im"], PM: ["Performance Monitor", "pm"], RT: ["Retail pack", "rt"] };
  function cxTag(m) { return m && CCMOD[m] ? '<span class="cx-mod ' + CCMOD[m][1] + '"><i></i>' + CCMOD[m][0] + '</span>' : '<span class="cx-mod all"><i></i>All modules</span>'; }
  function cxModKey(scr) { scr = scr || ccScr; return scr === "im-tp" ? "IM" : ""; }
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
  function cxProcName(i) { return ccProc(i).n; }

  /* Item providers: the core monitors register here, and industry add-ons append their own. One record shape for findings and actions. */
  /* Actions Command Center can run on Trading Grid after approval; everything else is a handoff to the approver */
  var CXRUN = { supplier: { f2: 1, f7: 1 }, retailer: { f2: 1, f7: 1, f10: 1 } };
  function cxRun(id) { return !!CXRUN[ccRole()][id]; }
  function cxDocOf(f) { var s = CCFLOW[ccRole()][f.p] && CCFLOW[ccRole()][f.p].steps[f.st], m = /\((\d{3})\)/.exec(CXDOC[f.id] || ""); var dir = s ? s[0] : ""; if (m && m[1] === "997" && dir) dir = dir === "Out" ? "In" : "Out"; return (m ? m[1] : "") + (dir ? " " + dir : ""); }
  var CXITEMS = [function () {
    return cxAll().map(function (f) {
      var d = ccDone[f.id], a = CXAF[f.id], run = cxRun(f.id);
      return { key: "f:" + f.id, mod: f.mod === "Integration Monitor" ? "IM" : "PM", title: f.ot, partner: f.partner, check: CXRULE[f.id], doc: cxDocOf(f), run: run, proc: f.p, sev: f.sev === "c" ? "h" : "m",
        agent: a.n + " · " + a.r, owner: CXAS[f.id] || "Unassigned", status: d ? (d === 2 ? "Known issue" : "Resolved") : CXST[f.id], done: !!d, at: cxAt(f), ord: cxOrd(f.at), val: f.val,
        open: 'data-cxf="' + f.id + '"', act: f.act, appr: f.appr, actDone: !!d, actState: d === 2 ? "Marked as known issue" : run ? "Approved. Runs on Trading Grid; closes when the documents are exchanged." : "Task created for " + (f.appr || "the owner") + ".",
        actBtn: '<button type="button" class="cx-btn p" data-cxapp="' + f.id + '">' + (run ? "Approve and run" : "Create task for " + cxe(f.appr || "owner")) + '</button>' };
    });
  }];
  function ccItems() { return [].concat.apply([], CXITEMS.map(function (p) { return p(); })).filter(function (i) { return ccOn(i.mod); }); }
  function cxMods() { return ["IM", "PM", "RT"].filter(ccOn); }
  function cxSort(list) { return list.slice().sort(function (a, b) { return (a.sev === "h" ? 0 : 1) - (b.sev === "h" ? 0 : 1) || (b.ord - a.ord); }); }
  function cxModF(list) { return ccModF === "all" ? list : list.filter(function (i) { return i.mod === ccModF; }); }
  function cxModSeg() {
    if (cxMods().length < 2) return "";
    return '<span class="cx-seg cx-mseg" role="group" aria-label="Filter by module">' + [["all", "All modules"]].concat(cxMods().map(function (m) { return [m, CCMOD[m][0]]; })).map(function (o) {
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

  var CXCAT = [["Order and acknowledgment", "850 PO · 855 PO acknowledgment", 90, [["PO acknowledgment rate", "855 PO acknowledgment", "96.5%", "≥ 98%", 88, 5, 0], ["PO acknowledgment cycle time", "850 PO to 855 PO acknowledgment", "5.5 hrs", "≤ 4 hrs", 73, 4, 1], ["Order accuracy", "850 PO and 855 PO acknowledgment", "98.2%", "≥ 99%", 92, 5, 0]]],
    ["Shipping", "856 Ship notice", 97, [["Ship notice timeliness", "856 before arrival", "97.1%", "≥ 98%", 86, 6, 0], ["Ship notice accuracy", "856 against 861 receipt", "98.8%", "≥ 99%", 89, 5, 0]]],
    ["Invoicing", "810 Invoice · 820 Remittance", 92, [["Invoice accuracy rate", "810 against 850 and 856", "96.6%", "≥ 98%", 92, 6, 1]]],
    ["Partner compliance and EDI health", "997 Functional acknowledgments", 82, [["First-pass acceptance", "997 and 824", "97.4%", "≥ 98%", 87, 5, 0], ["Transaction rejection rate", "824 rejections", "1.8%", "≤ 1%", 70, 4, 1]]]];
  var CXCATR = ["Retail KPIs", "OTIF · fill rate · deductions", 79, [["On-time in-full (OTIF)", "856, 214 and 861 where sent", "91.5%", "≥ 95%", 96, 8, 1], ["Acknowledged fill rate", "855 against 850", "95.5%", "≥ 98%", 97, 5, 0], ["Backorder rate", "855 PO acknowledgment", "3.5%", "≤ 2%", 57, 4, 1], ["Chargeback and deduction rate", "812 against 810", "2.1%", "≤ 1.5%", 64, 5, 1]]];
  function cxCats(retailOnly) { return retailOnly ? [CXCATR] : CXCAT; }
  function cxOff(m) { var v = parseFloat(m[2]), t = parseFloat(String(m[3]).replace(/[^\d.]/g, "")); return isNaN(v) || isNaN(t) ? !!m[6] : String(m[3]).indexOf("≥") >= 0 ? v < t : v > t; }
  function cxCatList(cats) {
    return cats.map(function (c, k) {
      return '<details class="cx-cat"' + (k === 0 ? " open" : "") + '><summary>' + ci("down") + '<b>' + c[0] + '</b><span>' + c[1] + '</span><em class="' + (c[2] < 88 ? "w" : "g") + '">avg score ' + c[2] + '</em></summary>' + c[3].map(function (m) {
        return '<div class="cx-mt"><div><b>' + m[0] + '</b><span><code>' + m[1] + '</code>' + (cxOff(m) ? '<em class="w">' + ci("warn") + 'Off target</em>' : '<em class="g">' + ci("ok") + 'On target</em>') + '</span></div><div class="cx-mb"><span>Target: ' + m[3] + '</span><span>Score: ' + m[4] + '</span><span>Weight: ' + m[5] + '%</span><span class="cx-pb ' + (m[6] ? "w" : "") + '"><i style="width:' + m[4] + '%"></i></span></div><strong class="' + (m[6] ? "w" : "g") + '">' + m[2] + '</strong></div>';
      }).join("") + '</details>';
    }).join("");
  }
  /* Partner scorecard, a prebuilt dashboard in Workspace (Performance Monitor) */
  function cxScorecard() {
    var h = '<nav class="cx-tabs"><button type="button" data-cxtab="sc" aria-pressed="' + (ccTab === "sc") + '">Scorecard</button><button type="button" data-cxtab="km" aria-pressed="' + (ccTab === "km") + '">Key metrics</button></nav>';
    if (ccTab === "sc") return h + '<section class="cx-hero"><div class="cx-ov"><span>Overall partner score</span><b>91.3</b><small>/100 · Grade B</small><em>' + ci("warn") + 'Performance requires watching</em></div>' +
      [["Ship notice timeliness", "856", "97.1%", "score 96", "Target ≥ 98%", "0.9 pts"], ["Invoice accuracy rate", "810", "96.6%", "score 92", "Target ≥ 98%", "1.4 pts"], ["PO acknowledgment rate", "855", "96.5%", "score 98", "Target ≥ 98%", "1.5 pts"]].map(function (k) {
        return '<div class="cx-kc"><header><b>' + k[0] + '</b><code>' + k[1] + '</code></header><strong>' + k[2] + '<small>' + k[3] + '</small></strong><span class="cx-pb"><i style="width:92%"></i><u style="left:96%"></u></span><div class="cx-ft"><span>' + k[4] + '</span><em>' + ci("warn") + '↓ ' + k[5] + '</em></div></div>';
      }).join("") + '</section><h4 class="cx-sh">Performance by category</h4>' + cxCatList(CXCAT);
    var cs = CXCAT, col = ["#0066FF", "#001889", "#5B8DEF", "#9DB7F2"];
    return h + '<div class="cx-g2">' + cxCard("Where to focus", '<p class="cx-sub">Lowest-scoring KPIs pulling the rating down</p>' + cxBars([["Transaction rejection rate", 70, "", "y"], ["PO acknowledgment cycle time", 73, "", "y"], ["Invoice accuracy rate", 92, "", "y"], ["First-pass acceptance", 94, "", "g"], ["Ship notice timeliness", 96, "", "g"]], {})) +
      cxCard("Category health", '<p class="cx-sub">Average score by KPI group</p><div class="cx-dw">' + cxDonut(cs.map(function (c, i) { return [c[0], c[2], col[i]]; }), 80, "90", "avg score") + '<ul class="cx-lg">' + cs.map(function (c, i) { return '<li><i style="background:' + col[i] + '"></i>' + c[0] + '<b>' + c[2] + '</b></li>'; }).join("") + '</ul></div>') + '</div>' +
      '<div class="cx-g2">' + cxCard("Weighted partner score trend", cxLine([{ v: [86.2, 87.1, 87.0, 88.4, 89.9, 91.3], area: true }], { w: 600, h: 220, min: 80, max: 100, xl: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Score trend" })) +
      cxCard("Score contribution by KPI", '<p class="cx-sub">Weighted points contributed to the 91.3 overall score</p>' + cxBars([["Ship notice timeliness", 5.8, "", "g"], ["Invoice accuracy rate", 5.5, "", "y"], ["PO acknowledgment rate", 4.9, "", "g"], ["Ship notice accuracy", 4.9, "", "g"], ["First-pass acceptance", 4.7, "", "g"]], { max: 8, fmt: function (v) { return v.toFixed(1); } })) + '</div>';
  }
  var CXPTAB = [];
  CXS["im-tp"] = function () {
    var tabs = CXPTAB.filter(function (t) { return ccOn(t.t); }), cur = tabs.filter(function (t) { return t.k === ccPtTab; })[0];
    var h = cxHead("Partners", tabs.length ? '<nav class="cx-tabs cx-tabs-h"><button type="button" data-cxpt="all" aria-pressed="' + !cur + '">All partners</button>' + tabs.map(function (t) { return '<button type="button" data-cxpt="' + t.k + '" aria-pressed="' + (cur === t) + '">' + t.n + '</button>'; }).join("") + '</nav>' : "");
    if (cur) return h + cur.h();
    return h + '<div class="cx-k4">' + cxKpi("Total partners", "208", "21 added this year") + cxKpi("Active partners", "163", "Sent or received in 30 days") + cxKpi("Inactive partners", "45", "No activity in 30 days") + cxKpi("Added this month", "3", "4 last month") + '</div>' +
      cxCard("Partners", '<table class="cx-tbl"><thead><tr><th>Partner name</th><th>Partner alias</th><th>Status</th><th>BUID</th><th>Onboarding date</th><th>Last activity</th></tr></thead><tbody>' +
        cxPartners().map(function (p) { return '<tr><td><button type="button" class="cx-lk" data-impt="' + cxe(p[0]) + '"><b>' + p[0] + '</b></button></td><td><code>' + p[1] + '</code></td><td><span class="cx-st s-' + (p[2] === "Active" ? "resolved" : "known") + '"><i></i>' + p[2] + '</span></td><td>' + p[3] + '</td><td>' + p[4] + '</td><td>' + p[5] + '</td></tr>'; }).join("") + '</tbody></table>', "", '<span class="cx-note">Showing 10 of 208</span>') +
      cxCard("Partners over 12 months", cxLine([{ v: [172, 176, 179, 183, 186, 190, 193, 196, 199, 203, 205, 208] }, { v: [3, 4, 3, 4, 3, 4, 3, 3, 3, 4, 2, 3], c: "b2" }], { w: 1060, h: 230, max: 240, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Partners over 12 months" }) + '<ul class="cx-lg row"><li><i style="background:var(--pa)"></i>Total partners</li><li><i style="background:#001889"></i>Onboarded</li></ul>');
  };
  var CXPJ = [["Harbor Grocers orders", "Order volume drop", 5, "Inbound", "Purchase order (850)", "X12", "Harbor Grocers", "f2"], ["Brightway Marketplace acknowledgments", "Volume drop", 3, "Inbound", "Functional acknowledgment (997)", "X12", "Brightway Marketplace", "f10"],
    ["Harbor Grocers remittances", "Document missing", 1, "Inbound", "Remittance advice (820)", "X12", "Harbor Grocers", "f7"], ["Northfield Stores invoices", "Within projection", 0, "Outbound", "Invoice (810)", "X12", "Northfield Stores", null],
    ["Westline Home orders", "Within projection", 0, "Inbound", "Purchase order (850)", "X12", "Westline Home", null],
    ["Failed transactions, all partners", "Failed transactions above threshold", 2, "Both", "All document types", "X12", "All partners", null, 1]];
  var CXPJR = [["Meadowline Care orders", "Order volume drop", 5, "Outbound", "Purchase order (850)", "X12", "Meadowline Care", "f2"], ["Tidewell Home acknowledgments", "Volume drop", 3, "Outbound", "Functional acknowledgment (997)", "X12", "Tidewell Home", "f10"],
    ["Meadowline Care remittances", "Document missing", 1, "Outbound", "Remittance advice (820)", "X12", "Meadowline Care", "f7"], ["Nuvori Beauty invoices", "Within projection", 0, "Inbound", "Invoice (810)", "X12", "Nuvori Beauty", null],
    ["Copperleaf Living orders", "Within projection", 0, "Outbound", "Purchase order (850)", "X12", "Copperleaf Living", null],
    ["Failed transactions, all partners", "Failed transactions above threshold", 2, "Both", "All document types", "X12", "All partners", null, 1]];
  function cxProj() { return ccRole() === "retailer" ? CXPJR : CXPJ; }
  CXS["im-proj"] = function () {
    var PJ = cxProj(), p = PJ[ccPj] || PJ[0], fl = !!p[8], dn = p[2] > 0 && !fl, act = fl ? [9, 11, 10, 12, 27, null, null, null, null, null] : dn ? [109, 114, 111, 116, 41, null, null, null, null, null] : [70, 72, 75, 74, 73, null, null, null, null, null],
      prj = fl ? [null, null, null, null, 11, 10, 10, 11, 10, 9] : dn ? [null, null, null, null, 115, 112, 110, 113, 111, 109] : [null, null, null, null, 74, 73, 75, 74, 72, 74];
    var rr = ccRole() === "retailer";
    var ex = imExplain ? cxCard("Aviator findings", '<ul class="im-ex">' + [PJ[0][0] + (rr ? ": deliveries fell 64% below the projected range at 06:30. AS2 deliveries fail since the partner moved its endpoint, so purchase orders are held on Trading Grid."
        : ": volume fell 64% below the projected range at 06:30 and has not recovered. The partner's AS2 messages fail signature checks, so orders are not arriving."),
      PJ[1][0] + (rr ? ": Northfield Stores stopped sending 997s for Tidewell Home invoices at 05:00; the inbound invoice queue on Trading Grid is paused." : ": acknowledgments dropped while the partner's other documents flow normally. The gap began at 05:00."), "Failed transactions: 27 in the last hour against a threshold of 18, and 74 since 05:52. Most come from one partner's AS2 connection and clear when it is restored."].map(function (t) { return '<li>' + ci("spark") + '<span>' + cxe(t) + '</span></li>'; }).join("") + '</ul><p class="cx-note">Written from your watchlists, projections and anomalies. AI can make mistakes. Check important information.</p>', "im-exc") : "";
    return cxOvHead() + '<div class="im-pjb"><button type="button" class="cx-btn p" data-imexplain aria-pressed="' + imExplain + '">' + ci("spark") + (imExplain ? "Hide Aviator findings" : "Explain with Aviator") + '</button></div>' + ex + '<div class="cx-pj"><nav class="cx-pjl"><header><b>Projections</b><span>Anomalies</span></header>' + PJ.map(function (x, i) {
      return '<button type="button" data-cxpj="' + i + '" aria-pressed="' + (i === ccPj) + '"><b>' + x[0] + '</b><small>' + x[1] + ' · Executed today, 08:00</small>' + (x[2] ? '<em>' + x[2] + ci("warn") + '</em>' : '') + '</button>';
    }).join("") + '</nav><section class="cx-pjd"><header><h3>' + p[0] + '</h3>' + (p[7] ? '<button type="button" class="cx-btn" data-cxf="' + p[7] + '">Open finding</button>' : '') + '</header>' +
      '<div class="cx-chips">' + [["D", "Direction", p[3]], ["D", "Document type", p[4]], ["S", "Document standard", p[5]], ["P", "Partner", p[6]]].map(function (c) { return '<div><i>' + c[0] + '</i><span>' + c[1] + '<b>' + c[2] + '</b></span></div>'; }).join("") + '</div>' +
      cxLine([{ v: act, c: "act" }, { v: prj, c: "prj" }], { w: 840, h: 210, max: fl ? 30 : 140, xl: ["Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29"], now: 4, band: prj.map(function (v) { return v == null ? null : fl ? [0, 18] : [v - 16, v + 16]; }), label: "Projection and actual" }) +
      '<p class="cx-note">Each day covers 05:00 to 09:30, the window of today\'s snapshot.</p><ul class="cx-lg row"><li><i class="bd"></i>' + (fl ? "Error threshold" : "Projected range") + '</li><li><i style="background:#5B8DEF"></i>Projection</li><li><i style="background:#E8590C"></i>Actual</li></ul><h4 class="cx-sh">Heat map: hourly activity projection</h4>' + cxHeat() + '</section></div>';
  };
  /* Solution: the business documents behind the client's processes (process indices) */
  /* [business document, EDI documents, supplier ERP document, retailer ERP document, supplier processes, retailer processes] */
  var CXSOLR = [["Purchase order", "850", "Sales order", "Purchase order", [0], [1]], ["Order change", "860, 865", "Sales order change", "Purchase order change", [0], [1]],
    ["Order acknowledgment", "855", "Order confirmation", "Vendor confirmation", [0], [1]], ["Price catalog", "832", "Condition record", "Purchasing info record", [0], [1]],
    ["Routing request and instructions", "753, 754", "Shipment", "Inbound shipment", [8], [2]], ["Load tender and carrier status", "204, 990, 214", "", "Freight order", [], [2]],
    ["Warehouse shipping order and advice", "940, 945", "Outbound delivery", "", [8], []], ["Warehouse receipt and inventory", "944, 846, 947", "Goods movement", "", [8], []],
    ["Ship notice", "856", "Outbound delivery", "Inbound delivery", [0], [1]], ["Receiving advice", "861", "", "Goods receipt", [], [1]],
    ["Application advice", "824", "Rejection message", "Rejection message", [0], [1]], ["Invoice", "810", "Billing document", "Supplier invoice", [0], [1]],
    ["Freight invoice", "210", "", "Freight settlement", [], [2]], ["Functional acknowledgment", "997", "Transmission status", "Transmission status", [0, 8, 3], [1, 2, 3]],
    ["Remittance advice", "820", "Incoming payment", "Payment run", [0, 3], [1, 3]], ["Debit memo", "812", "Dispute case", "Vendor debit memo", [3], [3]]];
  var CXSOL = [];
  function cxSol() { var r = ccRole() === "retailer"; return CXSOLR.map(function (x) { return [x[0], x[1], r ? x[3] : x[2], r ? x[5] : x[4]]; }).filter(function (x) { return x[3].length; }); }
  /* Rule scopes are stored for the supplier solution and mapped to the matching retailer process */
  var CCPMAP = { 0: 1, 8: 2, 3: 3 };
  function cxRuleP(r) { return ccRole() === "retailer" ? r[3].map(function (i) { return CCPMAP[i]; }) : r[3]; }

  /* Configuration: Integration Monitor monitoring settings for every client; Rules & Policies with Performance Monitor */
  var CXCFG = [];
  function cxRuleTable(rows, agents) {
    return '<table class="cx-tbl"><thead><tr><th>Rule</th><th>Transaction</th><th>Process</th><th class="n">Conformance</th><th class="n">Findings (30d)</th><th>Last executed</th><th>Status</th></tr></thead><tbody>' + agents.map(function (a) {
      return '<tr class="gh"><td colspan="7">' + a.n + ' · ' + a.r + '</td></tr>' + rows.filter(function (r) { return r[0] === a.id; }).map(function (r) {
        return '<tr><td><b class="cx-lkt">' + cxe(r[1]) + '</b></td><td>' + cxe(r[2]) + '</td><td>' + cxe(cxProcNames(cxRuleP(r))) + '</td><td class="n">' + r[4].toFixed(1) + '%</td><td class="n">' + r[5] + '</td><td>' + r[6] + '</td><td><span class="cx-st s-' + (r[7] === "Active" ? "resolved" : r[7] === "Paused" ? "acknowledged" : "new") + '"><i></i>' + r[7] + '</span></td></tr>';
      }).join("");
    }).join("") + '</tbody></table>';
  }
  CXS["cfg"] = function () {
    var pm = ccOn("pm"), tab = ccCfgTab === "xr" || ccCfgTab === "mon" ? ccCfgTab : pm ? "rp" : "mon";
    var h = cxHead("Configuration") + '<nav class="cx-tabs">' + (pm ? '<button type="button" data-cxcfg="rp" aria-pressed="' + (tab === "rp") + '">Rules &amp; Policies</button>' : "") + '<button type="button" data-cxcfg="mon" aria-pressed="' + (tab === "mon") + '">Monitoring</button><button type="button" data-cxcfg="xr" aria-pressed="' + (tab === "xr") + '">Cross-references</button></nav>';
    if (tab === "xr") return h + cxXref();
    if (tab === "mon") {
      var ivy = CXA.filter(function (a) { return a.t === "im"; });
      return h + cxCard("Monitoring checks", '<p class="cx-sub">Volume, missing-document and acknowledgment checks run by Ivy for every partner.</p>' + cxRuleTable(CXR, ivy), "", cxTag("IM")) +
        cxCard("Partner activity", '<p class="cx-sub">Days without activity before a partner is marked inactive.</p><label class="cx-fl">Threshold (days)<input type="number" value="30" min="1"></label><button type="button" class="cx-btn p">Save</button>', "", cxTag("IM"));
    }
    var ag = CXA.filter(function (a) { return a.t === "pm"; }), rows = CXR.filter(function (r) { return ag.some(function (a) { return a.id === r[0]; }); });
    return h + '<section class="cx-card cx-rh"><div><span>Total rules</span><b>' + rows.length + '</b><small><i class="g"></i>' + rows.filter(function (r) { return r[7] === "Active"; }).length + ' active <i class="r"></i>' + rows.filter(function (r) { return r[7] === "Over budget"; }).length + ' over budget <i class="y"></i>' + rows.filter(function (r) { return r[7] === "Paused"; }).length + ' paused</small></div>' +
      cxKpi("Total findings", rows.reduce(function (s, r) { return s + r[5]; }, 0)) + cxKpi("Total inspections", "159.9K") + cxKpi("Average conformance", "95.8%") + cxKpi("Total deviation", "6,653") + '</section>' +
      cxCard("Rules", cxRuleTable(rows, ag), "", '<span class="cx-note">Grouped by agent</span>' + cxTag("PM") + '<button type="button" class="cx-btn p" data-rwnew>' + ci("plus") + 'Create rule</button>') + CXCFG.map(function (f) { return f(); }).join("");
  };

  /* Components for Workspace dashboards. The Overview uses a few of them. */
  var CXDASH = [];
  function cxDc(c, w) { return '<section class="cx-card cx-dc w' + (w || c.w) + '" data-mod="' + (c.mod || "all") + '"><header><h3>' + c.t + '</h3>' + cxTag(c.mod) + '</header><div class="cx-dcb">' + c.h() + '</div>' + (c.f ? '<footer class="cx-dcf">' + c.f() + '</footer>' : "") + '</section>'; }
  function cxComps() { return CXDASH.slice().sort(function (a, b) { return a.o - b.o; }).filter(function (c) { return !c.mod || ccOn(c.mod); }); }
  function cxHero() {
    var X = 548, Y = 270, R = 128, items = ccItems(), open = items.filter(function (i) { return !i.done; }), hi = cxSort(open);
    var tot = 0, ok = 0, rk = 0, br = 0; ccSol().forEach(function (i) { var F = ccFlow(i); tot += F.n; ok += F.ok; rk += F.risk; br += F.br; });
    var svg = '<svg class="cx-ring" viewBox="0 0 820 560" role="img" aria-label="' + tot.toLocaleString("en-US") + ' documents today, ' + open.length + ' findings need action"><defs>' +
      '<filter id="cxbl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="cxsf" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="28"/></filter>' +
      '<radialGradient id="cxdisc" cx="50%" cy="40%" r="62%"><stop offset="0" style="stop-color:var(--g-disc2)"/><stop offset="1" style="stop-color:var(--g-disc)"/></radialGradient>' +
      '<linearGradient id="cxrr" x1="0" x2="1"><stop offset="0" style="stop-color:var(--g-red);stop-opacity:0"/><stop offset=".45" style="stop-color:var(--g-red);stop-opacity:.85"/><stop offset="1" style="stop-color:var(--g-red)"/></linearGradient>' +
      '<linearGradient id="cxrb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--g-blue);stop-opacity:0"/><stop offset=".45" style="stop-color:var(--g-blue);stop-opacity:.85"/><stop offset="1" style="stop-color:var(--g-blue)"/></linearGradient></defs>' +
      '<circle cx="' + X + '" cy="' + Y + '" r="190" class="g-halo" filter="url(#cxsf)"/>' +
      '<text x="0" y="20" class="g-eb">BUSINESS PROCESSES</text><text x="276" y="20" class="g-fn" text-anchor="end">Documents today</text>';
    ccSol().forEach(function (i, k) {
      var F = ccFlow(i), P = ccProc(i), y = 92 + k * 150, n = open.filter(function (x) { return x.proc === i; }), sev = n.some(function (x) { return x.sev === "h"; }) ? "red" : n.length ? "amb" : "blue";
      var ang = (200 - k * 22) * Math.PI / 180, tx = X + (R + 22) * Math.cos(ang), ty = Y + (R + 22) * Math.sin(ang), d = "M304 " + y + " C400 " + y + " " + (tx - 90).toFixed(1) + " " + ty.toFixed(1) + " " + tx.toFixed(1) + " " + ty.toFixed(1);
      var w = 80, okw = w * F.ok / F.n, rw = w * F.risk / F.n, bw = w * F.br / F.n, docs = [].concat.apply([], ccSteps(i).map(function (p) { return p[1][1].split(" / ")[0].split(/,\s*/); })).filter(function (v, j, a) { return /^\d/.test(v) && a.indexOf(v) === j; }).join(", ");
      svg += '<path d="' + d + '" class="g-st ' + sev + '"/>' + [0, 1, 2].map(function (q) { return '<circle r="2.4" class="g-pt ' + sev + '"><animateMotion dur="3.6s" begin="-' + (q * 1.2) + 's" repeatCount="indefinite" path="' + d + '"/></circle>'; }).join("") +
        '<text x="0" y="' + (y - 6) + '" class="g-pn">' + cxe(ccShort(i)) + '</text><text x="0" y="' + (y + 12) + '" class="g-fn">' + cxe(docs) + '</text>' +
        '<text x="276" y="' + (y - 6) + '" class="g-pc" text-anchor="end">' + F.n.toLocaleString("en-US") + '</text>' +
        '<rect x="196" y="' + (y + 22) + '" width="' + w + '" height="4" rx="2" class="g-tr"/><rect x="196" y="' + (y + 22) + '" width="' + okw.toFixed(1) + '" height="4" rx="2" class="g-f blue"/>' +
        '<rect x="' + (196 + okw).toFixed(1) + '" y="' + (y + 22) + '" width="' + rw.toFixed(1) + '" height="4" class="g-f amb"/><rect x="' + (196 + okw + rw).toFixed(1) + '" y="' + (y + 22) + '" width="' + bw.toFixed(1) + '" height="4" class="g-f red"/>' +
        '<circle cx="300" cy="' + y + '" r="9" class="g-f ' + sev + '" opacity=".18"/><circle cx="300" cy="' + y + '" r="4.5" class="g-nd ' + sev + '"/>' +
        (n.length ? '<text x="0" y="' + (y + 44) + '" class="g-fs ' + sev + '">' + n.length + ' open finding' + (n.length > 1 ? "s" : "") + '</text>' : "") +
        '<text x="0" y="' + (y + 60) + '" class="g-fn">' + F.ack + ' 997 overdue · ' + F.rej + ' 824 rejects</text>';
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
    svg += '<text x="' + X + '" y="' + (Y - 46) + '" class="g-eb" text-anchor="middle">DOCUMENTS TODAY</text><text x="' + X + '" y="' + (Y + 10) + '" class="g-big" text-anchor="middle">' + tot.toLocaleString("en-US") + '</text>' +
      '<text x="' + X + '" y="' + (Y + 33) + '" class="g-ok" text-anchor="middle">' + (100 * ok / tot).toFixed(1) + '% on track</text><line x1="' + (X - 66) + '" y1="' + (Y + 48) + '" x2="' + (X + 66) + '" y2="' + (Y + 48) + '" class="g-l2"/>' +
      '<text x="' + (X - 44) + '" y="' + (Y + 70) + '" class="g-sm" text-anchor="middle">212</text><text x="' + (X - 44) + '" y="' + (Y + 85) + '" class="g-fn" text-anchor="middle">Closed today</text>' +
      '<text x="' + (X + 44) + '" y="' + (Y + 70) + '" class="g-sm" text-anchor="middle">' + open.length + '</text><text x="' + (X + 44) + '" y="' + (Y + 85) + '" class="g-fn" text-anchor="middle">Need action</text>';
    function rib(y0, y1, cls, grad, lbl) {
      var d = "M" + (X + R - 4) + " " + y0 + " C" + (X + R + 70) + " " + y0 + " 720 " + y1 + " 816 " + y1;
      return '<path d="' + d + '" class="g-rg ' + cls + '" filter="url(#cxsf)"/><path d="' + d + '" stroke="' + grad + '" class="g-rb"/>' + [0, 1, 2, 3].map(function (q) { return '<circle r="2.2" class="g-rp"><animateMotion dur="2.8s" begin="-' + (q * 0.7) + 's" repeatCount="indefinite" path="' + d + '"/></circle>'; }).join("") +
        '<text x="816" y="' + (y1 + (y1 < Y ? -22 : 34)) + '" class="g-cn" text-anchor="end">' + lbl + '</text>';
    }
    svg += rib(Y - 30, 210, "red", "url(#cxrr)", open.length + " need action") + rib(Y + 36, 452, "blue", "url(#cxrb)", "24 resolved today");
    svg += '<text x="0" y="552" class="g-fn">Ring: documents today by state · Strands: live document flow per process</text></svg>';
    var done = Object.keys(ccDone).filter(function (k) { return ccDone[k] === 1; }).length;
    function spark(v) { var mx = Math.max.apply(null, v), l = v.map(function (y, i) { return (i ? "L" : "M") + (i * 64 / (v.length - 1)).toFixed(1) + " " + (26 - y / (mx || 1) * 24).toFixed(1); }).join(" "); return '<svg viewBox="0 0 64 26" width="64" height="26" aria-hidden="true"><path d="' + l + 'L64 26L0 26Z" class="g-sa"/><path d="' + l + '" class="g-sl"/></svg>'; }
    var side = '<div class="cx-hs"><h3 class="cx-hh"><span class="cx-hi r">' + ci("warn") + '</span>Failure points now<small>' + open.length + ' open</small></h3>' + hi.slice(0, 3).map(function (i) {
      return '<button type="button" class="cx-gc' + (i === hi[0] && i.sev === "h" ? " crit" : "") + '" ' + i.open + '><span class="cx-gct">' + cxTag(i.mod) + cxSevChip(i.sev) + '</span><b>' + cxe(i.title) + '</b><small>' + cxe(i.partner) + '</small><span class="cx-gca">' + ci("spark") + '<span><b>' + cxe(i.agent.split(" · ")[0]) + '</b> ' + cxe(i.act) + '</span></span></button>'; }).join("") +
      '<h3 class="cx-hh"><span class="cx-hi b">' + ci("ok") + '</span>Resolved today<small>' + (24 + done) + '</small></h3>' +
      [["14", "Cleared after partner resend", [1, 3, 4, 6, 8, 11, 13, 14]], [String(7 + done), "Actions approved", [0, 1, 1, 2, 4, 5, 6, 7 + done]], ["3", "Awaiting partner confirmation", [0, 0, 1, 1, 2, 3, 3, 3]]].map(function (d) {
        return '<div class="cx-gc cx-gr"><div><b class="cx-gv">' + d[0] + '</b><small>' + d[1] + '</small></div>' + spark(d[2]) + '</div>'; }).join("") + '</div>';
    if (!ccOn("pm")) return '<section class="cx-hero2 cx-hero-im" aria-label="Network health">' + side + '</section>';
    return '<section class="cx-hero2" aria-label="Process health"><div class="cx-hv">' + svg + '</div>' + side + '</section>';
  }
  /* Overview: the process ring with Performance Monitor; failure points and network activity for every client */
  function cxOvHead() {
    var procs = ccOn("pm") ? " · " + ccSol().map(ccShort).join("; ") : "", cd = wsCurDash();
    var tabs = [["dash", "Summary"], ["im-proj", "Projections and anomalies"], ["im-vol", "Network health"]].map(function (t) { return '<button type="button" data-cxgo="' + t[0] + '" aria-pressed="' + (ccScr === t[0]) + '">' + t[1] + '</button>'; }).join("") +
      wsDashTabs().map(function (t) { return '<button type="button" data-cxgo="ws-dash" data-wsdash="' + t.key + '" aria-pressed="' + (ccScr === "ws-dash" && cd === t) + '">' + cxe(t.n) + '</button>'; }).join("");
    return '<header class="cx-ph cx-dh cx-gh"><div><p class="cx-gk">Command Center · Overview</p><h2>' + cxe(ccCompany()) + '</h2><p>' + ccIndustry() + procs + ' · Illustrative data</p></div><span class="cx-live"><i></i>Live · updated ' + CCSNAP.split(", ")[1] + '</span></header>' +
      '<nav class="cx-tabs cx-ovt" aria-label="Overview">' + tabs + '<button type="button" class="cx-ovn" data-cxgo="ws-dash" data-wsform="dash">' + ci("plus") + 'Create dashboard</button></nav>';
  }
  CXS["dash"] = function () {
    var by = function (o) { return CXDASH.filter(function (c) { return c.o === o; })[0]; }, rt = ccOn("rt") && by(35);
    return cxOvHead() + cxHero() +
      '<div class="cx-dg cx-ovg">' + cxDc(by(5)) + cxDc(by(10), rt ? 2 : 3) + (rt ? cxDc(rt, 2) : "") + cxDc(by(80), rt ? 2 : 3) + '</div>';
  };
  CXDASH.push(
    { o: 10, mod: "IM", w: 2, t: "Network activity", h: function () {
      return '<div class="cx-k2">' + cxKpi("Documents this week", "27,400", '<em class="up">↑ 11% vs last week</em>') + cxKpi("Volume anomalies", "3", '<em class="dn">↑ 2 vs yesterday</em>') +
        cxKpi("Failed transactions", "111", "Last 24 hours") + cxKpi("Active partners", "163", "Of 208 connected") + '</div>'; }, f: function () { return cxGoBtn("Projections and anomalies", "im-proj"); } },
    { o: 20, mod: "PM", w: 2, t: "Process performance", h: function () {
      var op = cxOpen().filter(function (f) { return f.mod === "Performance Monitor"; }), hi = op.filter(function (f) { return f.sev === "c"; }).length, val = op.reduce(function (a, f) { return a + f.val; }, 0);
      return '<div class="cx-k2">' + cxKpi("Open findings", op.length, hi + " high severity") + cxKpi("Value at risk", "$" + Math.round(val / 1000) + "K", "Across open findings") +
        cxKpi("Average conformance", "95.8%", "Last 30 days") + cxKpi("Active rules", CXR.filter(function (r) { return r[7] === "Active" && r[0] !== "ivy"; }).length, "Across " + CXA.filter(function (a) { return a.t === "pm" && CXR.some(function (r) { return r[0] === a.id && r[7] === "Active"; }); }).length + " agents") + '</div>'; }, f: function () { return cxGoBtn("Business processes", "ws-proc"); } },
    { o: 40, mod: "", w: 4, t: "Priority findings", h: function () {
      var op = cxSort(ccItems().filter(function (i) { return !i.done; })).slice(0, 6);
      return '<table class="cx-tbl cx-pf"><thead><tr><th>Finding</th><th>Module</th><th>Severity</th><th>Detected</th></tr></thead><tbody>' + op.map(function (i) {
        return '<tr><td>' + cxItemLink(i, "b") + '<small>' + cxe(i.partner) + '</small></td><td>' + cxTag(i.mod) + '</td><td>' + cxSevChip(i.sev) + '</td><td>' + cxe(i.at) + '</td></tr>'; }).join("") +
        (op.length ? "" : '<tr><td colspan="4" class="cx-empty">No open findings.</td></tr>') + '</tbody></table>'; },
      f: function () { return cxGoBtn("View findings", "find"); } },
    { o: 60, mod: "PM", w: 3, t: "Process health", h: function () {
      var op = cxOpen();
      return '<p class="cx-sub">Open findings by business process</p><ul class="cx-ph2">' + ccSol().map(function (i) { return [ccShort(i), [i]]; }).map(function (g) {
        return '<li>' + g[1].map(function (i) { var n = op.filter(function (f) { return f.p === i; }), sev = n.some(function (f) { return f.sev === "c"; }) ? "c" : n.length ? "w" : "ok";
          return '<button type="button" class="cx-pc ' + sev + '" data-cxproc="' + i + '"><i></i>' + cxe(ccShort(i)) + (n.length ? '<em>' + n.length + '</em>' : '') + '</button>'; }).join("") + '</li>'; }).join("") + '</ul>'; },
      f: function () { return cxGoBtn("View processes", "ws-proc"); } },
    { o: 70, mod: "IM", w: 3, t: "Document transaction summary", h: function () {
      return '<div class="cx-g2 in">' + [["Yesterday", "Friday, October 23, 2026", "4,612"], ["Last month", "September 1 to 30, 2026", "138,200"]].map(function (p) {
        return '<div><b class="cx-pl">' + p[0] + '</b><small class="cx-pd">' + p[1] + '</small>' + cxDonut([["850", 22, "#0066FF"], ["997", 30, "#001889"], ["856", 20, "#5B8DEF"], ["810", 18, "#9DB7F2"], ["Other", 10, "#C9D0DA"]], 54, p[2], "Total") + '</div>'; }).join("") +
        '</div><ul class="cx-lg row"><li><i style="background:#0066FF"></i>850 Purchase order</li><li><i style="background:#001889"></i>997 Functional acknowledgment</li><li><i style="background:#5B8DEF"></i>856 Ship notice</li><li><i style="background:#9DB7F2"></i>810 Invoice</li><li><i style="background:#C9D0DA"></i>Other</li></ul>'; } },
    { o: 80, mod: "IM", w: 4, t: "Transaction volume", h: function () {
      return cxLine([{ v: [3820, 3960, 4100, 4120, 4010, 3890, 4240, 4380, 4510, 4460, 4620, 4590], area: true }], { w: 760, h: 220, min: 3000, max: 5000, xl: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Transaction volume, last 12 months" }); },
      f: function () { return '<span class="cx-note">Documents per day, last 12 months</span>' + cxGoBtn("Network health", "im-vol"); } },
    { o: 100, mod: "PM", w: 3, t: "Findings by agent", h: function () {
      return cxBars(cxAgents().map(function (a, k) { return [a.n + " · " + a.r, cxAgentFind(a.id), "", "b"]; }), { max: 100 }); },
      f: function () { return '<span class="cx-note">Last 30 days</span>' + cxGoBtn("Agents", "ws-agents"); } }
  );

  /* Findings: every enabled module in one list */
  function cxAnalysis(op) {
    var hi = cxSort(op.filter(function (i) { return i.sev === "h"; }));
    if (!hi.length) return op.length + " open findings, none high severity.";
    return hi.length + " high-severity findings are open. Start with " + hi.slice(0, 2).map(function (i) { return i.title.charAt(0).toLowerCase() + i.title.slice(1) + " (" + i.partner + ")"; }).join(" and ") + ".";
  }
  CXS["find"] = function () {
    var all = cxModF(ccItems()), op = all.filter(function (i) { return !i.done; }), hi = op.filter(function (i) { return i.sev === "h"; }).length, pm = ccOn("pm");
    var list = cxSort(all.filter(function (i) { return (ccStF === "all" || !i.done) && (ccSevF === "all" || i.sev === ccSevF); }));
    var by = function (m) { return op.filter(function (i) { return i.mod === m; }).length; };
    var sel = function (name, opts, cur, label) { return '<label class="cx-sel"><span class="sr-only">' + label + '</span><select data-' + name + ' aria-label="' + label + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (cur === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") + '</select></label>'; };
    var mods = cxMods().filter(function (m) { return ccModF === "all" || ccModF === m; }), cols = pm ? 7 : 6;
    var groups = mods.map(function (m) { return [m, list.filter(function (i) { return i.mod === m; })]; }).filter(function (g) { return g[1].length; });
    return cxHead("Findings", cxModSeg()) +
      '<div class="cx-fsum">' + cxKpi("Open findings", op.length, hi + " high severity") + (mods.length > 1 ? mods.map(function (m) {
        return '<div class="cx-kpi cx-km"><span>' + cxTag(m) + '</span><b>' + by(m) + '</b><small>Open</small></div>'; }).join("") : "") +
      '<div class="cx-kpi cx-ka2"><span>' + ci("spark") + 'Key analysis</span><small>' + cxe(cxAnalysis(op)) + '</small></div></div>' +
      cxCard("All findings", '<table class="cx-tbl cx-ftb"><thead><tr><th>Finding</th><th>Document</th>' + (pm ? '<th>Process</th>' : '') + '<th>Owner</th><th>Status</th><th>Detected</th><th>Severity</th></tr></thead><tbody>' + groups.map(function (g) {
        return (mods.length > 1 ? '<tr class="gh"><td colspan="' + cols + '">' + cxTag(g[0]) + '<span>' + g[1].length + ' shown</span></td></tr>' : "") + g[1].map(function (i) {
          return '<tr><td>' + cxItemLink(i, "b") + '<small>' + cxe(i.partner) + ' · ' + cxe(i.agent) + (i.check ? ' · ' + cxe(i.check) : '') + '</small></td><td>' + cxe(i.doc || "") + '</td>' + (pm ? '<td>' + cxe(ccShort(i.proc)) + '</td>' : '') + '<td>' + cxe(i.owner) + '</td><td>' + cxStPill(i.status) + '</td><td>' + cxe(i.at) + '</td><td>' + cxSevChip(i.sev) + '</td></tr>'; }).join("");
      }).join("") + (list.length ? "" : '<tr><td colspan="' + cols + '" class="cx-empty">No findings match these filters.</td></tr>') + '</tbody></table>', "",
        sel("cxsev", [["all", "All severities"], ["h", "High"], ["m", "Medium"]], ccSevF, "Severity") + sel("cxstf", [["open", "Open"], ["all", "Open and closed"]], ccStF, "Status"));
  };

  /* Action queue: recommendations waiting for a decision */
  var CXACTX = [];
  CXS["act"] = function () {
    var it = cxModF(ccItems()), wait = cxSort(it.filter(function (i) { return !i.actDone; })), done = it.filter(function (i) { return i.actDone; }), list = ccActTab === "open" ? wait : done;
    return cxHead("Action queue", CXACTX.map(function (f) { return f(); }).join("") + cxModSeg()) + '<p class="cx-lead">Recommended actions from agents' + (ccOn("rt") ? " and retail workflows" : "") + '. An action runs only after a person approves it.</p>' +
      '<nav class="cx-tabs"><button type="button" data-cxat="open" aria-pressed="' + (ccActTab === "open") + '">Awaiting decision <em>' + wait.length + '</em></button><button type="button" data-cxat="done" aria-pressed="' + (ccActTab === "done") + '">Completed <em>' + done.length + '</em></button></nav>' +
      '<ul class="cx-acl">' + list.map(function (i) {
        return '<li class="' + (i.sev === "h" ? "c" : "w") + '"><div><header>' + cxTag(i.mod) + cxSevChip(i.sev) + '<span>' + cxe(i.agent) + ' · ' + cxe(i.at) + '</span></header>' + cxItemLink(i, "b") + '<p>' + cxe(i.act) + '</p><small>' + (i.run === undefined ? "" : (i.run ? "Runs on Trading Grid · " : "Handoff · ")) + cxe(i.partner) + (ccOn("pm") ? ' · ' + cxe(cxProcName(i.proc)) : "") + ' · ' + (i.mod === "RT" ? "Owner: " + cxe(i.owner) : "Approver: " + cxe(i.appr)) + '</small></div>' +
          '<div class="cx-acb">' + (i.actDone ? '<span class="cx-done">' + ci("ok") + cxe(i.actState) + '</span>' : i.actBtn) + '<button type="button" class="cx-btn" ' + i.open + '>Review</button></div></li>';
      }).join("") + (list.length ? "" : '<li class="cx-empty">' + (ccActTab === "open" ? "No actions waiting." : "No completed actions yet.") + '</li>') + '</ul>';
  };

  /* The first transactions behind a finding, with control numbers and acknowledgment status. Illustrative. */
  function cxAffected(f) {
    var code = (/\((\d{3})\)/.exec(CXDOC[f.id] || "") || [0, "997"])[1], s = CCFLOW[ccRole()][f.p].steps[f.st] || ["In"], pre = { "850": "PO-", "855": "PO-", "856": "ASN-", "810": "INV-", "820": "REM-", "832": "CAT-", "997": "INV-" }[code] || "DOC-";
    var notSent = /not sent|No 856|no 855|not delivered|not received/i.test(f.ot), rows = [];
    for (var j = 0; j < Math.min(5, f.n || 1); j++) {
      var seed = f.id.charCodeAt(1) * 977 + j * 131 + 3301, t = 9 * 60 + 20 - j * 23 - seed % 9;
      rows.push('<tr><td>' + (notSent ? "Not sent" : '<code>' + String(100000000 + seed * 17).slice(-9) + '</code>') + '</td><td>' + (notSent ? "" : '<code>' + ("000" + (j + 1)).slice(-4) + '</code>') + '</td><td>' + pre + (40000 + seed % 59999) + '</td><td>' + ("0" + Math.floor(t / 60)).slice(-2) + ':' + ("0" + t % 60).slice(-2) + '</td><td>' + cxe(f.how) + '</td></tr>');
    }
    return '<table class="cx-tbl cx-aff"><thead><tr><th>ISA13</th><th>ST02</th><th>Reference</th><th>Time</th><th>Check</th></tr></thead><tbody>' + rows.join("") + '</tbody></table><p class="cx-note">' + (f.n > 5 ? "First 5 of " + f.n + " · " : "") + code + " " + s[0] + ' · <button type="button" class="cx-lk" data-wstgi>Open in TG Insights</button></p>';
  }
  /* Drawers: a finding, or help */
  function cxDrawer() {
    if (!ccDr) return "";
    var h;
    if (ccDr[0] === "f") {
      var f = cxById(ccDr[1]), P = ccProc(f.p), done = ccDone[f.id], pm = ccOn("pm");
      h = '<header><span><p>Finding · ' + cxe(cxAgentName(f)) + '</p><h3>' + cxe(f.ot) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
        '<p class="cx-chipsr">' + cxSevChip(f.sev) + cxStChip(f) + cxTag(f.mod === "Integration Monitor" ? "IM" : "PM") + '<span class="cx-tg">' + cxe(f.how) + '</span></p><p>' + cxe(f.os) + '</p>' +
        '<div class="cx-imp"><b>' + cxe(f.bt) + '</b><span>' + cxe(f.bs) + '</span></div>' +
        '<dl class="cx-dl"><div><dt>Partner</dt><dd>' + cxe(f.partner) + '</dd></div>' + (pm ? '<div><dt>Process</dt><dd><button type="button" class="cx-lk" data-cxproc="' + f.p + '">' + cxe(P.n) + '</button>, step ' + ccStepNo(f.p, f.st) + ': ' + cxe(ccStepName(f.p, f.st)) + '</dd></div>' : "") +
        '<div><dt>' + (f.mod === "Integration Monitor" ? "Check" : "Rule") + '</dt><dd>' + cxe(CXRULE[f.id]) + '</dd></div><div><dt>Transactions</dt><dd>' + cxe(CXDOC[f.id]) + '</dd></div></dl>' +
        '<h4>Affected transactions</h4>' + cxAffected(f) +
        '<h4>Timeline</h4><ol class="cx-tl">' + f.ev.map(function (e) { return '<li><b>' + cxe(e[0]) + '</b><span>' + cxe(e[1]) + '</span></li>'; }).join("") + '</ol>' +
        '<h4>Root cause</h4><p>' + cxe(f.cause) + '</p><h4>Recommended action</h4><div class="cx-rec">' + ci("bot") + '<span>' + cxe(f.act) + '<small>Approver: ' + cxe(f.appr) + '</small></span></div>' +
        '<h4>Teams involved</h4><p>' + f.who.map(cxe).join(", ") + '</p></div><div class="cx-ft">' + (done ? '<span class="cx-done">' + ci("ok") + (done === 2 ? "Marked as known issue" : (cxRun(f.id) ? "Approved. Runs on Trading Grid; closes when the documents are exchanged." : "Task created for " + (f.appr || "the owner") + ".")) + '</span>' :
          '<button type="button" class="cx-btn p" data-cxapp="' + f.id + '">' + (cxRun(f.id) ? "Approve and run" : "Create task for " + cxe(f.appr || "owner")) + '</button><button type="button" class="cx-btn" data-cxknown="' + f.id + '">Mark as known issue</button>') + '</div>';
    } else if (ccDr[0] === "help") {
      h = '<header><span><p>Clickable prototype</p><h3>Command Center</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
        '<p>Switch the package in the top bar to see what each client gets.</p><dl class="cx-dl cx-dl1"><div><dt>' + cxTag("IM") + '</dt><dd>Standard for every Trading Grid client: daily digest, transaction volume, projections and anomalies, partners with network graph and integration analysis, Ivy the volume agent.</dd></div>' +
        '<div><dt>' + cxTag("PM") + '</dt><dd>Add-on for any industry: business processes, agents, rules and the partner scorecard.</dd></div>' +
        '<div><dt>' + cxTag("RT") + '</dt><dd>Includes Performance Monitor and adds retail processes, cases, policy templates, KPIs and the retailer and supplier perspectives.</dd></div></dl>' +
        '<p class="cx-sub">All partners, records and outcomes are illustrative. No live network is connected.</p></div>';
    } else return "";
    return '<div class="cx-scrim" data-cxclose></div><aside class="cx-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  }

  /* Aviator: scripted answers over the shared findings. Packages append questions. */
  var CXQ = [
    { q: function () { return "What should I work on first?"; }, a: function () {
      var hi = cxSort(ccItems().filter(function (i) { return !i.done; }));
      return [cxAnalysis(hi), hi.slice(0, 3)]; } },
    { q: function () { return ccRole() === "retailer" ? "Why are orders to Meadowline Care down?" : "Why are Harbor Grocers orders down?"; }, a: function () {
      var t = ccRole() === "retailer" ? "Ivy found outbound order volume to Meadowline Care 64% below projection since 05:52. Meadowline Care moved its AS2 endpoint in a maintenance window, so deliveries to the previous address fail. The weekly remittance advice to Meadowline Care is blocked by the same change."
        : "Ivy found order volume 64% below projection since 05:52. AS2 receipts from Harbor Grocers fail signature checks because the partner rotated its signing certificate. The weekly remittance advice is missing for the same reason.";
      return [t, ccItems().filter(function (i) { return i.key === "f:f2" || i.key === "f:f7"; })]; } },
    { q: function () { return "What needs my approval?"; }, a: function () {
      var w = cxSort(ccItems().filter(function (i) { return !i.actDone; }));
      return [w.length + " actions wait for a decision. The most urgent:", w.slice(0, 3)]; } }
  ];
  function cxAviator() {
    if (!ccAv) return "";
    var log = ccAvLog.map(function (m) { return '<li class="' + m[0] + '">' + m[1] + '</li>'; }).join("");
    return '<aside class="cx-av"><header>' + ci("spark") + '<b>Aviator</b><button type="button" class="cx-ic" data-cxav aria-label="Close Aviator">' + ci("x") + '</button></header><div class="cx-avb"><p class="cx-hi">Ask about partners, findings and anomalies' + (ccOn("pm") ? ", processes or agents" : "") + ' for ' + cxe(ccCompany()) + '.</p><ul class="cx-avl">' + log + '</ul>' +
      '<ul class="cx-avq">' + CXQ.filter(function (q) { return !q.t || ccOn(q.t); }).map(function (q) { return '<li><button type="button" data-cxq="' + CXQ.indexOf(q) + '">' + cxe(q.q()) + '</button></li>'; }).join("") + '</ul></div><div class="cx-ft"><span>Ask Aviator. Use @ to add agents.</span><button type="button" class="cx-ic" aria-label="Send" disabled>' + ci("send") + '</button><small>Scripted answers over illustrative data. AI can make mistakes. Check important information.</small></div></aside>';
  }
  function cxAsk(k) {
    var q = CXQ[k], r = q.a();
    ccAvLog.push(["q", cxe(q.q())], ["a", cxe(r[0]) + (r[1].length ? '<span class="cx-avr">' + r[1].map(function (i) { return cxItemLink(i); }).join("") + '</span>' : "")]);
  }

  /* Shell. Six entries for every package. Overview gains dashboards and Workspace gains sections as packages are added. */
  var CXNAV = [["dash", "Overview", "dash"], ["find", "Findings", "search"], ["act", "Action queue", "check"], ["im-tp", "Partners", "users"], ["ws", "Workspace", "grid"], ["cfg", "Configuration", "cog"]];
  var CXOV = ["dash", "im-proj", "im-vol", "ws-dash"];
  var CXWS = [["ws-proc", "Business processes", "pm"], ["ws-rep", "Reports"], ["ws-not", "Notifications"], ["ws-task", "Tasks and reminders"], ["ws-agents", "Agents"]];
  function cxWsSecs() { return CXWS.filter(function (w) { return !w[2] || ccOn(w[2]); }); }
  function cxNavKey(s) { return CXOV.indexOf(s) >= 0 ? "dash" : s.indexOf("ws-") === 0 ? "ws" : s; }
  var CXALIAS = { "im-dash": "dash", "pm-dash": "dash", "rt-home": "dash", "pm-find": "find", "pm-act": "act", "rt-actions": "act", "pm-agents": "ws-agents", "pm-rules": "cfg", "rt-rules": "cfg", "im-cfg": "cfg",
    "im-map": "ws-proc", "pm-proc": "ws-proc", "im-com": "im-tp", "an": "ws-dash", "rt-partners": "im-tp", "rt-orders": "ws-proc", "rt-shipments": "ws-proc", "rt-invoices": "ws-proc" };
  function cxNavOk(s) { return CXOV.indexOf(s) >= 0 || cxWsSecs().some(function (w) { return w[0] === s; }) || s !== "ws" && CXNAV.some(function (g) { return g[0] === s; }); }
  function cxMod() { var m = cxModKey(); return m ? CCMOD[m][0] : ""; }
  function cxBadge(k) { var it = ccItems(); var n = k === "find" ? it.filter(function (i) { return !i.done; }).length : k === "act" ? it.filter(function (i) { return !i.actDone; }).length : 0; return n ? '<em class="cx-nb">' + n + '</em>' : ""; }
  function cxTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function cxRender() {
    if (!cxNavOk(ccScr)) ccScr = "dash";
    var cur = cxNavKey(ccScr), nav = CXNAV.map(function (g) {
      return '<li><button type="button" class="cx-n1' + (cur === g[0] ? " on" : "") + '" data-cxgo="' + g[0] + '" title="' + g[1] + '"' + (cur === g[0] ? ' aria-current="page"' : "") + '>' + ci(g[2]) + '<span>' + g[1] + '</span>' + cxBadge(g[0]) + '</button></li>';
    }).join("");
    var th = cxTheme();
    cx.classList.toggle("glass", CXOV.indexOf(ccScr) >= 0);
    cx.innerHTML = '<header class="cx-top"><span class="cx-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#0066FF"/><path d="M22.5 13.6h1.8l1.3-2.1h-3.1V8.1h-3.9v5.9a6.8 6.8 0 1 0 0 6.3c0 1 .1 1.7.6 2.4.8 1.2 2.3 1.3 3.6 1.3.7 0 1.1-.1 1.8-.2v-2.8l-1 .1c-1 0-1-.7-1-1.5zM12.6 20.2a3.1 3.1 0 1 1 0-6.1 3.1 3.1 0 0 1 0 6.1z" fill="#fff"/></svg>Command Center' + (cxMod() ? '<em>' + cxMod() + '</em>' : '') + '</span>' +
      '<span class="cx-cust">' + cxe(ccCompany()) + (ccOn("rt") ? ' · Retail and CPG' : '') + '</span><label class="cx-pkg"><span>Package</span><select data-cxpkg aria-label="Package">' + Object.keys(CCPKG).map(function (k) { return '<option value="' + k + '"' + (k === ccPkg ? " selected" : "") + '>' + CCPKGN[k] + '</option>'; }).join("") + '</select></label>' +
      '<span class="cx-tb"><button type="button" class="cx-avt" data-cxav aria-pressed="' + ccAv + '">' + ci("spark") + 'Aviator</button><button type="button" class="cx-ic" data-cxgo="act" aria-label="Open action queue">' + ci("bell") + '</button><button type="button" class="cx-ic" data-cxhelp aria-label="Help">' + ci("help") + '</button>' +
      '<button type="button" class="cx-ic" data-cxtheme aria-label="' + (th === "dark" ? "Switch to light theme" : "Switch to dark theme") + '">' + ci(th === "dark" ? "sun" : "moon") + '</button><button type="button" class="cx-ic" data-cxfs aria-label="Full screen">' + ci("full") + '</button><span class="cx-me" title="' + cxe(ccCompany()) + '">' + (ccRole() === "retailer" ? "NS" : "NB") + '</span></span></header>' +
      '<div class="cx-body' + (ccNavMin ? " min" : "") + (ccAv ? " av" : "") + '"><nav class="cx-nav" aria-label="Command Center"><ul>' + nav + '</ul><a class="cx-n1 cx-col" href="' + CC_GENOME + '" title="Open Process Genome">' + ci("gen") + '<span>Open Process Genome</span></a><button type="button" class="cx-n1 cx-col" data-cxmin title="' + (ccNavMin ? "Expand panel" : "Collapse panel") + '">' + ci("side") + '<span>Collapse panel</span></button></nav>' +
      '<main class="cx-main" id="cx-main">' + CXS[ccScr]() + '</main>' + cxAviator() + '</div>' + cxDrawer();
  }
  function cxGo(s) { if (s === "ws") s = cxWsSecs()[0][0]; if (s === "im-map") ccWsProc = "sol"; if (s === "an") ccWsDash = "p:pm"; if (s === "rt-partners") ccPtTab = "req"; s = CXALIAS[s] || s; if (!CXS[s] || !cxNavOk(s)) s = "dash"; ccScr = s; ccDr = null; cxRender(); var el = document.getElementById("cx-main"); if (el) el.scrollTop = 0; }
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cxgo],[data-cxmin],[data-cxav],[data-cxf],[data-cxproc],[data-cxclose],[data-cxapp],[data-cxknown],[data-cxtab],[data-cxpj],[data-cxq],[data-cxfs],[data-cxmod],[data-cxat],[data-cxtheme],[data-cxcfg],[data-cxpt],[data-cxhelp]"); if (!b) return;
    if (b.hasAttribute("data-cxgo")) cxGo(b.getAttribute("data-cxgo"));
    else if (b.hasAttribute("data-cxmin")) { ccNavMin = !ccNavMin; cxRender(); }
    else if (b.hasAttribute("data-cxav")) { ccAv = !ccAv; cxRender(); }
    else if (b.hasAttribute("data-cxf")) { ccDr = ["f", b.getAttribute("data-cxf")]; cxRender(); }
    else if (b.hasAttribute("data-cxproc")) { if (ccOn("pm")) { ccWsProc = b.getAttribute("data-cxproc"); cxGo("ws-proc"); } }
    else if (b.hasAttribute("data-cxclose")) { ccDr = null; cxRender(); }
    else if (b.hasAttribute("data-cxhelp")) { ccDr = ["help"]; cxRender(); }
    else if (b.hasAttribute("data-cxapp")) { ccDone[b.getAttribute("data-cxapp")] = 1; cxRender(); }
    else if (b.hasAttribute("data-cxknown")) { ccDone[b.getAttribute("data-cxknown")] = 2; cxRender(); }
    else if (b.hasAttribute("data-cxtab")) { ccTab = b.getAttribute("data-cxtab"); cxRender(); }
    else if (b.hasAttribute("data-cxpj")) { ccPj = +b.getAttribute("data-cxpj"); cxRender(); }
    else if (b.hasAttribute("data-cxq")) { cxAsk(+b.getAttribute("data-cxq")); cxRender(); var l = cx.querySelector(".cx-avb"); if (l) l.scrollTop = l.scrollHeight; }
    else if (b.hasAttribute("data-cxmod")) { ccModF = b.getAttribute("data-cxmod"); cxRender(); var f = cx.querySelector('[data-cxmod="' + ccModF + '"]'); if (f) f.focus({ preventScroll: true }); }
    else if (b.hasAttribute("data-cxcfg")) { ccCfgTab = b.getAttribute("data-cxcfg"); cxRender(); }
    else if (b.hasAttribute("data-cxpt")) { ccPtTab = b.getAttribute("data-cxpt"); cxRender(); }
    else if (b.hasAttribute("data-cxat")) { ccActTab = b.getAttribute("data-cxat"); cxRender(); }
    else if (b.hasAttribute("data-cxtheme")) { var n = cxTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("edi-guide-theme", n); } catch (err) {} cxRender(); }
    else if (b.hasAttribute("data-cxfs")) { if (document.fullscreenElement) document.exitFullscreen(); else if (ccEl.requestFullscreen) ccEl.requestFullscreen().catch(function () {}); }
  });
  function ccSetPkg(k) { if (!CCPKG[k]) return; ccPkg = k; ccModF = "all"; ccDr = null; ccAvLog = []; try { localStorage.setItem("process-genome-cc-package", k); } catch (err) {} cxRender(); }
  cx.addEventListener("change", function (e) {
    if (e.target.matches("[data-cxsev]")) { ccSevF = e.target.value; cxRender(); }
    else if (e.target.matches("[data-cxstf]")) { ccStF = e.target.value; cxRender(); }
    else if (e.target.matches("[data-cxpkg]")) ccSetPkg(e.target.value);
  });
  document.addEventListener("keydown", function (e) { if (e.key !== "Escape" || !ccDr || ccDr[0] !== "f" && ccDr[0] !== "help") return; e.preventDefault(); ccDr = null; cxRender(); });
  function ccFit() { ccEl.classList.toggle("small", window.innerWidth < 1024 || window.innerHeight < 560); }
  function ccStart() { ccFit(); cxRender(); }
  window.addEventListener("resize", ccFit);
